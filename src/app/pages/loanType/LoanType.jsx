import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import {withRouter} from "react-router-dom";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import loanTypeService from "../../api/LoanTypeServices/loanTypeService";
import LoanTypeList from "./LoanTypeList";

const LoanType = () => {
    const [loanTypeList, setLoanTypeList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [calculationLogicData, setCalculationLogicData] = useState([]);

    //Component did mount only
    useEffect(() => {
        window.scrollTo(0, 0);
        //Fetch table data
        //await fetchLoanTypeData();
        fetchCalculationLogicData();
    }, []);

    useEffect(() => {
        calculationLogicData.length !== 0 && fetchLoanTypeData();
    }, [calculationLogicData]);

    //Load data
    function fetchCalculationLogicData() {
        loanTypeService()
            .getAllLoanCalculationLogicTypes()
            .then((response) => {
                let loanCalculationDataArray = [];
                response.data.forEach((item) => {
                    loanCalculationDataArray.push({value: item.id, label: item.name});
                });
                setCalculationLogicData(loanCalculationDataArray);
            });
    }

    // //Fetch table data
    // const fetchLoanTypeData = async () => {
    //   setLoading(true);
    //   await loanTypeService().getAll().then(async (response) => {
    //       setLoanTypeList(response.data);
    //     });
    //   setLoading(false);
    // };

    //Fetch table data
    const fetchLoanTypeData = async () => {
        setLoading(true);
        await loanTypeService()
            .getAll()
            .then(({data}) => {
                data = data.map((loantype) => ({
                    id: loantype.id,
                    code: loantype.code,
                    name: loantype.name,
                    calculationLogic: calculationLogicData?.find((v) => v.value === parseInt(loantype.calculationLogic))?.label,
                    maxAmount: loantype.maxAmount,
                    maxInstalments: loantype.maxInstalments,
                    interestRate: loantype.interestRate,
                    active: loantype.active,
                    allowMultiple: loantype.allowMultiple,
                }));
                setLoanTypeList(data);
            });
        setLoading(false);
    };

    return (
        <>
            <div className="row">
                <div className="col-md-12 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Dashboard", path: "/dashboard/v1/"},
                            {name: "Loan Type"},
                        ]}
                    ></Breadcrumb>
                </div>
            </div>

            <div className="row">
                <LoanTypeList
                    fetchLoanTypeDataFunc={fetchLoanTypeData}
                    loanTypeList={loanTypeList}
                    fetchCalculationLogicData={fetchCalculationLogicData}
                    calculationLogicData={calculationLogicData}
                    isLoading={isLoading}
                />
            </div>
            <NotificationContainer/>
        </>
    );
}

export default withRouter(LoanType);
