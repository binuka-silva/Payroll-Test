import React, {useEffect, useState} from "react";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import payrollParameterService from "../../api/payrollParameterServices/payrollParameterService";
import {setPayrollTaxDetails} from "../../redux/actions/PayrollTaxDetailsActions";
import PayrollParameterList from "./PayrollParameterList";
import {connect, useSelector} from "react-redux";

const PayrollParameter = ({setPayrollTaxDetails}) => {
    const [payrollParameterList, setPayrollParameterList] = useState([]);
    const [dataTypeData, setDataTypeData] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const payrollParameters = useSelector((state) => state.payrollTaxDetails);

    //Component did mount only
    useEffect(() => {
        window.scrollTo(0, 0);
        //Fetch table data
        fetchDataTypeData();
        if (payrollParameters) {
            setPayrollParameterList(payrollParameters.payrollTaxDetails);
        }

        // return () => {
        //   setPayrollTaxDetails({
        //     code: "",
        //     name: "",
        //     dataType: "",
        //     value: "",
        //     id: "",
        //   });
        // };
    }, []);

    useEffect(() => {
        dataTypeData.length !== 0 && fetchPayrollParameterData();
    }, [dataTypeData]);

    //Load data
    function fetchDataTypeData() {
        payrollParameterService()
            .getAllPayrollParameterDataTypes()
            .then((response) => {
                let dataTypeDataArray = [];
                response.data.forEach((item) => {
                    dataTypeDataArray.push({value: item.id, label: item.name});
                });
                setDataTypeData(dataTypeDataArray);
                //fetchPayrollParameterData(dataTypeDataArray);
            });
    }

    //Fetch table data
    const fetchPayrollParameterData = () => {
        setLoading(true);
        payrollParameterService()
            .getAll()
            .then(({data}) => {
                data = data.map((payrollParameter) => ({
                    id: payrollParameter.id,
                    code: payrollParameter.code,
                    name: payrollParameter.name,
                    dataType: dataTypeData?.find(
                        (v) => v.value === parseInt(payrollParameter.dataType)
                    )?.label,
                    value: payrollParameter.payrollDefinitionPayrollParameter.find(
                        (v) => v.payrollDefinitionId === payrollParameters.id
                    )?.value ?? "",
                }));
                setPayrollParameterList(data);
                setLoading(false);
            });
    };

    return (
        <>
            <div>
                <div className="row">
                    <PayrollParameterList
                        fetchPayrollParameterDataFunc={fetchPayrollParameterData}
                        payrollParameterList={payrollParameterList}
                        dataTypeData={dataTypeData}
                        setDataTypeData={setDataTypeData}
                        payrollParameters={payrollParameters}
                        isLoading={isLoading}
                    />
                </div>
                <NotificationContainer/>
            </div>
        </>
    );
};

const mapStateToProps = (state) => ({
    setPayrollTaxDetails: state.setPayrollTaxDetails,
});

export default connect(mapStateToProps, {
    setPayrollTaxDetails,
})(PayrollParameter);
