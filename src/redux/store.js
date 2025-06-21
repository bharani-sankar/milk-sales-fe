import { createStore, applyMiddleware } from "redux"; // Import applyMiddleware
import { thunk } from "redux-thunk"; // Import thunk
import rootReducer from "./reducers";

// Apply Redux Thunk middleware
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
