import React from "react";
import { NavLink } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="navbar navbar-dark bg-primary p-3 h-100 flex-column align-items-start">
      <div className="container-fluid flex-column flex-nowrap align-items-start">
        <NavLink className="navbar-brand mb-3" to="/dashboard">
          <i className="fas fa-tint me-2"></i>Milk Management System
        </NavLink>
        {/* Removed the navbar-toggler button as menus will always be displayed */}
        <div className="w-100" id="navbarNav">
          {" "}
          {/* Removed 'collapse' class */}
          <ul className="navbar-nav flex-column w-100">
            <li className="nav-item">
              <NavLink className="nav-link" to="/dashboard">
                <i className="fas fa-tachometer-alt me-2"></i>Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/suppliers">
                <i className="fas fa-users me-2"></i>Suppliers
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/vendors">
                <i className="fas fa-handshake me-2"></i>Vendors
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/inward">
                <i className="fas fa-truck-loading me-2"></i>Milk Inward
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/outward">
                <i className="fas fa-truck-moving me-2"></i>Milk Outward
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/returns">
                <i className="fas fa-undo me-2"></i>Returns
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/cooler-paneer">
                <i className="fas fa-warehouse me-2"></i>Cooler Stock & Paneer
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/reports">
                <i className="fas fa-chart-line me-2"></i>Reports
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
