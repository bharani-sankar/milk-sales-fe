// --- API Base URL (Important: Change this to your Flask app's URL) ---
const API_BASE_URL = "http://127.0.0.1:5000"; // Make sure your Flask app runs on this port

// --- Generic API Action Types ---
export const REQUEST_DATA = "REQUEST_DATA";
export const RECEIVE_DATA = "RECEIVE_DATA";
export const API_ERROR = "API_ERROR";

// --- Specific Resource Action Types (Existing + New for API states) ---
export const ADD_SUPPLIER = "ADD_SUPPLIER";
export const UPDATE_SUPPLIER = "UPDATE_SUPPLIER";
export const DELETE_SUPPLIER = "DELETE_SUPPLIER";
export const SET_SUPPLIERS = "SET_SUPPLIERS"; // For fetching initial data

export const ADD_VENDOR = "ADD_VENDOR";
export const UPDATE_VENDOR = "UPDATE_VENDOR";
export const DELETE_VENDOR = "DELETE_VENDOR";
export const SET_VENDORS = "SET_VENDORS"; // For fetching initial data

export const ADD_INWARD = "ADD_INWARD";
export const SET_INWARDS = "SET_INWARDS"; // For fetching initial data

export const ADD_OUTWARD = "ADD_OUTWARD";
export const MARK_OUTWARD_COMPLETE = "MARK_OUTWARD_COMPLETE";
export const SET_OUTWARDS = "SET_OUTWARDS"; // For fetching initial data

export const ADD_RETURN = "ADD_RETURN";
export const SET_RETURNS = "SET_RETURNS"; // For fetching initial data

export const ADD_PANEER_REDIRECT = "ADD_PANEER_REDIRECT";
export const SET_PANEER_REDIRECTS = "SET_PANEER_REDIRECTS"; // For fetching initial data

export const SHOW_TOAST = "SHOW_TOAST";
export const HIDE_TOAST = "HIDE_TOAST";

// --- Action Creators (Synchronous) ---
export const setSuppliers = (suppliers) => ({
  type: SET_SUPPLIERS,
  payload: suppliers,
});
export const addSupplierSuccess = (supplier) => ({
  type: ADD_SUPPLIER,
  payload: supplier,
});
export const updateSupplierSuccess = (supplier) => ({
  type: UPDATE_SUPPLIER,
  payload: supplier,
});
export const deleteSupplierSuccess = (id) => ({
  type: DELETE_SUPPLIER,
  payload: id,
});

export const setVendors = (vendors) => ({
  type: SET_VENDORS,
  payload: vendors,
});
export const addVendorSuccess = (vendor) => ({
  type: ADD_VENDOR,
  payload: vendor,
});
export const updateVendorSuccess = (vendor) => ({
  type: UPDATE_VENDOR,
  payload: vendor,
});
export const deleteVendorSuccess = (id) => ({
  type: DELETE_VENDOR,
  payload: id,
});

export const setInwards = (inwards) => ({
  type: SET_INWARDS,
  payload: inwards,
});
export const addInwardSuccess = (inward) => ({
  type: ADD_INWARD,
  payload: inward,
});

export const setOutwards = (outwards) => ({
  type: SET_OUTWARDS,
  payload: outwards,
});
export const addOutwardSuccess = (outward) => ({
  type: ADD_OUTWARD,
  payload: outward,
});
export const markOutwardCompleteSuccess = (id) => ({
  type: MARK_OUTWARD_COMPLETE,
  payload: id,
});

export const setReturns = (returns) => ({
  type: SET_RETURNS,
  payload: returns,
});
export const addReturnSuccess = (returnData) => ({
  type: ADD_RETURN,
  payload: returnData,
});

export const setPaneerRedirects = (redirects) => ({
  type: SET_PANEER_REDIRECTS,
  payload: redirects,
});
export const addPaneerRedirectSuccess = (redirect) => ({
  type: ADD_PANEER_REDIRECT,
  payload: redirect,
});

export const showToast = (message, type) => ({
  type: SHOW_TOAST,
  payload: { message, type },
});
export const hideToast = () => ({ type: HIDE_TOAST });
export const apiRequest = () => ({ type: REQUEST_DATA });
export const apiError = (error) => ({ type: API_ERROR, payload: error });

// --- Asynchronous Action Creators (Redux Thunks) ---

