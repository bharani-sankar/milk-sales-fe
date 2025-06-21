import React, { useState, useEffect, useMemo } from "react"; // Added useEffect
import { useSelector, useDispatch } from "react-redux";
// Import async action creators
import {
  addPaneerRedirect,
  showToast,
  fetchInwards,
  fetchOutwards,
  fetchReturns,
  fetchPaneerRedirects,
} from "../redux/actions";

const CoolerStockPaneer = () => {
  const dispatch = useDispatch();
  const inwards = useSelector((state) => state.inwards);
  const outwards = useSelector((state) => state.outwards);
  const returns = useSelector((state) => state.returns);
  const paneerRedirects = useSelector((state) => state.paneerRedirects);

  const [showPaneerRedirectModal, setShowPaneerRedirectModal] = useState(false);
  const [formData, setFormData] = useState({
    quantity: "",
    factoryName: "",
  });

  const today = new Date().toISOString().split("T")[0];

  const {
    totalInwardMorning,
    totalInwardEvening,
    totalOutwardSupplied,
    totalReturnsQuantity,
    totalPaneerRedirected,
    currentCoolerStock,
  } = useMemo(() => {
    const todayInwards = inwards.filter((item) => item.date === today);
    // Correctly sum 'returnedQuantity' from 'outwards' for stock calculation
    // Note: The 'returns' list itself contains the returns data for history,
    // but the actual impact on stock comes from the returnedQuantity on each outward item.
    // For simplicity, we'll use the 'returns' list for total returns shown,
    // but a robust stock calculation should leverage the 'outwards' returnedQuantity.
    // However, the current logic using sum of 'returns' list and 'outwards' quantity supplied is fine for a high-level summary.
    // For precision, cooler stock should be `total_inward + sum(outwards.returnedQuantity) - sum(outwards.quantity) - total_paneer_redirect`
    // Let's adjust to use 'outwards' returned quantity for more accuracy if not already.

    const todayOutwards = outwards.filter((item) => item.date === today);
    const todayReturnsList = returns.filter((item) => item.date === today); // Keep this for the total returns shown in summary card
    const todayPaneerRedirects = paneerRedirects.filter(
      (item) => item.date === today
    );

    const morningInward = todayInwards
      .filter((item) => item.shift === "Morning")
      .reduce((sum, item) => sum + item.quantity, 0);

    const eveningInward = todayInwards
      .filter((item) => item.shift === "Evening")
      .reduce((sum, item) => sum + item.quantity, 0);

    const totalInwardsCombined = morningInward + eveningInward;

    const suppliedOutward = todayOutwards.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    // Sum of returned quantities from each outward entry (more accurate for cooler stock)
    const totalReturnedFromOutwards = todayOutwards.reduce(
      (sum, item) => sum + item.returnedQuantity,
      0
    );

    const redirectedToPaneer = todayPaneerRedirects.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    // Cooler Stock Calculation: Total Inwards + (Total Returned Milk from Outwards) - Total Supplied Outwards - Total Paneer Redirected
    const coolerStock =
      totalInwardsCombined +
      totalReturnedFromOutwards -
      suppliedOutward -
      redirectedToPaneer;

    return {
      totalInwardMorning: morningInward,
      totalInwardEvening: eveningInward,
      totalOutwardSupplied: suppliedOutward,
      totalReturnsQuantity: todayReturnsList.reduce(
        (sum, item) => sum + item.quantity,
        0
      ), // Still use the 'returns' list for this specific display metric if desired
      totalPaneerRedirected: redirectedToPaneer,
      currentCoolerStock: coolerStock,
    };
  }, [inwards, outwards, returns, paneerRedirects, today]);

  const handleFormSubmit = async (e) => {
    // Made async
    e.preventDefault();

    if (!formData.quantity || !formData.factoryName) {
      dispatch(showToast("Please fill all required fields", "danger"));
      return;
    }

    const quantity = parseFloat(formData.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      dispatch(showToast("Quantity must be a positive number", "danger"));
      return;
    }

    if (quantity > currentCoolerStock) {
      dispatch(showToast("Insufficient stock in cooler", "danger"));
      return;
    }

    const redirectData = {
      ...formData,
      quantity: quantity,
      date: today,
      time: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    await dispatch(addPaneerRedirect(redirectData)); // Use async action

    setFormData({
      quantity: "",
      factoryName: "",
    });
    setShowPaneerRedirectModal(false);
  };

  const handleAddRedirectClick = () => {
    setFormData({
      quantity: "",
      factoryName: "",
    });
    setShowPaneerRedirectModal(true);
  };

  const handleCancelRedirect = () => {
    setShowPaneerRedirectModal(false);
    setFormData({
      quantity: "",
      factoryName: "",
    });
  };

  return (
    <div>
      <h2 className="mb-4">Cooler Stock & Paneer Redirection</h2>

      {/* Daily Summaries and Cooler Stock */}
      <div className="card mb-4">
        <div className="card-header bg-info text-white">
          <h5>Daily Milk Flow Summary ({today})</h5>
        </div>
        <div className="card-body">
          <div className="row text-center mb-3">
            <div className="col-md-3">
              <div className="p-2 border rounded">
                <p className="text-muted mb-0">Morning Inward</p>
                <h4 className="text-primary">{totalInwardMorning} L</h4>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-2 border rounded">
                <p className="text-muted mb-0">Evening Inward</p>
                <h4 className="text-primary">{totalInwardEvening} L</h4>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-2 border rounded">
                <p className="text-muted mb-0">Total Supplied</p>
                <h4 className="text-success">{totalOutwardSupplied} L</h4>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-2 border rounded">
                <p className="text-muted mb-0">Total Returns</p>
                <h4 className="text-secondary">{totalReturnsQuantity} L</h4>
              </div>
            </div>
          </div>
          <hr />
          <div className="text-center">
            <p className="mb-0">Total Redirected to Paneer</p>
            <h4 className="text-danger">{totalPaneerRedirected} L</h4>
            <hr className="my-3" />
            <p className="mb-0">Current Cooler Stock</p>
            <h2
              className={`${
                currentCoolerStock > 0 ? "text-info" : "text-danger"
              } display-5`}
            >
              {currentCoolerStock} L
            </h2>
          </div>
        </div>
      </div>

      {/* Paneer Redirection Section */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Paneer Redirection History</h5>
        <button
          className="btn btn-danger"
          onClick={handleAddRedirectClick}
          disabled={currentCoolerStock <= 0}
        >
          <i className="fas fa-industry me-2"></i>Redirect to Paneer Factory
        </button>
      </div>

      <div className="table-responsive mb-4">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Quantity (L)</th>
              <th>Factory Name</th>
            </tr>
          </thead>
          <tbody>
            {paneerRedirects.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No paneer redirections recorded.
                </td>
              </tr>
            ) : (
              paneerRedirects
                .slice()
                .reverse()
                .map((redirect) => (
                  <tr key={redirect.id}>
                    <td>{redirect.date}</td>
                    <td>{redirect.time}</td>
                    <td>{redirect.quantity}</td>
                    <td>{redirect.factoryName}</td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Paneer Redirection */}
      {showPaneerRedirectModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Record Paneer Redirection</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCancelRedirect}
                ></button>
              </div>
              <form onSubmit={handleFormSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">
                      Quantity to Send (Litres) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                      max={currentCoolerStock}
                      min="0.1"
                      required
                    />
                    <div className="form-text">
                      Available in cooler: {currentCoolerStock} L
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Factory Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.factoryName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          factoryName: e.target.value,
                        })
                      }
                      placeholder="Enter factory name"
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancelRedirect}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit Redirection
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

export default CoolerStockPaneer;
