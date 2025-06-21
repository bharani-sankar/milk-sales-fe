import { combineReducers } from "redux";
import {
  ADD_SUPPLIER,
  UPDATE_SUPPLIER,
  DELETE_SUPPLIER,
  SET_SUPPLIERS,
  ADD_VENDOR,
  UPDATE_VENDOR,
  DELETE_VENDOR,
  SET_VENDORS,
  ADD_INWARD,
  SET_INWARDS,
  ADD_OUTWARD,
  MARK_OUTWARD_COMPLETE,
  SET_OUTWARDS,
  ADD_RETURN,
  SET_RETURNS,
  ADD_PANEER_REDIRECT,
  SET_PANEER_REDIRECTS,
  SHOW_TOAST,
  HIDE_TOAST,
  REQUEST_DATA,
  API_ERROR,
} from "./actions";

const initialState = {
  suppliers: [],
  vendors: [],
  inwards: [],
  outwards: [],
  returns: [],
  paneerRedirects: [],
  toast: { show: false, message: "", type: "success" },
  isLoading: false,
  error: null,
};

const apiStatusReducer = (
  state = { isLoading: false, error: null },
  action
) => {
  switch (action.type) {
    case REQUEST_DATA:
      return { ...state, isLoading: true, error: null };
    case API_ERROR:
      return { ...state, isLoading: false, error: action.payload };
    // These are actions that signify data has arrived, turn off loading
    // They should be handled carefully to not re-render if the data hasn't truly changed
    case SET_SUPPLIERS:
    case SET_VENDORS:
    case SET_INWARDS:
    case SET_OUTWARDS:
    case SET_RETURNS:
    case SET_PANEER_REDIRECTS:
    case ADD_SUPPLIER: // These also complete an API request
    case UPDATE_SUPPLIER:
    case DELETE_SUPPLIER:
    case ADD_VENDOR:
    case UPDATE_VENDOR:
    case DELETE_VENDOR:
    case ADD_INWARD:
    case ADD_OUTWARD:
    case ADD_RETURN:
    case MARK_OUTWARD_COMPLETE:
    case ADD_PANEER_REDIRECT:
      // This ensures isLoading only becomes false if it was true, preventing a render if already false.
      // However, the core issue is the data itself changing reference unnecessarily.
      return state.isLoading
        ? { ...state, isLoading: false, error: null }
        : state;
    default:
      return state;
  }
};

// Helper to check deep equality for arrays of simple objects
// This is a shallow comparison for each object in the array, then array length.
// For more complex objects or nested structures, a dedicated deep-equality library (like 'fast-deep-equal') would be needed.
const areArraysEqualShallow = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    // Compare object references. If objects are complex, this isn't enough.
    // But for typical Redux flow, if the object content is same, it should be the same reference.
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
};

const suppliersReducer = (state = initialState.suppliers, action) => {
  switch (action.type) {
    case SET_SUPPLIERS:
      // *** IMPORTANT CHANGE HERE ***
      // Only return new payload if it's different from current state
      if (areArraysEqualShallow(state, action.payload)) {
        return state; // No actual change, return original state reference
      }
      return action.payload; // New data, update state
    case ADD_SUPPLIER:
      return [...state, action.payload];
    case UPDATE_SUPPLIER:
      const updatedSuppliers = state.map((supplier) =>
        supplier.id === action.payload.id ? action.payload : supplier
      );
      if (updatedSuppliers.every((item, index) => item === state[index])) {
        return state;
      }
      return updatedSuppliers;
    case DELETE_SUPPLIER:
      const filteredSuppliers = state.filter(
        (supplier) => supplier.id !== action.payload
      );
      if (filteredSuppliers.length === state.length) {
        return state;
      }
      return filteredSuppliers;
    default:
      return state;
  }
};

const vendorsReducer = (state = initialState.vendors, action) => {
  switch (action.type) {
    case SET_VENDORS:
      // *** IMPORTANT CHANGE HERE ***
      if (areArraysEqualShallow(state, action.payload)) {
        return state;
      }
      return action.payload;
    case ADD_VENDOR:
      return [...state, action.payload];
    case UPDATE_VENDOR:
      const updatedVendors = state.map((vendor) =>
        vendor.id === action.payload.id ? action.payload : vendor
      );
      if (updatedVendors.every((item, index) => item === state[index])) {
        return state;
      }
      return updatedVendors;
    case DELETE_VENDOR:
      const filteredVendors = state.filter(
        (vendor) => vendor.id !== action.payload
      );
      if (filteredVendors.length === state.length) {
        return state;
      }
      return filteredVendors;
    default:
      return state;
  }
};

