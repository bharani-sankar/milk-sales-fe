import React, { useState, useEffect } from "react"; // Added useEffect
import { useSelector, useDispatch } from "react-redux";
// Import async action creators
import {
  addVendor,
  updateVendor,
  deleteVendor,
  showToast,
  fetchVendors,
} from "../redux/actions";

const VendorManagement = () => {
  const dispatch = useDispatch();
  const vendors = useSelector((state) => state.vendors);
  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    area: "",
    deliveryTime: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... rest of handleSubmit logic
    await dispatch(
      editingVendor
        ? updateVendor({ ...formData, id: editingVendor.id })
        : addVendor(formData)
    );
    setShowModal(false);
    setEditingVendor(null);
    setFormData({ name: "", contact: "", area: "", deliveryTime: "" });
  };

  const handleEdit = (vendor) => {
    setEditingVendor(vendor);
    setFormData(vendor);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    // Made async
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      await dispatch(deleteVendor(id)); // Use async action
    }
  };

  const handleAdd = () => {
    setEditingVendor(null);
    setFormData({ name: "", contact: "", area: "", deliveryTime: "" });
    setShowModal(true);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Vendor Management</h2>
        <button className="btn btn-primary" onClick={handleAdd}>
          <i className="fas fa-plus me-2"></i>Add Vendor
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Area/Route</th>
              <th>Delivery Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id}>
                <td>{vendor.name}</td>
                <td>{vendor.contact}</td>
                <td>{vendor.area}</td>
                <td>{vendor.deliveryTime}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleEdit(vendor)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(vendor.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingVendor ? "Edit Vendor" : "Add Vendor"}
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
                    <label className="form-label">Area/Route *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.area}
                      onChange={(e) =>
                        setFormData({ ...formData, area: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Preferred Delivery Time *
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      value={formData.deliveryTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          deliveryTime: e.target.value,
                        })
                      }
                      required
                    />
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
                    {editingVendor ? "Update" : "Add"} Vendor
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

export default VendorManagement;
