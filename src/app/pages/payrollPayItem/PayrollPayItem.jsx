import React, {useEffect, useState} from "react";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import payrollProcessService from "../../api/payrollProcessServices/payrollProcessService";
import {setPayrollTaxDetails} from "../../redux/actions/PayrollTaxDetailsActions";
import PayrollPayItemList from "./PayrollPayItemList";
import {connect, useSelector} from "react-redux";
import payItemService from "../../api/payItemServices/payItemService";


const PayrollPayItem = ({
                            setPayrollTaxDetails,
                            payrollProcessList,
                        }) => {
    const [payrollPayItemList, setPayrollPayItemList] = useState([]);
    const [payItemData, setPayItemData] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const payroll = useSelector((state) => state.payrollTaxDetails);

    //Component did mount only
    useEffect(() => {
        window.scrollTo(0, 0);

        fetchPayItemData();

        if (payroll.payrollTaxDetails) {
            setPayrollPayItemList(payroll.payrollTaxDetails);
        }
    }, []);

    //Fetch table data
    const fetchPayrollPayItemData = () => {

        let data = payroll.payrollPayItems.map((payrollPayItem) => {
            const payItem = payroll.payItemData?.find((v) => v.value === payrollPayItem.payItemId);
            return {
                id: payrollPayItem.id,
                payItem: payItem?.label,
                payItemName: payItem?.payItemName,
                payItemPeriod: payItem?.payItemPeriod,
                payItemType: payItem?.payItemType,
                paymentType: payItem?.paymentType,
                activeStatus: payItem?.activeStatus,
                active: payrollPayItem.active,
                assignedDate: payrollPayItem.assignedDate.split("T")[0],
            }
        });
        setPayrollPayItemList(data);
    };

    //Load data
    function fetchPayItemData() {
        setLoading(true);
        payItemService()
            .getAll()
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
                fetchPayrollPayItem(payItemDataArray);
            });
    }

    //Fetch table data
    const fetchPayrollPayItem = (payItems) => {
        payrollProcessService()
            .getPayrollPayItems(payroll.id)
            .then(({data}) => {
                data = data.payrollPayItems.map((payrollPayItem) => {
                    const selectedPayItem = payItems?.find((v) => v.value === payrollPayItem.payItemId);
                    return {
                        id: payrollPayItem.id,
                        payItem: selectedPayItem?.label,
                        payItemName: selectedPayItem?.payItemName,
                        payItemPeriod: selectedPayItem?.payItemPeriod,
                        payItemType: selectedPayItem?.payItemType,
                        isDefaultPayItem: payrollPayItem.isDefaultPayItem,
                        paymentType: selectedPayItem?.paymentType,
                        activeStatus: selectedPayItem?.activeStatus,
                        active: payrollPayItem.active,
                        assignedDate: payrollPayItem.assignedDate.split("T")[0],
                    }
                });
                setLoading(false);
                setPayrollPayItemList(data);
            });
    };

    return (
        <>
            <div>
                <div className="row">
                    <PayrollPayItemList
                        fetchPayrollPayItemFunc={() => fetchPayrollPayItem(payItemData)}
                        payrollPayItemList={payrollPayItemList}
                        payrollPayItems={payroll}
                        payItemData={payItemData}
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
