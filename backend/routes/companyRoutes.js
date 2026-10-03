const express = require("express");

const {
  getCompanies,
  addCompany,
  updateCompany,
  deleteCompany
} = require("../controllers/companyController");

const router = express.Router();

router.get("/:userId", getCompanies);

router.post("/", addCompany);

router.put("/:id", updateCompany);

router.delete("/:id", deleteCompany);

module.exports = router;