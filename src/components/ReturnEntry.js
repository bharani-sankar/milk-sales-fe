import React, { useState, useEffect } from "react"; // Added useEffect
import { useSelector, useDispatch } from "react-redux";
// Import async action creators
import {
  addReturn,
  showToast,
  markOutwardComplete,
  fetchOutwards,
  fetchReturns,
} from "../redux/actions";

const ReturnEntry = () => {
  const dispatch = useDispatch();
  const outwards = useSelector((state) => state.outwards);
  const returns = useSelector((state) => state.returns);

  const [showModal, setShowModal] = useState(false);
  const [selectedOutwardEntry, setSelectedOutwardEntry] = useState(null);
  const [returnQuantity, setReturnQuantity] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleAddReturnClick = (outwardEntry) => {
    setSelectedOutwardEntry(outwardEntry);
    setReturnQuantity("");
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    // Made async
    e.preventDefault();

    if (!selectedOutwardEntry) {
      dispatch(showToast("No outward entry selected for return.", "danger"));
      return;
    }

    const quantity = parseFloat(returnQuantity);
    if (isNaN(quantity) || quantity < 0) {
      dispatch(showToast("Quantity must be a non-negative number", "danger"));
      return;
    }

    const maxReturnable =
      selectedOutwardEntry.quantity - selectedOutwardEntry.returnedQuantity;

    if (quantity > 0 && quantity > maxReturnable) {
      dispatch(
        showToast(
          `Return quantity cannot exceed remaining unreturned quantity (${maxReturnable} L)`,
          "danger"
        )
      );
      return;
    }

    const returnData = {
      outwardEntryId: selectedOutwardEntry.id,
      vendorName: selectedOutwardEntry.vendorName,
      quantity: quantity,
      date: today,
      time: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    await dispatch(addReturn(returnData)); // Use async action

    setShowModal(false);
    setSelectedOutwardEntry(null);
    setReturnQuantity("");
  };

  const handleMarkComplete = async (outwardEntryId) => {
    // Made async
    if (
      window.confirm(
        "Are you sure you want to mark this dispatch as completed? This will finalize its return status."
      )
    ) {
      await dispatch(markOutwardComplete(outwardEntryId)); // Use async action
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedOutwardEntry(null);
    setReturnQuantity("");
  };

  const getReturnStatusBadge = (outward) => {
    if (outward.status === "Completed") {
      return <span className="badge bg-success">{outward.status}</span>;
    } else if (
      outward.returnedQuantity > 0 &&
      outward.returnedQuantity < outward.quantity
    ) {
      return <span className="badge bg-warning text-dark">Partial Return</span>;
    }
    return <span className="badge bg-info">Pending</span>;
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Return Entry</h2>
        <div className="alert alert-info py-2 px-3 m-0">
          <strong>
            Total Returns Today:{" "}
            {returns
              .filter((item) => item.date === today)
              .reduce((sum, item) => sum + item.quantity, 0)}{" "}
            Litres
          </strong>
        </div>
      </div>

      <div className="mt-4">
        <h5>Today's Outward Dispatches Status</h5>
        <p className="text-muted">
          Record returns or mark dispatches as complete.
        </p>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Shift</th>
                <th>Quantity Supplied (L)</th>
                <th>Returned (L)</th>
                <th>Remaining (L)</th>
                <th>Delivery Person</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {outwards.filter((item) => item.date === today).length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-muted">
                    No outward dispatches recorded for today.
                  </td>
                </tr>
              ) : (
                outwards
                  .filter((item) => item.date === today)
                  .map((outward) => (
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
                      <td>{outward.returnedQuantity}</td>
                      <td>{outward.quantity - outward.returnedQuantity}</td>
                      <td>{outward.deliveryPerson}</td>
                      <td>{getReturnStatusBadge(outward)}</td>
                      <td>
                        {outward.status !== "Completed" ? (
                          <>
                            <button
                              className="btn btn-sm btn-outline-secondary me-2"
                              onClick={() => handleAddReturnClick(outward)}
                            >
                              <i className="fas fa-undo me-1"></i>Record Return
                            </button>
                            <button
                              className="btn btn-sm btn-outline-success"
                              onClick={() => handleMarkComplete(outward.id)}
                            >
                              <i className="fas fa-check-circle me-1"></i>Mark
                              as Complete
                            </button>
                          </>
                        ) : (
                          <span className="text-success">Finalized</span>
                        )}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for recording return */}
      {showModal && selectedOutwardEntry && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Record Return for: {selectedOutwardEntry.vendorName} (
                  {selectedOutwardEntry.quantity} L supplied)
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCancel}
                ></button>
              </div>
              <form onSubmit={handleFormSubmit}>
                <div className="modal-body">
                  <p>
                    <strong>Outward Details:</strong>
                  </p>
                  <ul>
                    <li>Vendor: {selectedOutwardEntry.vendorName}</li>
                    <li>Shift: {selectedOutwardEntry.shift}</li>
                    <li>
                      Supplied Quantity: {selectedOutwardEntry.quantity} L
                    </li>
                    <li>
                      Already Returned: {selectedOutwardEntry.returnedQuantity}{" "}
                      L
                    </li>
                    <li>
                      Remaining to Return:{" "}
                      {selectedOutwardEntry.quantity -
                        selectedOutwardEntry.returnedQuantity}{" "}
                      L
                    </li>
                  </ul>
                  <hr />
                  <div className="mb-3">
                    <label className="form-label">
                      Quantity Returned (Litres) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      value={returnQuantity}
                      onChange={(e) => setReturnQuantity(e.target.value)}
                      max={
                        selectedOutwardEntry.quantity -
                        selectedOutwardEntry.returnedQuantity
                      }
                      min="0"
                      required
                    />
                    <div className="form-text">
                      Enter quantity returned. Can be 0 L if no returns, marking
                      dispatch as complete.
                    </div>
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
                    Submit Return
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

export default ReturnEntry;
