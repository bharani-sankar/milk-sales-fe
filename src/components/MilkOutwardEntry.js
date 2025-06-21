import React, { useState, useEffect } from "react"; // Added useEffect
import { useSelector, useDispatch } from "react-redux";
// Import async action creators
import {
  addOutward,
  showToast,
  fetchOutwards,
  fetchVendors,
} from "../redux/actions";

const MilkOutwardEntry = () => {
  const dispatch = useDispatch();
  const vendors = useSelector((state) => state.vendors);
  const outwards = useSelector((state) => state.outwards);
  const inwards = useSelector((state) => state.inwards);
  const returns = useSelector((state) => state.returns);
  const paneerRedirects = useSelector((state) => state.paneerRedirects);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    vendorId: "",
    shift: "Morning",
    quantity: "",
    deliveryPerson: "",
  });

  const today = new Date().toISOString().split("T")[0];
  const todayOutwards = outwards.filter((item) => item.date === today);
  const todayInwards = inwards.filter((item) => item.date === today);
  const todayReturns = returns.filter((item) => item.date === today);
  const todayPaneerRedirects = paneerRedirects.filter(
    (item) => item.date === today
  );

  const totalInward = todayInwards.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const totalOutward = todayOutwards.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const totalReturns = todayReturns.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const totalPaneerRedirect = todayPaneerRedirects.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const coolerStock =
    totalInward + totalReturns - (totalOutward + totalPaneerRedirect);

  const handleFormSubmit = async (e) => {
    // Made async
    e.preventDefault();

    if (!formData.vendorId || !formData.quantity || !formData.deliveryPerson) {
      dispatch(showToast("Please fill all required fields", "danger"));
      return;
    }

    const quantity = parseFloat(formData.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      dispatch(showToast("Quantity must be a positive number", "danger"));
      return;
    }

    if (quantity > coolerStock) {
      dispatch(showToast("Insufficient stock in cooler", "danger"));
      return;
    }

    const vendor = vendors.find((v) => v.id === parseInt(formData.vendorId));
    if (!vendor) {
      dispatch(showToast("Invalid Vendor selected", "danger"));
      return;
    }

    const outwardData = {
      ...formData,
      vendorId: parseInt(formData.vendorId),
      vendorName: vendor.name,
      quantity: quantity,
      date: today,
    };

    await dispatch(addOutward(outwardData)); // Use async action

    setFormData({
      vendorId: "",
      shift: "Morning",
      quantity: "",
      deliveryPerson: "",
    });
    setShowModal(false);
  };

  const handleAddButtonClick = () => {
    setFormData({
      vendorId: "",
      shift: "Morning",
      quantity: "",
      deliveryPerson: "",
    });
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
    setFormData({
      vendorId: "",
      shift: "Morning",
      quantity: "",
      deliveryPerson: "",
    });
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Milk Outward Entry</h2>
        <div className="d-flex align-items-center flex-wrap">
          <div className="alert alert-warning py-2 px-3 m-0 me-3 mb-2 mb-md-0">
            <strong>Current Cooler Stock: {coolerStock} Litres</strong>
          </div>
          <div className="alert alert-info py-2 px-3 m-0 me-3 mb-2 mb-md-0">
            <strong>Total Supplied Today: {totalOutward} Litres</strong>
          </div>
          <button className="btn btn-primary" onClick={handleAddButtonClick}>
            <i className="fas fa-plus me-2"></i>Add New Entry
          </button>
        </div>
      </div>

      <div className="mt-4">
        <h5>Today's Outward Entries</h5>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Shift</th>
                <th>Quantity (L)</th>
                <th>Delivery Person</th>
                <th>Sales Quantity (L)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {todayOutwards.length === 0 ? ( // Added check for empty table
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No outward entries for today.
                  </td>
                </tr>
              ) : (
                todayOutwards.map((outward) => (
                  <tr key={outward.id}>
                    <td>{outward.vendorName}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          outward.shift === "Morning" ? "primary" : "info"
                        }`}
                      >
                        {outward.shift}
                      </span>
                    </td>
                    <td>{outward.quantity}</td>
                    <td>{outward.deliveryPerson}</td>
                    <td>
                      {outward.salesQuantity !== null
                        ? outward.salesQuantity
                        : "Pending"}
                    </td>
                    <td>
                      <span
                        className={`badge bg-${
                          outward.status === "Completed"
                            ? "success"
                            : outward.status === "Partial Return"
                            ? "warning text-dark"
                            : "info"
                        }`}
                      >
                        {outward.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for adding milk outward entry */}
      {showModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Milk Outward Entry</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCancel}
                ></button>
              </div>
              <form onSubmit={handleFormSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Vendor *</label>
                    <select
                      className="form-select"
                      value={formData.vendorId}
                      onChange={(e) =>
                        setFormData({ ...formData, vendorId: e.target.value })
                      }
                      required
                    >
                      <option value="">Select Vendor</option>
                      {vendors.map((vendor) => (
                        <option key={vendor.id} value={vendor.id}>
                          {vendor.name}
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
                    <label className="form-label">
                      Quantity Supplied (Litres) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                      max={coolerStock}
                      required
                    />
                    <div className="form-text">
                      Available Stock: {coolerStock} L
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Delivery Person *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.deliveryPerson}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          deliveryPerson: e.target.value,
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

export default MilkOutwardEntry;
