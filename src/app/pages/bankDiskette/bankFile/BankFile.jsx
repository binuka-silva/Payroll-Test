import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import {withRouter,} from "react-router-dom";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import bankFileService from "../../../api/bankDisketteServices/bankFileService";
import BankFileList from "./BankFileList";

const BankFile = () => {
    const [bankFileList, setBankFileList] = useState([]);
    const [isLoading, setLoading] = useState(false);

    //Component did mount only
    useEffect(() => {
        window.scrollTo(0, 0);
        // Clear all notifications
        //Fetch table data
        // fetchBankFileData();
    }, []);

    //Fetch table data
    const fetchBankFileData = () => {
        setLoading(true);
        bankFileService()
            .getAll()
            .then(({data}) => {
                data = data.map((bankFiles) => ({
                    id: bankFiles.id,
                    code: bankFiles.code,
                    name: bankFiles.name,
                    bank: bankFiles.bank?.name,
                }));
                setLoading(false);
                setBankFileList(data);
            });
    };

    return (
        <>
            <div className="row">
                <div className="col-md-12 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Dashboard", path: "/dashboard/v1/"},
                            {name: "Bank File"},
                        ]}
                    ></Breadcrumb>
                </div>
            </div>
            <div className="row">
                <BankFileList
                    fetchBankFileDataFunc={fetchBankFileData}
                    bankFileList={bankFileList}
                    isLoading={isLoading}
                    setLoading={setLoading}
                />
            </div>
            <NotificationContainer/>
        </>
    );
};

export default withRouter(BankFile);
