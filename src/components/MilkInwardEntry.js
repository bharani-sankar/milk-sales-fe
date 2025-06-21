import React, { useState, useEffect } from "react"; // Added useEffect
import { useSelector, useDispatch } from "react-redux";
// Import async action creators
import {
  addInward,
  showToast,
  fetchInwards,
  fetchSuppliers,
} from "../redux/actions";

const MilkInwardEntry = () => {
  const dispatch = useDispatch();
  const suppliers = useSelector((state) => state.suppliers);
  const inwards = useSelector((state) => state.inwards);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    supplierId: "",
    shift: "Morning",
    quantity: "",
    fat: "",
    snf: "",
    microbialLoad: "Low",
  });

  const today = new Date().toISOString().split("T")[0];
  const todayInwards = inwards.filter((item) => item.date === today);
  const totalInward = todayInwards.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handleFormSubmit = async (e) => {
    // Made async
    e.preventDefault();

    if (
      !formData.supplierId ||
      !formData.quantity ||
      !formData.fat ||
      !formData.snf
    ) {
      dispatch(showToast("Please fill all required fields", "danger"));
      return;
    }

    const supplier = suppliers.find(
      (s) => s.id === parseInt(formData.supplierId)
    );

    if (!supplier) {
      dispatch(showToast("Invalid Supplier selected", "danger"));
      return;
    }

    const inwardData = {
      ...formData,
      supplierId: parseInt(formData.supplierId),
      supplierName: supplier.name,
      quantity: parseFloat(formData.quantity),
      fat: parseFloat(formData.fat),
      snf: parseFloat(formData.snf),
      date: today,
    };

    await dispatch(addInward(inwardData)); // Use async action

    setFormData({
      supplierId: "",
      shift: "Morning",
      quantity: "",
      fat: "",
      snf: "",
      microbialLoad: "Low",
    });
    setShowModal(false);
  };

  const handleAddButtonClick = () => {
    setFormData({
      supplierId: "",
      shift: "Morning",
      quantity: "",
      fat: "",
      snf: "",
      microbialLoad: "Low",
    });
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
    setFormData({
      supplierId: "",
      shift: "Morning",
      quantity: "",
      fat: "",
      snf: "",
      microbialLoad: "Low",
    });
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Milk Inward Entry</h2>
        <div className="d-flex align-items-center">
          <div className="alert alert-info py-2 px-3 m-0 me-3">
            <strong>Total Inward Today: {totalInward} Litres</strong>
          </div>
          <button className="btn btn-primary" onClick={handleAddButtonClick}>
            <i className="fas fa-plus me-2"></i>Add New Entry
          </button>
        </div>
      </div>

      <div className="mt-4">
        <h5>Today's Entries</h5>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Shift</th>
                <th>Quantity (L)</th>
                <th>Fat (%)</th>
                <th>SNF (%)</th>
                <th>Microbial Load</th>
              </tr>
            </thead>
            <tbody>
              {todayInwards.length === 0 ? ( // Added check for empty table
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No inward entries for today.
                  </td>
                </tr>
              ) : (
                todayInwards.map((inward) => (
                  <tr key={inward.id}>
                    <td>{inward.supplierName}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          inward.shift === "Morning" ? "primary" : "info"
                        }`}
                      >
                        {inward.shift}
                      </span>
                    </td>
                    <td>{inward.quantity}</td>
                    <td>{inward.fat}</td>
                    <td>{inward.snf}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          inward.microbialLoad === "Low"
                            ? "success"
                            : inward.microbialLoad === "Medium"
                            ? "warning"
                            : "danger"
                        }`}
                      >
                        {inward.microbialLoad}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for adding/editing milk inward entry */}
      {showModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Milk Inward Entry</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCancel}
                ></button>
              </div>
              <form onSubmit={handleFormSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Supplier *</label>
                    <select
                      className="form-select"
                      value={formData.supplierId}
                      onChange={(e) =>
                        setFormData({ ...formData, supplierId: e.target.value })
                      }
                      required
                    >
                      <option value="">Select Supplier</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Shift *</label>
                    <select
                      className="form-select"
                      value={formData.shift}
                      onChange={(e) =>
                        setFormData({ ...formData, shift: e.target.value })
                      }
                    >
                      <option value="Morning">Morning</option>
                      <option value="Evening">Evening</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Quantity (Litres) *</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Fat (%) *</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      value={formData.fat}
                      onChange={(e) =>
                        setFormData({ ...formData, fat: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">SNF (%) *</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      value={formData.snf}
                      onChange={(e) =>
                        setFormData({ ...formData, snf: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Microbial Load</label>
                    <select
                      className="form-select"
                      value={formData.microbialLoad}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          microbialLoad: e.target.value,
                        })
                      }
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit Entry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilkInwardEntry;
