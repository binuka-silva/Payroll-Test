import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import {withRouter} from "react-router-dom";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import bankService from "../../api/bankServices/bankService";
import BankList from "./BankList";

const Bank = () => {
    const [bankList, setBankList] = useState([]);
    const [isLoading, setLoading] = useState(false);

    //Component did mount only
    useEffect(async () => {
        window.scrollTo(0, 0);
        //Fetch table data
        // await fetchBankData();
    }, []);

    //Fetch table data
    const fetchBankData = async () => {
        setLoading(true);
        await bankService()
            .getAll()
            .then(async (response) => {
                setBankList(response.data);
                setLoading(false);
            });
    };

    return (
        <>
            <Breadcrumb
                routeSegments={[
                    {name: "Dashboard", path: "/dashboard/v1/"},
                    {name: "Bank"},
                ]}
            ></Breadcrumb>

            {/* <div className="row">
               <div className="mb-4">
                    <BankModal className="mb-3"
                    centered={true}
                    name="Add Bank"
                    fetchBankDataFunc={fetchBankData}>

                    </BankModal>
                </div>
            </div>

            <div className="separator-breadcrumb border-top"></div> */}
            <div className="row">
                <BankList
                    fetchBankDataFunc={fetchBankData}
                    bankList={bankList}
                    isLoading={isLoading}
                />
            </div>
            <NotificationContainer/>
        </>
    );
};

export default withRouter(Bank);
