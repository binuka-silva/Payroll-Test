import React, {Suspense} from "react";
import "../styles/app/app.scss";

import {Provider} from "react-redux";
import {Router} from "react-router-dom";
import AppContext from "./appContext";
import history from "@history";

import routes from "./RootRoutes";
import RootRoutes from "./RootRoutes";
import {store} from "./redux/Store";
import {renderRoutes} from "react-router-config";
import Auth from "./auth/Auth";
import {Loading} from "@gull";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';
import {PersistGate} from "redux-persist/integration/react";

function App() {
    return (
        <AppContext.Provider value={{routes}}>
            <Provider store={store().store}>
                <PersistGate persistor={store().persistor} loading={<Loading></Loading>}>
                    <Auth>
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                            <Suspense fallback={<Loading></Loading>}>
                                <Router history={history}>{renderRoutes(RootRoutes)}</Router>
                            </Suspense>
                        </MuiPickersUtilsProvider>
                    </Auth>
                </PersistGate>
            </Provider>
        </AppContext.Provider>
    );
}

export default App;
