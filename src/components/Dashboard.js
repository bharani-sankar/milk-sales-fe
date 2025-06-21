import React from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const inwards = useSelector((state) => state.inwards);
  const outwards = useSelector((state) => state.outwards);
  const returns = useSelector((state) => state.returns);
  const paneerRedirects = useSelector((state) => state.paneerRedirects);

  const today = new Date().toISOString().split("T")[0];

  const todayInwards = inwards.filter((item) => item.date === today);
  const todayOutwards = outwards.filter((item) => item.date === today);
  const todayReturns = returns.filter((item) => item.date === today);
  const todayPaneerRedirects = paneerRedirects.filter(
    (item) => item.date === today
  );

  const totalInwardMorning = todayInwards
    .filter((item) => item.shift === "Morning")
    .reduce((sum, item) => sum + item.quantity, 0);
  const totalInwardEvening = todayInwards
    .filter((item) => item.shift === "Evening")
    .reduce((sum, item) => sum + item.quantity, 0);
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
    totalInwardMorning +
    totalInwardEvening +
    totalReturns -
    (totalOutward + totalPaneerRedirect);

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Morning Inward</h6>
                  <h3>{totalInwardMorning} L</h3>
                </div>
                <i className="fas fa-sun fa-2x"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Evening Inward</h6>
                  <h3>{totalInwardEvening} L</h3>
                </div>
                <i className="fas fa-moon fa-2x"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Total Supplied</h6>
                  <h3>{totalOutward} L</h3>
                </div>
                <i className="fas fa-truck fa-2x"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Cooler Stock</h6>
                  <h3>{coolerStock} L</h3>
                </div>
                <i className="fas fa-snowflake fa-2x"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card bg-secondary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Returns</h6>
                  <h3>{totalReturns} L</h3>
                </div>
                <i className="fas fa-undo fa-2x"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card bg-danger text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Paneer Redirect</h6>
                  <h3>{totalPaneerRedirect} L</h3>
                </div>
                <i className="fas fa-industry fa-2x"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
