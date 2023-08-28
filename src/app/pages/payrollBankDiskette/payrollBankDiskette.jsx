import React, {useEffect, useState} from "react";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import payrollProcessService from "../../api/payrollProcessServices/payrollProcessService";
import {setPayrollTaxDetails} from "../../redux/actions/PayrollTaxDetailsActions";
import PayrollBankDisketteList from "./payrollBankDisketteList";
import {connect, useSelector} from "react-redux";
import payItemService from "../../api/payItemServices/payItemService";
import bankFileService from "../../api/bankDisketteServices/bankFileService";


const PayrollBankDiskette = ({
                                 setPayrollTaxDetails,
                                 payrollProcessList,
                             }) => {
    const [payrollBankDisketteList, setPayrollBankDisketteList] = useState([]);
    const [bankFileData, setBankFileData] = useState([]);
    //const [bankFileLineTypeData, setBankFileLineTypeData] = useState([]);
    const [payItemData, setPayItemData] = useState([]);
    const [payrollPayItemData, setPayrollPayItemData] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const payroll = useSelector((state) => state.payrollTaxDetails);

    //Component did mount only
    useEffect(() => {
        window.scrollTo(0, 0);
        fetchPayItemData();
        fetchBankFileData();

        if (payroll.payrollTaxDetails) {
            setPayrollBankDisketteList(payroll.payrollTaxDetails);
        }
    }, []);

    //Load data
    function fetchBankFileData() {
        bankFileService()
            .getAll()
            .then((response) => {
                let bankFileDataArray = [];
                // let bankFileLineTypeDataArray = [];
                // let confLineTypeDataArray = [];
                response.data.forEach((item) => {

                    // bankFileLineTypeDataArray = item.bankFileConfigurator.filter((v)=>v.lineType.multiLines === true)
                    // confLineTypeDataArray = bankFileLineTypeDataArray.map(lType=>({
                    //   confId:lType.id,
                    //   lineTypeId:lType.lineType.id,
                    //   label:lType.lineType.lineName
                    // }))
                    // setBankFileLineTypeData(confLineTypeDataArray);

                    bankFileDataArray.push({
                        value: item.id,
                        label: item.code,
                        bankFileName: item.name,
                        bank: item.bank.name,
                        bankFileConfigurator: item.bankFileConfigurator,
                    });
                });
                setBankFileData(bankFileDataArray);
                fetchPayrollBankDiskette(bankFileDataArray);
            });
    }


    //Fetch table data
    const fetchPayrollBankDiskette = (payItems) => {
        payrollProcessService()
            .getPayrollBankDiskettes(payroll.id)
            .then(({data}) => {
                data = data.payrollBankDiskette.map((payrollBankDiskettes) => {
                    const selectedBankFile = payItems?.find((v) => v.value === payrollBankDiskettes.bankFileId);
                    return {
                        id: payrollBankDiskettes.id,
                        bankFile: selectedBankFile?.label,
                        bankFileName: selectedBankFile?.bankFileName,
                        bank: selectedBankFile?.bank,
                        active: payrollBankDiskettes.active,
                        assignedDate: payrollBankDiskettes.assignedDate.split("T")[0],
                    };
                });
                setLoading(false);
                setPayrollBankDisketteList(data);
            });
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
                        value: payrollPayItem.id,
                        label: selectedPayItem?.payItemName,
                        payItemPeriod: selectedPayItem?.payItemPeriod,
                        payrollPayItemForNetSalaryId: selectedPayItem?.payrollPayItemForNetSalaryId,
                    };
                });
                setPayrollPayItemData(data);
            });
    };

    return (
        <>
            <div>
                <div className="row">
                    <PayrollBankDisketteList
                        fetchPayrollBankDisketteFunc={() => fetchPayrollBankDiskette(bankFileData)}
                        fetchPayrollPayItemFunc={() => fetchPayrollPayItem(payItemData)}
                        payrollBankDisketteList={payrollBankDisketteList}
                        payrollBankDiskettes={payroll}
                        bankFileData={bankFileData}
                        payrollPayItemData={payrollPayItemData}
                        isLoading={isLoading}
                    />
                </div>
                <NotificationContainer/>
            </div>
        </>
    );
};

const mapStateToProps = (state) => ({setPayrollTaxDetails: state.setPayrollTaxDetails,});

export default connect(mapStateToProps, {
    setPayrollTaxDetails,
})(PayrollBankDiskette);
