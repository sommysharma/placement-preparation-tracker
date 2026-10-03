import { useEffect, useState } from "react";
import "./Companies.css";

function Companies() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [form, setForm] = useState({
    application_date: "",
    company_name: "",
    role: "",
    package_lpa: "",
    status: "Applied",
    total_rounds: "",
    rounds_cleared: "",
    notes: ""
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  async function fetchCompanies() {
    try {
      const response = await fetch(
        `http://localhost:5000/api/companies/${user.id}`
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setCompanies(data);
    } catch (error) {
      console.log(error);
      alert("Failed to load companies");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  function openAddModal() {
    setEditingCompany(null);

    setForm({
      application_date: "",
      company_name: "",
      role: "",
      package_lpa: "",
      status: "Applied",
      total_rounds: "",
      rounds_cleared: "",
      notes: ""
    });

    setShowModal(true);
  }

  function openEditModal(company) {
    setEditingCompany(company);

    setForm({
      application_date:
        company.application_date
          ? company.application_date.split("T")[0]
          : "",

      company_name: company.company_name,

      role: company.role,

      package_lpa:
        company.package_lpa ?? "",

      status:
        company.status || "Applied",

      total_rounds:
        company.total_rounds ?? "",

      rounds_cleared:
        company.rounds_cleared ?? "",

      notes:
        company.notes || ""
    });

    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingCompany(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !form.application_date ||
      !form.company_name.trim() ||
      !form.role.trim()
    ) {
      alert("Please fill Date, Company Name and Role");
      return;
    }

    try {
      const url = editingCompany
        ? `http://localhost:5000/api/companies/${editingCompany.id}`
        : "http://localhost:5000/api/companies";

      const method = editingCompany
        ? "PUT"
        : "POST";

      const body = editingCompany
        ? form
        : {
            ...form,
            user_id: user.id
          };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      closeModal();
      fetchCompanies();
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  async function deleteCompany(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/companies/${id}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      fetchCompanies();
    } catch (error) {
      console.log(error);
      alert("Failed to delete application");
    }
  }

  const filteredCompanies = companies.filter(
    (company) => {
      const matchesSearch =
        company.company_name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        company.role
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        company.status === statusFilter;

      return matchesSearch && matchesStatus;
    }
  );

  const totalApplications = companies.length;

  const selectedCount = companies.filter(
    (company) =>
      company.status === "Selected" ||
      company.status === "Offer"
  ).length;

  const interviewCount = companies.filter(
    (company) =>
      company.status === "Interview"
  ).length;

  const activeApplications = companies.filter(
    (company) =>
      company.status !== "Rejected" &&
      company.status !== "Selected" &&
      company.status !== "Offer"
  ).length;

  if (loading) {
    return (
      <div className="companies-page">
        <h2>Loading applications...</h2>
      </div>
    );
  }

  return (
    <div className="companies-page">

      <div className="companies-header">

        <div>
          <h1>Company Tracker</h1>

          <p>
            Track your placement applications,
            interviews and offers.
          </p>
        </div>

        <button
          className="add-company-button"
          onClick={openAddModal}
        >
          + Add Application
        </button>

      </div>

      <div className="company-stats">

        <div className="company-stat-card">
          <span>Total Applications</span>
          <strong>{totalApplications}</strong>
        </div>

        <div className="company-stat-card">
          <span>Active Applications</span>
          <strong>{activeApplications}</strong>
        </div>

        <div className="company-stat-card">
          <span>Interviews</span>
          <strong>{interviewCount}</strong>
        </div>

        <div className="company-stat-card">
          <span>Selected / Offers</span>
          <strong>{selectedCount}</strong>
        </div>

      </div>

      <div className="company-filters">

        <div className="company-search">

          <input
            type="text"
            placeholder="Search company or role..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option value="All">
            All Status
          </option>

          <option value="Applied">
            Applied
          </option>

          <option value="Online Assessment">
            Online Assessment
          </option>

          <option value="Shortlisted">
            Shortlisted
          </option>

          <option value="Interview">
            Interview
          </option>

          <option value="Selected">
            Selected
          </option>

          <option value="Offer">
            Offer
          </option>

          <option value="Rejected">
            Rejected
          </option>
        </select>

      </div>

      {filteredCompanies.length === 0 ? (

        <div className="company-empty">

          <h3>
            No applications found
          </h3>

          <p>
            Add your first company application
            to start tracking your placement journey.
          </p>

        </div>

      ) : (

        <div className="company-list">

          {filteredCompanies.map(
            (company) => {

              const totalRounds =
                Number(company.total_rounds) || 0;

              const roundsCleared =
                Number(company.rounds_cleared) || 0;

              const roundProgress =
                totalRounds > 0
                  ? Math.min(
                      (roundsCleared /
                        totalRounds) *
                        100,
                      100
                    )
                  : 0;

              return (
                <div
                  className="company-card"
                  key={company.id}
                >

                  <div className="company-card-top">

                    <div>

                      <h3>
                        {company.company_name}
                      </h3>

                      <div className="company-role">
                        {company.role}
                      </div>

                    </div>

                    <span className="company-status">
                      {company.status}
                    </span>

                  </div>

                  <div className="company-info">

                    <div className="company-info-item">

                      <span>
                        Package
                      </span>

                      <strong>
                        {company.package_lpa
                          ? `${company.package_lpa} LPA`
                          : "Not specified"}
                      </strong>

                    </div>

                    <div className="company-info-item">

                      <span>
                        Total Rounds
                      </span>

                      <strong>
                        {totalRounds}
                      </strong>

                    </div>

                    <div className="company-info-item">

                      <span>
                        Rounds Cleared
                      </span>

                      <strong>
                        {roundsCleared}
                      </strong>

                    </div>

                  </div>

                  <div className="company-rounds">

                    <div className="company-rounds-header">

                      <span>
                        Interview Progress
                      </span>

                      <span>
                        {roundsCleared} /{" "}
                        {totalRounds}
                      </span>

                    </div>

                    <div className="company-rounds-bar">

                      <div
                        className="company-rounds-progress"
                        style={{
                          width: `${roundProgress}%`
                        }}
                      />

                    </div>

                  </div>

                  <div className="company-date">
                    Date:{" "}
                    {company.application_date
                      ? new Date(
                          company.application_date
                        ).toLocaleDateString(
                          "en-IN"
                        )
                      : "Not specified"}
                  </div>

                  {company.notes && (

                    <div className="company-notes">
                      {company.notes}
                    </div>

                  )}

                  <div className="company-actions">

                    <button
                      className="company-edit-button"
                      onClick={() =>
                        openEditModal(company)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="company-delete-button"
                      onClick={() =>
                        deleteCompany(company.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>
              );
            }
          )}

        </div>

      )}

      {showModal && (

        <div className="company-modal-overlay">

          <div className="company-modal">

            <div className="company-modal-header">

              <h2>
                {editingCompany
                  ? "Edit Application"
                  : "Add Application"}
              </h2>

              <button
                className="company-close-button"
                onClick={closeModal}
              >
                ×
              </button>

            </div>

            <form
              className="company-form"
              onSubmit={handleSubmit}
            >

              <div className="company-form-group">

                <label>
                  Date
                </label>

                <input
                  type="date"
                  name="application_date"
                  value={
                    form.application_date
                  }
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="company-form-group">

                <label>
                  Company Name
                </label>

                <input
                  type="text"
                  name="company_name"
                  placeholder="e.g. TCS"
                  value={
                    form.company_name
                  }
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="company-form-group">

                <label>
                  Role
                </label>

                <input
                  type="text"
                  name="role"
                  placeholder="e.g. Software Engineer"
                  value={form.role}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="company-form-row">

                <div className="company-form-group">

                  <label>
                    Package (LPA)
                  </label>

                  <input
                    type="number"
                    name="package_lpa"
                    placeholder="e.g. 7.5"
                    step="0.01"
                    min="0"
                    value={
                      form.package_lpa
                    }
                    onChange={handleChange}
                  />

                </div>

                <div className="company-form-group">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="Applied">
                      Applied
                    </option>

                    <option value="Online Assessment">
                      Online Assessment
                    </option>

                    <option value="Shortlisted">
                      Shortlisted
                    </option>

                    <option value="Interview">
                      Interview
                    </option>

                    <option value="Selected">
                      Selected
                    </option>

                    <option value="Offer">
                      Offer
                    </option>

                    <option value="Rejected">
                      Rejected
                    </option>

                  </select>

                </div>

              </div>

              <div className="company-form-row">

                <div className="company-form-group">

                  <label>
                    Total Rounds
                  </label>

                  <input
                    type="number"
                    name="total_rounds"
                    min="0"
                    placeholder="e.g. 4"
                    value={
                      form.total_rounds
                    }
                    onChange={handleChange}
                  />

                </div>

                <div className="company-form-group">

                  <label>
                    Rounds Cleared
                  </label>

                  <input
                    type="number"
                    name="rounds_cleared"
                    min="0"
                    placeholder="e.g. 2"
                    value={
                      form.rounds_cleared
                    }
                    onChange={handleChange}
                  />

                </div>

              </div>

              <div className="company-form-group">

                <label>
                  Notes
                </label>

                <textarea
                  name="notes"
                  placeholder="Add interview details, OA information, preparation notes..."
                  value={form.notes}
                  onChange={handleChange}
                />

              </div>

              <div className="company-form-actions">

                <button
                  type="button"
                  className="company-cancel-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="company-save-button"
                >
                  {editingCompany
                    ? "Update Application"
                    : "Add Application"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Companies;