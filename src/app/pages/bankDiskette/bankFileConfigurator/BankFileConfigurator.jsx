import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import {NavLink,} from "react-router-dom";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import bankFileService from "../../../api/bankDisketteServices/bankFileService";
import BankFileConfiguratorList from "./BankFileConfiguratorList";
import {connect, useSelector} from "react-redux";
import {setBankFile} from "../../../redux/actions/BankFileAction";

const BankFileConfigurator = ({setBankFile}) => {
    const [bankFileConfiguratorList, setBankFileConfiguratorList] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const bankFiles = useSelector((state) => state.bankFile);

    //Component did mount only
    useEffect(() => {
        window.scrollTo(0, 0);
        // Clear all notifications
        //Fetch table data
        // fetchBankFileConfiguratorData();

        if (bankFiles.bankFile) {
            setBankFileConfiguratorList(bankFiles.bankFile);
        }

        // return () => {
        //   setBankFile({
        //     bankFile: null,
        //     id: "",
        //   });
        // };
    }, []);

    //Fetch table data
    const fetchBankFileConfiguratorData = () => {
        setLoading(true);
        bankFileService()
            .getBankConfigurators(bankFiles.id)
            .then(({data}) => {
                data = data.bankFileConfigurator.map((bankFiles) => ({
                    id: bankFiles.id,
                    sequence: bankFiles.sequence,
                    commaSeparated: bankFiles.commaSeparated,
                    lineName: bankFiles.lineType?.lineName,
                }));
                setLoading(false);
                setBankFileConfiguratorList(data);
            });
    };

    // //Fetch table data
    // const fetchBankFileConfiguratorData = () => {
    //   setLoading(true);
    //   bankFileConfiguratorService()
    //     .getAll()
    //     .then(({ data }) => {
    //       data = data.map((bankFiles) => ({
    //         id: bankFiles.id,
    //         sequence: bankFiles.sequence,
    //         commaSeparated: bankFiles.commaSeparated,
    //         lineName: bankFiles.lineType?.lineName,
    //       }));
    //       setLoading(false);
    //       setBankFileConfiguratorList(data);
    //     });
    // };

    return (
        <>
            <div className="row">
                <div className="col-md-8 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Dashboard", path: "/dashboard/v1/"},
                            {name: "Bank File", path: "/bank-file"},
                            {name: "Bank File Configurator"},
                        ]}
                    ></Breadcrumb>
                </div>
                <div className="col-md-4">
                    <div className="mt-2 d-flex justify-content-start">
                        <NavLink to={"/bank-line-types"}>
                            <span className="capitalize text-muted">|&nbsp;Line&nbsp;Types&nbsp;|</span>
                        </NavLink>
                    </div>
                </div>
                {/* <div className="col-md-1">
          <div className="mt-3 d-flex justify-content-end">
            <PayrollButton toList={"/bank-file"} />
          </div>
        </div> */}
            </div>

            <div className="row">
                <BankFileConfiguratorList
                    fetchBankFileConfiguratorDataFunc={fetchBankFileConfiguratorData}
                    bankFileConfiguratorList={bankFileConfiguratorList}
                    setBankFileConfiguratorList={setBankFileConfiguratorList}
                    isLoading={isLoading}
                    setLoading={setLoading}
                />
            </div>
            <NotificationContainer/>
        </>
    );
};

const mapStateToProps = (state) => ({
    setBankFile: state.setBankFile,
});

export default connect(mapStateToProps, {
    setBankFile,
})(BankFileConfigurator);