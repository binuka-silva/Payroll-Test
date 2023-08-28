import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import {useHistory} from "react-router-dom";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import branchService from "../../api/branchServices/branchService";
import BranchList from "./BranchList";
import {connect, useSelector} from "react-redux";

import {setBankDetails} from "../../redux/actions/BankDetailsAction";

const Branch = ({setBankDetails}) => {
    const [branchList, setBranchList] = useState([]);
    const [branches, setBranches] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [size, setSize] = useState(0);

    const bank = useSelector((state) => state.bankDetails);

    let history = useHistory();

    history.listen(nextLocation => {
        if (nextLocation.pathname != '/branch') {
            setBankDetails({id: null});
        }
    });

    //Component did mount only
    useEffect(() => {
        window.scrollTo(0, 0);
        //Fetch table data
        // await fetchBranchData();
    }, []);

    //Fetch table data
    const fetchBranchData = async () => {
        setLoading(true);
        await branchService()
            .getAll()
            .then(({data}) => {
                data = data.map(branch => ({
                    id: branch.id,
                    bankId: branch.bank?.name,
                    code: branch.code,
                    name: branch.name,
                    referenceCode: branch.referenceCode,
                    address: branch.address,
                    createdBy: branch.createdBy,
                }));
                if (bank.id == null) {
                    setBranchList(data);
                    setLoading(false);
                    return;
                }
                setBranchList(data.filter(data => data.bankId == bank.name));
                setLoading(false);
            })
    };

    //Load branch by bank
    // async function getBranchesbyBank(bankId) {
    //   let response = await dashboardService()
    //     .findOne(bankId)
    //     .then(async (response) => {
    //       setBranches(response.data);
    //     });
    //   return response;
    // }

    return (
        <>
            <div className="row">
                <div className="col-md-12 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Dashboard", path: "/dashboard/v1/"},
                            {name: "Bank", path: "/bank"},
                            {name: "Branch"},
                        ]}
                    ></Breadcrumb>
                </div>
                {/* <div className="col-md-1">
          <div className="mt-3 d-flex justify-content-end">
            <PayrollButton toList={"/bank"} />
          </div>
        </div> */}
            </div>

            <div className="row">
                <BranchList
                    fetchBranchDataFunc={fetchBranchData}
                    branchList={branchList}
                    isLoading={isLoading}
                />
            </div>
            <NotificationContainer/>
        </>
    );
};

const mapStateToProps = (state) => ({setBankDetails: state.setBankDetails,});

export default connect(mapStateToProps, {setBankDetails,})(Branch);
