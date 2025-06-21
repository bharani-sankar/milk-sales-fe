import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// Import the async action creators
import {
  addSupplier,
  updateSupplier,
  deleteSupplier,
  showToast,
} from "../redux/actions";

const SupplierManagement = () => {
  const dispatch = useDispatch();
  const suppliers = useSelector((state) => state.suppliers);
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    address: "",
    shiftPreference: "Morning",
  });

  const handleSubmit = async (e) => {
    // Make handleSubmit async
    e.preventDefault();

    if (!formData.name || !formData.contact || !formData.address) {
      dispatch(showToast("Please fill all required fields", "danger"));
      return;
    }

    // Dispatch the async action creator
    if (editingSupplier) {
      await dispatch(updateSupplier({ ...formData, id: editingSupplier.id }));
    } else {
      await dispatch(addSupplier(formData));
    }

    setShowModal(false);
    setEditingSupplier(null);
    setFormData({
      name: "",
      contact: "",
      address: "",
      shiftPreference: "Morning",
    });
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData(supplier);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    // Make handleDelete async
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      await dispatch(deleteSupplier(id));
    }
  };

  const handleAdd = () => {
    setEditingSupplier(null);
    setFormData({
      name: "",
      contact: "",
      address: "",
      shiftPreference: "Morning",
    });
    setShowModal(true);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Supplier Management</h2>
        <button className="btn btn-primary" onClick={handleAdd}>
          <i className="fas fa-plus me-2"></i>Add Supplier
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Address</th>
              <th>Shift Preference</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td>{supplier.name}</td>
                <td>{supplier.contact}</td>
                <td>{supplier.address}</td>
                <td>
                  <span
                    className={`badge bg-${
                      supplier.shiftPreference === "Morning"
                        ? "primary"
                        : "info"
                    }`}
                  >
                    {supplier.shiftPreference}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleEdit(supplier)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(supplier.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal (No change here) */}
      {showModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingSupplier ? "Edit Supplier" : "Add Supplier"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contact *</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={formData.contact}
                      onChange={(e) =>
                        setFormData({ ...formData, contact: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address *</label>
                    <textarea
                      className="form-control"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Shift Preference</label>
                    <select
                      className="form-select"
                      value={formData.shiftPreference}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shiftPreference: e.target.value,
                        })
                      }
                    >
                      <option value="Morning">Morning</option>
                      <option value="Evening">Evening</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingSupplier ? "Update" : "Add"} Supplier
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

export default SupplierManagement;