// Generic Fetch Data
export const fetchData = (resource, setterAction) => {
  return async (dispatch) => {
    dispatch(apiRequest());
    try {
      const response = await fetch(`${API_BASE_URL}/${resource}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      const data = await response.json();
      dispatch(setterAction(data));
    } catch (error) {
      console.error(`Error fetching ${resource}:`, error);
      dispatch(apiError(error.message));
      dispatch(
        showToast(`Failed to load ${resource}: ${error.message}`, "danger")
      );
    }
  };
};

// Suppliers
export const fetchSuppliers = () => fetchData("suppliers", setSuppliers);

export const addSupplier = (supplierData) => {
  return async (dispatch) => {
    dispatch(apiRequest());
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supplierData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      const newSupplier = await response.json();
      dispatch(addSupplierSuccess(newSupplier));
      dispatch(showToast("Supplier added successfully", "success"));
    } catch (error) {
      console.error("Error adding supplier:", error);
      dispatch(apiError(error.message));
      dispatch(showToast(`Failed to add supplier: ${error.message}`, "danger"));
    }
  };
};

export const updateSupplier = (supplierData) => {
  return async (dispatch) => {
    dispatch(apiRequest());
    try {
      const response = await fetch(
        `${API_BASE_URL}/suppliers/${supplierData.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(supplierData),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      const updatedSupplier = await response.json();
      dispatch(updateSupplierSuccess(updatedSupplier));
      dispatch(showToast("Supplier updated successfully", "success"));
    } catch (error) {
      console.error("Error updating supplier:", error);
      dispatch(apiError(error.message));
      dispatch(
        showToast(`Failed to update supplier: ${error.message}`, "danger")
      );
    }
  };
};

export const deleteSupplier = (id) => {
  return async (dispatch) => {
    dispatch(apiRequest());
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      // Flask often returns 200 or 204 for successful delete, no content.
      // If it returns a success message, you can parse it.
      dispatch(deleteSupplierSuccess(id));
      dispatch(showToast("Supplier deleted successfully", "success"));
    } catch (error) {
      console.error("Error deleting supplier:", error);
      dispatch(apiError(error.message));
      dispatch(
        showToast(`Failed to delete supplier: ${error.message}`, "danger")
      );
    }
  };
};

// Vendors
export const fetchVendors = () => fetchData("vendors", setVendors);

export const addVendor = (vendorData) => {
  return async (dispatch) => {
    dispatch(apiRequest());
    try {
      const response = await fetch(`${API_BASE_URL}/vendors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vendorData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      const newVendor = await response.json();
      dispatch(addVendorSuccess(newVendor));
      dispatch(showToast("Vendor added successfully", "success"));
    } catch (error) {
      console.error("Error adding vendor:", error);
      dispatch(apiError(error.message));
      dispatch(showToast(`Failed to add vendor: ${error.message}`, "danger"));
    }
  };
};

export const updateVendor = (vendorData) => {
  return async (dispatch) => {
    dispatch(apiRequest());
    try {
      const response = await fetch(`${API_BASE_URL}/vendors/${vendorData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vendorData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      const updatedVendor = await response.json();
      dispatch(updateVendorSuccess(updatedVendor));
      dispatch(showToast("Vendor updated successfully", "success"));
    } catch (error) {
      console.error("Error updating vendor:", error);
      dispatch(apiError(error.message));
      dispatch(
        showToast(`Failed to update vendor: ${error.message}`, "danger")
      );
    }
  };
};

export const deleteVendor = (id) => {
  return async (dispatch) => {
    dispatch(apiRequest());
    try {
      const response = await fetch(`${API_BASE_URL}/vendors/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      dispatch(deleteVendorSuccess(id));
      dispatch(showToast("Vendor deleted successfully", "success"));
    } catch (error) {
      console.error("Error deleting vendor:", error);
      dispatch(apiError(error.message));
      dispatch(
        showToast(`Failed to delete vendor: ${error.message}`, "danger")
      );
    }
  };
};

// Inwards
export const fetchInwards = () => fetchData("inwards", setInwards);

export const addInward = (inwardData) => {
  return async (dispatch) => {
    dispatch(apiRequest());
    try {
      const response = await fetch(`${API_BASE_URL}/inwards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inwardData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      const newInward = await response.json();
      dispatch(addInwardSuccess(newInward));
      dispatch(showToast("Milk inward entry added successfully", "success"));
    } catch (error) {
      console.error("Error adding inward entry:", error);
      dispatch(apiError(error.message));
      dispatch(
        showToast(`Failed to add inward entry: ${error.message}`, "danger")
      );
    }
  };
};

// Outwards
export const fetchOutwards = () => fetchData("outwards", setOutwards);

export const addOutward = (outwardData) => {
  return async (dispatch) => {
    dispatch(apiRequest());
    try {
      const response = await fetch(`${API_BASE_URL}/outwards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(outwardData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      const newOutward = await response.json();
      // Assuming backend returns the full outward object including default returnedQuantity and status
      dispatch(addOutwardSuccess(newOutward));
      dispatch(showToast("Milk outward entry added successfully", "success"));
    } catch (error) {
      console.error("Error adding outward entry:", error);
      dispatch(apiError(error.message));
      dispatch(
        showToast(`Failed to add outward entry: ${error.message}`, "danger")
      );
    }
  };
};

export const addReturn = (returnData) => {
  return async (dispatch) => {
    dispatch(apiRequest());
    try {
      // Backend endpoint for returns should update the corresponding outward entry
      const response = await fetch(`${API_BASE_URL}/returns`, {
        // Or /outwards/return
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(returnData), // Should include outwardEntryId, quantity, date, time
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      const updatedOutward = await response.json(); // Backend should return the updated outward object

      // Dispatch ADD_RETURN to update local returns list (if backend stores it separately)
      dispatch(addReturnSuccess(returnData)); // Use original returnData as backend might not return the return object itself

      // Dispatch MARK_OUTWARD_COMPLETE to update the specific outward status and salesQuantity
      // We use the same logic as MARK_OUTWARD_COMPLETE for status/salesQuantity calculation
      // This is a slight deviation from typical Redux, but simplifies frontend if backend returns only updated outward.
      // A better way would be for backend to return the complete, updated outward object and then dispatch SET_OUTWARDS for just that one.
      // For now, let's just make sure the `MARK_OUTWARD_COMPLETE` reducer logic works.
      // If backend returns the NEW outward object, you could dispatch an action like `UPDATE_SINGLE_OUTWARD`
      dispatch({
        type: MARK_OUTWARD_COMPLETE, // Reuse this action for simplicity, but it's meant for "complete"
        payload: updatedOutward.id, // Assuming updatedOutward has the ID
        meta: { updatedOutwardData: updatedOutward }, // Pass updated data for reducer to consume
      });

      dispatch(
        showToast(
          `Return of ${returnData.quantity} L recorded successfully.`,
          "success"
        )
      );
    } catch (error) {
      console.error("Error adding return entry:", error);
      dispatch(apiError(error.message));
      dispatch(
        showToast(`Failed to add return entry: ${error.message}`, "danger")
      );
    }
  };
};

export const markOutwardComplete = (outwardEntryId) => {
  return async (dispatch) => {
    dispatch(apiRequest());
    try {
      const response = await fetch(
        `${API_BASE_URL}/outwards/${outwardEntryId}/complete`,
        {
          // Assuming an endpoint to mark complete
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      // Backend should return the updated outward object
      const updatedOutward = await response.json();

      // Dispatch the success action for marking complete
      dispatch(markOutwardCompleteSuccess(outwardEntryId)); // Re-using existing action type
      // Or, if backend sends the full object, you could dispatch a generic update action:
      // dispatch({ type: UPDATE_OUTWARD, payload: updatedOutward });

      dispatch(showToast("Outward dispatch marked as completed.", "success"));
    } catch (error) {
      console.error("Error marking outward complete:", error);
      dispatch(apiError(error.message));
      dispatch(
        showToast(`Failed to mark outward complete: ${error.message}`, "danger")
      );
    }
  };
};

export const fetchReturns = () => fetchData("returns", setReturns);

// Paneer Redirects
export const fetchPaneerRedirects = () =>
  fetchData("paneer-redirects", setPaneerRedirects);

export const addPaneerRedirect = (redirectData) => {
  return async (dispatch) => {
    dispatch(apiRequest());
    try {
      const response = await fetch(`${API_BASE_URL}/paneer-redirects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(redirectData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      const newRedirect = await response.json();
      dispatch(addPaneerRedirectSuccess(newRedirect));
      dispatch(
        showToast(
          `Milk redirected to ${redirectData.factoryName} successfully!`,
          "success"
        )
      );
    } catch (error) {
      console.error("Error adding paneer redirection:", error);
      dispatch(apiError(error.message));
      dispatch(
        showToast(
          `Failed to add paneer redirection: ${error.message}`,
          "danger"
        )
      );
    }
  };
};
