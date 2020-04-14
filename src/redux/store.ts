import { createStore, applyMiddleware, Middleware } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import reducers from "./reducers";

const middleWares: Middleware[] = [thunk];

if (process.env.NODE_ENV === "development") {
    //removing redux-logger from production build
    middleWares.push(logger);
}

const store = createStore(reducers, applyMiddleware(...middleWares));

export default store;
