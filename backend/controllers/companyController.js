const db = require("../config/db");

const getCompanies = (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT *
    FROM companies
    WHERE user_id = ?
    ORDER BY application_date DESC, id DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Failed to fetch companies"
      });
    }

    res.status(200).json(results);
  });
};

const addCompany = (req, res) => {
  const {
    user_id,
    application_date,
    company_name,
    role,
    package_lpa,
    status,
    total_rounds,
    rounds_cleared,
    notes
  } = req.body;

  const sql = `
    INSERT INTO companies
    (
      user_id,
      application_date,
      company_name,
      role,
      package_lpa,
      status,
      total_rounds,
      rounds_cleared,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      user_id,
      application_date,
      company_name,
      role,
      package_lpa,
      status,
      total_rounds,
      rounds_cleared,
      notes
    ],
    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Failed to add company"
        });
      }

      res.status(201).json({
        message: "Company added successfully",
        companyId: result.insertId
      });
    }
  );
};

const updateCompany = (req, res) => {
  const companyId = req.params.id;

  const {
    application_date,
    company_name,
    role,
    package_lpa,
    status,
    total_rounds,
    rounds_cleared,
    notes
  } = req.body;

  const sql = `
    UPDATE companies
    SET
      application_date = ?,
      company_name = ?,
      role = ?,
      package_lpa = ?,
      status = ?,
      total_rounds = ?,
      rounds_cleared = ?,
      notes = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      application_date,
      company_name,
      role,
      package_lpa,
      status,
      total_rounds,
      rounds_cleared,
      notes,
      companyId
    ],
    (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Failed to update company"
        });
      }

      res.status(200).json({
        message: "Company updated successfully"
      });
    }
  );
};

const deleteCompany = (req, res) => {
  const companyId = req.params.id;

  const sql = `
    DELETE FROM companies
    WHERE id = ?
  `;

  db.query(sql, [companyId], (err) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Failed to delete company"
      });
    }

    res.status(200).json({
      message: "Company deleted successfully"
    });
  });
};

module.exports = {
  getCompanies,
  addCompany,
  updateCompany,
  deleteCompany
};