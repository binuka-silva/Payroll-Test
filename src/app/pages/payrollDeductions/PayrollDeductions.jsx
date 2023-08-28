import React, {useEffect, useState} from "react";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import payrollProcessService from "../../api/payrollProcessServices/payrollProcessService";
import {setPayrollTaxDetails} from "../../redux/actions/PayrollTaxDetailsActions";
import PayrollDeductionsList from "./PayrollDeductionsList";
import {connect, useSelector} from "react-redux";
import payItemService from "../../api/payItemServices/payItemService";
import payrollPayItemService from "../../api/payrollPayItemServices/payrollPayItemService";


const PayrollDeductions = ({ setPayrollTaxDetails, payrollProcessList }) => {
  const [payrollDeductionList, setPayrollDeductionList] = useState([]);
  const [payItemData, setPayItemData] = useState([]);
  const [payrollPayItemData, setPayrollPayItemData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const payroll = useSelector((state) => state.payrollTaxDetails);

  //Component did mount only
  useEffect(() => {
    window.scrollTo(0, 0);

    fetchPayItemData(); 
    if (payroll.payrollTaxDetails) {
      setPayrollDeductionList(payroll.payrollTaxDetails);
    }
  }, []);

  //Load data
  function fetchPayItemData() {
    setLoading(true);
    payItemService().getAll()
      .then((response) => {
        let payItemDataArray = [];
        response.data.forEach((item) => {
          payItemDataArray.push({
            value: item.id,
            label: item.code,
            payItemName: item.name,
            payItemType: item.payItemType.type,
            payItemPeriod: item.payItemPeriod.name,
            paymentType: item.paymentType.type,
            activeStatus: item.active,
          });
        });
        setPayItemData(payItemDataArray);
        fetchPayrollPayItemData(payItemDataArray);
      });
  }

  //Load data
  function fetchPayrollPayItemData(payItems) { 
    payrollProcessService().getPayrollPayItems(payroll.id)
      .then((response) => {
        let payItemDataArray = [];
        
        response.data.payrollPayItems.forEach((item) => {
           
          payItemDataArray.push({
            value: item.id,
            label: payItems.find((v) => v.value === item.payItemId)?.label,
            payItemName: payItems.find((v) => v.value === item.payItemId)?.payItemName,
          });
        });
        setPayrollPayItemData(payItemDataArray); 
        fetchPayrollDeductions(payItemDataArray);
      });
  }

  //Fetch table data
  const fetchPayrollDeductions = (payItems) => {
    payrollProcessService().getPayrollDeductions(payroll.id)
      .then(({ data }) => {
        
        data = data?.payrollDeductions?.map((payrollDeduction) => {
          const selectedPayItem = payItems?.find((v) => v.value === payrollDeduction.payItemId);
          return {
            id: payrollDeduction.id,
            payItem: selectedPayItem?.label,
            payItemName: selectedPayItem?.payItemName,
            sequence: payrollDeduction.sequence,  
          };
        });
        setPayrollDeductionList(data);
        setLoading(false);
      });
  };

  return (
    <>
      <div>
        <div className="row">
          <PayrollDeductionsList
            fetchPayrollDeductionFunc={() => fetchPayrollDeductions(payrollPayItemData)}
            payrollDeductionList={payrollDeductionList}
            payrollDeduction={payroll}
            payItemData={payItemData}
            payrollPayItemData={payrollPayItemData}
            isLoading={isLoading}
          />
        </div>
        <NotificationContainer />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
    setPayrollTaxDetails: state.setPayrollTaxDetails,
});

export default connect(mapStateToProps, {
  setPayrollTaxDetails,
})(PayrollDeductions);
