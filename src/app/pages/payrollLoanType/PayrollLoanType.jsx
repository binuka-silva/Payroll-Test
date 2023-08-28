import React, {useEffect, useState} from "react";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import payrollProcessService from "../../api/payrollProcessServices/payrollProcessService";
import {setPayrollTaxDetails} from "../../redux/actions/PayrollTaxDetailsActions";
import PayrollLoanTypeList from "./PayrollLoanTypeList";
import {connect, useSelector} from "react-redux";
import loanTypeService from "../../api/LoanTypeServices/loanTypeService";


const PayrollPayItem = ({
                            setPayrollTaxDetails,
                            payrollProcessList,
                        }) => {
    const [payrollLoanTypeList, setPayrollLoanTypeList] = useState([]);
    const [loanTypeData, setLoanTypeData] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const payroll = useSelector((state) => state.payrollTaxDetails);

    //Component did mount only
    useEffect(() => {
        window.scrollTo(0, 0);

        fetchLoanTypeData();

        if (payroll.payrollTaxDetails) {
            setPayrollLoanTypeList(payroll.payrollTaxDetails);
        }
    }, []);

    //Load data
    function fetchLoanTypeData() {
        //setLoading(true);
        loanTypeService().getAll()
            .then((response) => {
                let loanTypeDataArray = [];
                response.data.forEach((loantype) => {

                    loanTypeDataArray.push({
                        value: loantype.id,
                        label: loantype.code,
                        loanName: loantype.name,
                        activeStatus: loantype.active,
                    });
                });
                setLoanTypeData(loanTypeDataArray);
                fetchPayrollLoanType(loanTypeDataArray);
            });
    }

    //Fetch table data
    const fetchPayrollLoanType = (loantypes) => {
        payrollProcessService().getPayrollLoanTypes(payroll.id)
            .then(({data}) => {
                data = data.payrollLoanType.map((payrollLoanType) => {

                    const selectedLoanType = loantypes?.find((v) => v.value === payrollLoanType.loanTypeId);
                    return {
                        id: payrollLoanType.id,
                        loanType: selectedLoanType?.label,
                        loanName: selectedLoanType?.loanName,
                        activeStatus: selectedLoanType?.activeStatus,
                        active: payrollLoanType.active,
                        assignedDate: payrollLoanType.assignedDate.split("T")[0],
                    };
                });
                //setLoading(false);
                setPayrollLoanTypeList(data);
            });
    };

    return (
        <>
            <div>
                <div className="row">
                    <PayrollLoanTypeList
                        fetchPayrollLoanTypeFunc={() => fetchPayrollLoanType(loanTypeData)}
                        payrollLoanTypeList={payrollLoanTypeList}
                        payrollLoanTypes={payroll}
                        loanTypeData={loanTypeData}
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
})(PayrollPayItem);
