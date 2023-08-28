import thunk from "redux-thunk";
import {applyMiddleware, compose, createStore} from "redux";
import RootReducer from "./reducers/RootReducer";
import {persistReducer, persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const initialState = {};

const middlewares = [thunk];
let devtools = x => x;

if (
    process.env.NODE_ENV !== "production" &&
    process.browser &&
    window.__REDUX_DEVTOOLS_EXTENSION__
) {
    devtools = window.__REDUX_DEVTOOLS_EXTENSION__();
}

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, RootReducer)

export const store = () => {
    const store = createStore(
        persistedReducer,
        initialState,
        compose(applyMiddleware(...middlewares), devtools)
    );
    const persistor = persistStore(store)
    return {store, persistor}
};
