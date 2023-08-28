import React, {useEffect} from "react";
import {Breadcrumb} from "@gull";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import BankFileFormatList from "./BankFileFormatList";
import {connect} from "react-redux";

const BankFileFormat = () => {
    //Component did mount only
    useEffect(() => {
        window.scrollTo(0, 0);
        // Clear all notifications
    }, []);

    return (
        <>
            <div className="row">
                <div className="col-md-12 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Dashboard", path: "/dashboard/v1/"},
                            {name: "Bank File", path: "/bank-file"},
                            {
                                name: "Bank File Configurator",
                                path: "/bank-file-configurator",
                            },
                            {name: "Bank File Line Format"},
                        ]}
                    ></Breadcrumb>
                </div>
            </div>
            <>
                <div className="row">
                    <BankFileFormatList/>
                </div>
                <NotificationContainer/>
            </>
        </>
    );
};

const mapStateToProps = (state) => ({
    setPayItemCalculationsDetails: state.setPayItemCalculationsDetails,
});

export default connect(mapStateToProps, {
    BankFileFormat,
})(BankFileFormat);

