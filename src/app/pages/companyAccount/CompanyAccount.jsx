import React, {useEffect, useState} from "react";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import companyAccountService from "../../api/companyAccountServices/companyAccountService";
import payrollProcessService from "../../api/payrollProcessServices/payrollProcessService";
import {setPayrollTaxDetails} from "../../redux/actions/PayrollTaxDetailsActions";
import CompanyAccountList from "./CompanyAccountList";
import {connect, useSelector} from "react-redux";

const CompanyAccount = ({setPayrollTaxDetails, payrollProcessList}) => {
    const [companyAccountList, setCompanyAccountList] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const payrollCompanyAccounts = useSelector(
        (state) => state.payrollTaxDetails
    );

    //Component did mount only
    useEffect(() => {
        window.scrollTo(0, 0);
        //Fetch table data
        fetchCategoryData();
        if (payrollCompanyAccounts) {
            setCompanyAccountList(payrollCompanyAccounts.payrollTaxDetails);
        }

        // return () => {
        //   setPayrollTaxDetails({
        //     code: "",
        //     accountNumber: "",
        //     category: "",
        //     active: "",
        //     lastEditDate: "",
        //     bank: "",
        //     branch: "",
        //     id: "",
        //   });
        // };
    }, [payrollProcessList]);

    useEffect(() => {
        categoryData.length !== 0 && fetchCompanyAccount();
    }, [categoryData]);

    //Load data
    function fetchCategoryData() {
        companyAccountService()
            .getAllCompanyAccountsCategories()
            .then((response) => {
                let categoryDataArray = [];
                response.data.forEach((item) => {
                    categoryDataArray.push({value: item.id, label: item.name});
                });
                setCategoryData(categoryDataArray);
                //fetchCompanyAccountData(categoryDataArray);
            });
    }

    //Fetch table data
    const fetchCompanyAccountData = () => {
        let data = payrollCompanyAccounts.companyAccounts.map((companyAccount) => ({
            id: companyAccount.id,
            code: companyAccount.code,
            accountNumber: companyAccount.accountNumber,
            category: categoryData?.find(
                (v) => v.value === parseInt(companyAccount.category)
            )?.label,
            active: companyAccount.active,
            lastEditDate: companyAccount.lastEditDate.split("T")[0],
            bank: companyAccount.bank?.name,
            branch: companyAccount.branch?.name,
        }));
        setCompanyAccountList(data);
    };

    //Fetch table data
    const fetchCompanyAccount = () => {
        setLoading(true);
        payrollProcessService()
            .getCompanyAccounts(payrollCompanyAccounts.id)
            .then(({data}) => {
                data = data.companyAccounts.map((companyAccount) => ({
                    id: companyAccount.id,
                    code: companyAccount.code,
                    accountNumber: companyAccount.accountNumber,
                    category: categoryData?.find(
                        (v) => v.value === parseInt(companyAccount.category)
                    )?.label,
                    active: companyAccount.active,
                    lastEditDate: companyAccount.lastEditDate.split("T")[0],
                    bank: companyAccount.bank?.name,
                    branch: companyAccount.branch?.name,
                }));
                setLoading(false);
                setCompanyAccountList(data);
            });
    };

    //Load Company Accounts by Payroll Process
    async function getCompanyAccountByPayroll(PayrollDefinitionId) {
        let response = await companyAccountService()
            .findOne(PayrollDefinitionId)
            .then(async (response) => {
                setCompanyAccountList(response.data);
            });
        return response;
    }

    return (
        <>
            <div>
                <div className="row">
                    <CompanyAccountList
                        fetchCompanyAccountDataFunc={fetchCompanyAccount}
                        fetchCompanyAccountFunc={fetchCompanyAccount}
                        companyAccountList={companyAccountList}
                        categoryData={categoryData}
                        setCategoryData={setCategoryData}
                        payrollCompanyAccounts={payrollCompanyAccounts}
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
})(CompanyAccount);