const inwardsReducer = (state = initialState.inwards, action) => {
  switch (action.type) {
    case SET_INWARDS:
      // *** IMPORTANT CHANGE HERE ***
      if (areArraysEqualShallow(state, action.payload)) {
        return state;
      }
      return action.payload;
    case ADD_INWARD:
      return [...state, action.payload];
    default:
      return state;
  }
};

const calculateSalesQuantity = (outward) => {
  return outward.quantity - outward.returnedQuantity;
};

const outwardsReducer = (state = initialState.outwards, action) => {
  switch (action.type) {
    case SET_OUTWARDS:
      // *** IMPORTANT CHANGE HERE ***
      if (areArraysEqualShallow(state, action.payload)) {
        return state;
      }
      return action.payload;
    case ADD_OUTWARD:
      return [...state, action.payload];
    case ADD_RETURN:
      const updatedOutwardsForReturn = state.map((outward) => {
        if (outward.id === action.payload.outwardEntryId) {
          const newReturnedQuantity =
            outward.returnedQuantity + action.payload.quantity;
          let newStatus = outward.status;
          let newSalesQuantity = outward.salesQuantity;

          if (
            newReturnedQuantity >= outward.quantity ||
            action.payload.quantity === 0
          ) {
            newStatus = "Completed";
            newSalesQuantity = calculateSalesQuantity({
              ...outward,
              returnedQuantity: newReturnedQuantity,
            });
          } else if (newReturnedQuantity > 0) {
            newStatus = "Partial Return";
            newSalesQuantity = null;
          }

          if (
            outward.returnedQuantity === newReturnedQuantity &&
            outward.status === newStatus &&
            outward.salesQuantity === newSalesQuantity
          ) {
            return outward;
          }

          return {
            ...outward,
            returnedQuantity: newReturnedQuantity,
            salesQuantity: newSalesQuantity,
            status: newStatus,
          };
        }
        return outward;
      });
      if (
        updatedOutwardsForReturn.every((item, index) => item === state[index])
      ) {
        return state;
      }
      return updatedOutwardsForReturn;

    case MARK_OUTWARD_COMPLETE:
      const updatedOutwardsForMarkComplete = state.map((outward) => {
        if (outward.id === action.payload) {
          const newSalesQuantity = calculateSalesQuantity(outward);
          if (
            outward.status === "Completed" &&
            outward.salesQuantity === newSalesQuantity
          ) {
            return outward;
          }
          return {
            ...outward,
            status: "Completed",
            salesQuantity: newSalesQuantity,
          };
        }
        return outward;
      });
      if (
        updatedOutwardsForMarkComplete.every(
          (item, index) => item === state[index]
        )
      ) {
        return state;
      }
      return updatedOutwardsForMarkComplete;
    default:
      return state;
  }
};

const returnsReducer = (state = initialState.returns, action) => {
  switch (action.type) {
    case SET_RETURNS:
      // *** IMPORTANT CHANGE HERE ***
      if (areArraysEqualShallow(state, action.payload)) {
        return state;
      }
      return action.payload;
    case ADD_RETURN:
      return [...state, action.payload];
    default:
      return state;
  }
};

const paneerRedirectsReducer = (
  state = initialState.paneerRedirects,
  action
) => {
  switch (action.type) {
    case SET_PANEER_REDIRECTS:
      // *** IMPORTANT CHANGE HERE ***
      if (areArraysEqualShallow(state, action.payload)) {
        return state;
      }
      return action.payload;
    case ADD_PANEER_REDIRECT:
      return [...state, action.payload];
    default:
      return state;
  }
};

const toastReducer = (state = initialState.toast, action) => {
  switch (action.type) {
    case SHOW_TOAST:
      return {
        show: true,
        message: action.payload.message,
        type: action.payload.type,
      };
    case HIDE_TOAST:
      return { show: false, message: "", type: "success" };
    default:
      return state;
  }
};

export default combineReducers({
  suppliers: suppliersReducer,
  vendors: vendorsReducer,
  inwards: inwardsReducer,
  outwards: outwardsReducer,
  returns: returnsReducer,
  paneerRedirects: paneerRedirectsReducer,
  toast: toastReducer,
  apiStatus: apiStatusReducer,
});
