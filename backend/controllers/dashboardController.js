const db = require("../config/db");

const getDashboard = (req, res) => {
  const userId = req.params.userId;

  const dsaQuery = `
    SELECT COUNT(*) AS solved
    FROM user_dsa_progress
    WHERE user_id = ?
  `;

  const sqlQuery = `
    SELECT COUNT(*) AS solved
    FROM user_sql_progress
    WHERE user_id = ?
  `;

  const companyQuery = `
    SELECT
      COUNT(*) AS totalApplications,

      SUM(
        CASE
          WHEN status = 'Interview'
          THEN 1
          ELSE 0
        END
      ) AS interviews,

      SUM(
        CASE
          WHEN status = 'Selected'
            OR status = 'Offer'
          THEN 1
          ELSE 0
        END
      ) AS selected,

      SUM(
        CASE
          WHEN status = 'Rejected'
          THEN 1
          ELSE 0
        END
      ) AS rejected

    FROM companies
    WHERE user_id = ?
  `;

  db.query(dsaQuery, [userId], (dsaError, dsaResult) => {
    if (dsaError) {
      console.log(dsaError);

      return res.status(500).json({
        message: "Failed to fetch DSA statistics"
      });
    }

    db.query(sqlQuery, [userId], (sqlError, sqlResult) => {
      if (sqlError) {
        console.log(sqlError);

        return res.status(500).json({
          message: "Failed to fetch SQL statistics"
        });
      }

      db.query(
        companyQuery,
        [userId],
        (companyError, companyResult) => {
          if (companyError) {
            console.log(companyError);

            return res.status(500).json({
              message: "Failed to fetch company statistics"
            });
          }

          const dsaSolved = dsaResult[0].solved || 0;
          const sqlSolved = sqlResult[0].solved || 0;

          const totalApplications =
            companyResult[0].totalApplications || 0;

          const interviews =
            companyResult[0].interviews || 0;

          const selected =
            companyResult[0].selected || 0;

          const rejected =
            companyResult[0].rejected || 0;

          res.status(200).json({
            dsaSolved,
            sqlSolved,
            totalApplications,
            interviews,
            selected,
            rejected
          });
        }
      );
    });
  });
};

module.exports = {
  getDashboard
};