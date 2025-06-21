import React, { useState, useEffect, useMemo } from "react"; // Added useEffect, useMemo
import { useSelector, useDispatch } from "react-redux";
// Import async action creators for initial data fetch
import {
  fetchInwards,
  fetchOutwards,
  fetchReturns,
  fetchPaneerRedirects,
} from "../redux/actions";

const Reports = () => {
  const dispatch = useDispatch();
  const suppliers = useSelector((state) => state.suppliers); // Still needed for supplier names
  const vendors = useSelector((state) => state.vendors); // Still needed for vendor names
  const inwards = useSelector((state) => state.inwards);
  const outwards = useSelector((state) => state.outwards);
  const returns = useSelector((state) => state.returns);
  const paneerRedirects = useSelector((state) => state.paneerRedirects);

  const [filters, setFilters] = useState({
    dateFrom: new Date().toISOString().split("T")[0],
    dateTo: new Date().toISOString().split("T")[0],
    shift: "",
    reportType: "supplier",
  });

  const filteredData = useMemo(() => {
    // Using useMemo for efficiency
    let data = [];

    const filteredByDateAndShift = (item) =>
      item.date >= filters.dateFrom &&
      item.date <= filters.dateTo &&
      (filters.shift ? item.shift === filters.shift : true);

    const filteredByDate = (item) =>
      item.date >= filters.dateFrom && item.date <= filters.dateTo;

    switch (filters.reportType) {
      case "supplier":
        data = inwards.filter(filteredByDateAndShift);
        break;
      case "vendor":
        data = outwards.filter(filteredByDateAndShift);
        break;
      case "returns":
        data = returns.filter(filteredByDate);
        break;
      case "paneer":
        data = paneerRedirects.filter(filteredByDate);
        break;
      default:
        data = [];
    }

    return data;
  }, [filters, inwards, outwards, returns, paneerRedirects]);

  const generateSupplierReport = () => {
    const supplierData = {};
    filteredData.forEach((item) => {
      // Ensure supplierName exists on the item, if not, try to look it up (less efficient here)
      const name =
        item.supplierName ||
        suppliers.find((s) => s.id === item.supplierId)?.name ||
        "Unknown Supplier";

      if (!supplierData[name]) {
        supplierData[name] = {
          totalQuantity: 0,
          avgFat: 0,
          avgSnf: 0,
          entries: 0,
        };
      }
      supplierData[name].totalQuantity += item.quantity;
      supplierData[name].avgFat += item.fat;
      supplierData[name].avgSnf += item.snf;
      supplierData[name].entries += 1;
    });

    Object.keys(supplierData).forEach((supplier) => {
      if (supplierData[supplier].entries > 0) {
        supplierData[supplier].avgFat /= supplierData[supplier].entries;
        supplierData[supplier].avgSnf /= supplierData[supplier].entries;
      }
    });

    return supplierData;
  };

  const generateVendorReport = () => {
    const vendorData = {};
    const filteredReturns = returns.filter(
      (item) => item.date >= filters.dateFrom && item.date <= filters.dateTo
    );

    // Process supplied quantities
    filteredData.forEach((item) => {
      // Ensure vendorName exists on the item, if not, try to look it up (less efficient here)
      const name =
        item.vendorName ||
        vendors.find((v) => v.id === item.vendorId)?.name ||
        "Unknown Vendor";
      if (!vendorData[name]) {
        vendorData[name] = {
          totalSupplied: 0,
          totalReturned: 0,
          totalSales: 0, // Track sales quantity
        };
      }
      vendorData[name].totalSupplied += item.quantity;
      // If salesQuantity is finalized, add it. This is more complex if sales are calculated based on returned.
      // For a vendor report, perhaps just total supplied vs total returned for clarity
      // If we want total sales here, we need to consider 'status' and 'salesQuantity' from 'outwards'
      // This report will show aggregate supplied and returned based on transactions within the date range.
      // If an 'outward' entry spans dates, its data might be split.
    });

    // Process returned quantities
    filteredReturns.forEach((item) => {
      const name =
        item.vendorName ||
        vendors.find((v) => v.id === item.vendorId)?.name ||
        "Unknown Vendor";
      if (!vendorData[name]) {
        vendorData[name] = {
          totalSupplied: 0,
          totalReturned: 0,
          totalSales: 0,
        };
      }
      vendorData[name].totalReturned += item.quantity;
    });

    // Calculate Net Supply (or estimate sales for this report)
    Object.keys(vendorData).forEach((vendor) => {
      vendorData[vendor].netSupply =
        vendorData[vendor].totalSupplied - vendorData[vendor].totalReturned;
      // For 'totalSales' in this report, it's safer to sum `salesQuantity` from *completed* outward entries
      // that fall within the date range, but that's a more complex join logic.
      // For simplicity, `netSupply` can approximate sales for the period of transactions.
      // If specific 'salesQuantity' from the outward entries is needed, it would be `outwards.filter(...).reduce(sum, item => sum + item.salesQuantity)`
    });

    return vendorData;
  };

  return (
    <div>
      <h2 className="mb-4">Reports</h2>

      <div className="card mb-4">
        <div className="card-header">
          <h5>Report Filters</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              <label className="form-label">From Date</label>
              <input
                type="date"
                className="form-control"
                value={filters.dateFrom}
                onChange={(e) =>
                  setFilters({ ...filters, dateFrom: e.target.value })
                }
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">To Date</label>
              <input
                type="date"
                className="form-control"
                value={filters.dateTo}
                onChange={(e) =>
                  setFilters({ ...filters, dateTo: e.target.value })
                }
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Shift</label>
              <select
                className="form-select"
                value={filters.shift}
                onChange={(e) =>
                  setFilters({ ...filters, shift: e.target.value })
                }
              >
                <option value="">All Shifts</option>
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Report Type</label>
              <select
                className="form-select"
                value={filters.reportType}
                onChange={(e) =>
                  setFilters({ ...filters, reportType: e.target.value })
                }
              >
                <option value="supplier">Supplier Report</option>
                <option value="vendor">Vendor Report</option>
                <option value="returns">Returns Report</option>
                <option value="paneer">Paneer Redirection</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5>
            {filters.reportType === "supplier" &&
              "Supplier-wise Milk Contribution"}
            {filters.reportType === "vendor" &&
              "Vendor-wise Supply and Returns"}
            {filters.reportType === "returns" && "Returns Summary"}
            {filters.reportType === "paneer" && "Paneer Redirection Summary"}
          </h5>
        </div>
        <div className="card-body">
          {filters.reportType === "supplier" && (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Supplier Name</th>
                    <th>Total Quantity (L)</th>
                    <th>Avg Fat (%)</th>
                    <th>Avg SNF (%)</th>
                    <th>Total Entries</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(generateSupplierReport()).length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">
                        No data available for this filter.
                      </td>
                    </tr>
                  ) : (
                    Object.entries(generateSupplierReport()).map(
                      ([supplier, data]) => (
                        <tr key={supplier}>
                          <td>{supplier}</td>
                          <td>{data.totalQuantity}</td>
                          <td>{data.avgFat.toFixed(2)}</td>
                          <td>{data.avgSnf.toFixed(2)}</td>
                          <td>{data.entries}</td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}

          {filters.reportType === "vendor" && (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Vendor Name</th>
                    <th>Total Supplied (L)</th>
                    <th>Total Returned (L)</th>
                    <th>Net Supply (L)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(generateVendorReport()).length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">
                        No data available for this filter.
                      </td>
                    </tr>
                  ) : (
                    Object.entries(generateVendorReport()).map(
                      ([vendor, data]) => (
                        <tr key={vendor}>
                          <td>{vendor}</td>
                          <td>{data.totalSupplied}</td>
                          <td>{data.totalReturned}</td>
                          <td>{data.netSupply}</td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}

          {filters.reportType === "returns" && (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Vendor Name</th>
                    <th>Quantity Returned (L)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center text-muted">
                        No data available for this filter.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item) => (
                      <tr key={item.id}>
                        <td>{item.date}</td>
                        <td>{item.vendorName}</td>
                        <td>{item.quantity}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {filters.reportType === "paneer" && (
            <div className="table-responsive">
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
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">
                        No data available for this filter.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item) => (
                      <tr key={item.id}>
                        <td>{item.date}</td>
                        <td>{item.time}</td>
                        <td>{item.quantity}</td>
                        <td>{item.factoryName}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
