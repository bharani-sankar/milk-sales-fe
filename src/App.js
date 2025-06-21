import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSuppliers,
  fetchVendors,
  fetchInwards,
  fetchOutwards,
  fetchReturns,
  fetchPaneerRedirects,
} from "./redux/actions";

import Navigation from "./components/Navigation";
import Toast from "./components/Toast";
import Dashboard from "./components/Dashboard";
import SupplierManagement from "./components/SupplierManagement";
import VendorManagement from "./components/VendorManagement";
import MilkInwardEntry from "./components/MilkInwardEntry";
import MilkOutwardEntry from "./components/MilkOutwardEntry";
import ReturnEntry from "./components/ReturnEntry";
import CoolerStockPaneer from "./components/CoolerStockPaneer";
import Reports from "./components/Reports";

const App = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.apiStatus);

  // Fetch ALL initial data when the App component mounts
  useEffect(() => {
    console.log("App.js: Triggering ALL initial data fetches"); // Debugging line
    dispatch(fetchSuppliers());
    dispatch(fetchVendors());
    dispatch(fetchInwards());
    dispatch(fetchOutwards());
    dispatch(fetchReturns());
    dispatch(fetchPaneerRedirects());
  }, [dispatch]); // This effect runs only once on mount

  return (
    <Router>
      <Toast />
      <div className="d-flex" style={{ minHeight: "100vh" }}>
        <div
          className="bg-primary text-white p-3 shadow"
          style={{ width: "325px", flexShrink: 0 }}
        >
          <Navigation />
        </div>

        <div className="flex-grow-1 p-4">
          {isLoading && (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: "80vh" }}
            >
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="ms-2">Loading data...</p>
            </div>
          )}
          {error && (
            <div className="alert alert-danger mt-3" role="alert">
              <strong>Error:</strong> {error}
            </div>
          )}
          {!isLoading && !error ? ( // Render content only when not loading and no error
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/suppliers" element={<SupplierManagement />} />
              <Route path="/vendors" element={<VendorManagement />} />
              <Route path="/inward" element={<MilkInwardEntry />} />
              <Route path="/outward" element={<MilkOutwardEntry />} />
              <Route path="/returns" element={<ReturnEntry />} />
              <Route path="/cooler-paneer" element={<CoolerStockPaneer />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          ) : null}{" "}
          {/* If loading or error, do not render routes yet */}
        </div>
      </div>
    </Router>
  );
};

export default App;
