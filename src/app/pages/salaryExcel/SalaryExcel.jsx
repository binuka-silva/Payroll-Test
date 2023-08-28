import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import payrollProcessService from "../../api/payrollProcessServices/payrollProcessService";
import {connect} from "react-redux";
import SalaryExcelList from "./SalaryExcelList";
import {setPayrollTaxDetails} from "../../redux/actions/PayrollTaxDetailsActions";
import localStorageService from "../../services/localStorageService";
import payItemService from "../../api/payItemServices/payItemService";
import GullLoadable from "../../../@gull/components/GullLoadable/GullLoadable";
import {setPayrollDetailsData} from "../../common/payrollDetails";
import payrollProcessingService from "../../api/payrollProcessingServices/payrollProcessService";
import {NotificationManager} from "react-notifications";
import employeesToPayItemsServices from "../../api/employeesToPayItemsServices/employeesToPayItemsServices";
import salaryService from "../../api/salaryServices/salaryService";
import {NavLink} from "react-router-dom";
import {payrollPeriodProcess, requestPath, salaryStatus,} from "./constant";
import PayrollDropDown from "../../components/PayrollDropDown";

const SalaryExcel = () => {
    const [isLoading, setLoading] = useState(false);
    const [employeesToPayItemsList, setEmployeesToPayItemsList] = useState([]);
    const [salaryData, setSalaryData] = useState([]);
    const [dateFromPeriod, setDateFromPeriod] = useState("");
    const [dateToPeriod, setDateToPeriod] = useState("");
    const [startDateData, setStartDateData] = useState([]);

    const [payItemsData, setPayItemsData] = useState([]);
    const [payrollPayItemsData, setPayrollPayItemsData] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);
    const [payrollProcessList, setPayrollProcessList] = useState([]);
    const [payrollProcessEmployeeStatusData, setPayrollProcessEmployeeStatusData,] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [tableData, setTableData] = useState([]);

    const [payroll, setPayroll] = useState(null);

    useEffect(() => {
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        fetchPayItem();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!payroll && payItemsData?.length !== 0) {
            setLoading(true);
            fetchPayrollProcessData().then(({data: payrollList}) => {
                payrollList = payrollList.map((payrollProcess) => ({
                    value: payrollProcess.id,
                    label: `${payrollProcess.code} - ${payrollProcess.name}`,
                }));
                setPayrollProcessList(payrollList);
                payrollProcessService()
                    .findOne(
                        localStorageService.getItem("selected_payroll")?.value ??
                        payrollList.find(
                            (p) =>
                                p.value ===
                                localStorageService.getItem("auth_user")
                                    ?.payrollDefinitionId
                        )?.value ??
                        payrollList[0],
                        requestPath
                    )
                    .then(({data: details}) => {
                        setPayroll(details);
                        setPayrollDetails(details);
                    });
            });
        }
    }, [payroll, payItemsData]);

    const setPayrollDetails = (details) => {
        setLoading(true);

        const {empData, payrollPayItems, employeesPayItems, salaries} =
            setPayrollDetailsData(details, payItemsData);

        setEmployeeData(empData);
        setPayrollPayItemsData(payrollPayItems);
        setEmployeesToPayItemsList(employeesPayItems);
        setSalaryData(salaries);

        setDateFromPeriod(details?.payRollPeriod?.payRollPeriodDetails?.find((v) => v.periodProcess !== payrollPeriodProcess.CLOSE)?.dateFrom.split(" ")[0]);
        setDateToPeriod(details?.payRollPeriod?.payRollPeriodDetails?.find((v) => v.periodProcess !== payrollPeriodProcess.CLOSE)?.dateTo.split(" ")[0]);

        let df = details.payRollPeriod.payRollPeriodDetails.map((period) => {
            return {
                value: period.periodNo,
                periodNo: period.periodProcess,
                label: period.dateFrom.split(" ")[0],
                startDate: period.dateFrom.split(" ")[0],
                endDate: period.dateTo.split(" ")[0],
            };
        });
        setStartDateData(df);

        let payrollId = details?.id;
        let payrollPeriodDetailId = details?.payRollPeriod?.payRollPeriodDetails?.find((v) => v.periodProcess !== payrollPeriodProcess.CLOSE)?.id;

        payrollProcessingService().getDetails(payrollId, payrollPeriodDetailId).then((response) => {
            let statusDataArray = [];
            if ((response.data.payrollProcessEmployees) !== null) {
                response.data.payrollProcessEmployees.forEach((item) => {
                    statusDataArray.push({
                        empCode: empData?.find((v) => v.value === item.employeeId)?.label,
                        status: item.status,
                    });
                });
            }
            setPayrollProcessEmployeeStatusData(statusDataArray);
        });

        setLoading(false);
    };

    const fetchPayrollProcessData = async () => {
        return await payrollProcessService().getAll();
    };

    //Fetch table data
    const fetchPayItem = () => {
        payItemService()
            .getAll()
            .then(({data}) => {
                data = data
                    .filter((v) => v.active === true)
                    .map((payItem) => ({
                        id: payItem.id,
                        code: payItem.code,
                        name: payItem.name,
                    }));
                setPayItemsData(data);
            });
    };

    const payrollOnChange = async (e, selected) => {
        if (!selected) return;
        setLoading(true);
        const {data} = await payrollProcessService().findOne(
            selected.value,
            requestPath
        );
        localStorageService.setItem("selected_payroll", selected);
        setPayrollDetails(data);
        setPayroll(data);
    };

    const getSelectedRows = (rows) => {
        setFilteredEmployees(rows);
    };

    const setSalaryStatus = () => {
        new Promise((resolve, reject) => {
            let salId = salaryData.find((v) => v.id === (filteredEmployees.find((p) => p.id === v.id)?.id))?.id;

            //Obj Create
            const salStatus = filteredEmployees.map((sal) => ({
                id: sal.id,
                salaryStatus: salaryStatus.CONFIRMED,
            }));

            salaryService()
                .updateSalaryStatus(salStatus, salId)
                .then((response) => {

                    NotificationManager.success(
                        salStatus?.length + " records was successfully confirmed",
                        "Success"
                    );

                    let a = tableData.filter((v) => v.id === (salStatus.find((p) => p.id === v.id)?.id));
                    let b = tableData.filter((v) => v.id !== (salStatus.find((p) => p.id === v.id)?.id));
                    let c = a.map((sal) => ({
                        id: sal.id,
                        salaryStatus: Object.keys(salaryStatus)[1],
                        applieddate: sal.applieddate,
                        arrearsAmount: sal.arrearsAmount,
                        effectiveDate: sal.effectiveDate,
                        empName: sal.empName,
                        employee: sal.employee,
                        isPercentage: sal.isPercentage,
                        newValue: sal.newValue,
                        oldValue: sal.oldValue,
                        payItem: sal.payItem,
                        value: sal.value,
                    }));
                    let d = b.concat(...c);
                    setTableData(b.concat(...c));

                    //Reload list
                    resolve();
                })
                .catch((error) => {
                    console.error(error);
                    if (error.statusCode === 409) {
                        NotificationManager.error(error.message, "Error");
                    }
                    reject();
                });
        });
    };

    const changeEmployeesToPayItemsAmount = () => {
        new Promise((resolve, reject) => {

            let y = employeesToPayItemsList.filter((v) => v.payrollPayItemCode === (filteredEmployees.find((p) => p.payItem === v.payrollPayItemCode)?.payItem));
            let empItemId = y.find((v) => v.employee === (filteredEmployees.find((p) => p.employee === v.employee)?.employee))?.id;

            const salStatus = filteredEmployees.map((employee) => ({
                id: y.find((v) => v.employee === employee.employee)?.id,
                amount: employee.newValue,
            }));

            employeesToPayItemsServices()
                .updateWithSalaryStatus(salStatus, empItemId)
                .then((response) => {
                    NotificationManager.success(
                        salStatus?.length + " records was successfully updated",
                        "Success"
                    );

                    //Reload list
                    resolve();
                })
                .catch((error) => {
                    console.error(error);
                    if (error.statusCode === 409) {
                        NotificationManager.error(error.message, "Error");
                    }
                    reject();
                });
        });
    };

    return (
        <>
            <div className="row">
                {isLoading && (
                    <div className="overlay">
                        <GullLoadable/>
                    </div>
                )}
                <div className="col-md-7 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Dashboard", path: "/dashboard/v1/"},
                            {name: "Salary Increment Excel Uploader"},
                        ]}
                    ></Breadcrumb>
                </div>
                <div className="col-md-2">
                    <div className="mt-2 d-flex justify-content-start">
                        <NavLink to={"/payroll"}>
                            <span className="capitalize text-muted">|&nbsp;Payroll&nbsp;|</span>
                        </NavLink>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="mt-1 d-flex justify-content-end">
                        <PayrollDropDown payrollOnChange={payrollOnChange} payrollProcessList={payrollProcessList}/>
                    </div>
                </div>
            </div>
            <div className="row">
                <SalaryExcelList
                    employeeData={employeeData}
                    payItemsData={payItemsData}
                    payrollPayItemsData={payrollPayItemsData}
                    salaryData={salaryData}
                    startDateData={startDateData}
                    employeesToPayItemsList={employeesToPayItemsList}
                    processPeriod={`${dateFromPeriod} - ${dateToPeriod}`}
                    payroll={payroll}
                    dateFromPeriod={dateFromPeriod}
                    dateToPeriod={dateToPeriod}
                    tableData={tableData}
                    setTableData={setTableData}
                    payrollProcessEmployeeStatusData={payrollProcessEmployeeStatusData}
                    selectedRows={getSelectedRows}
                    filteredEmployees={filteredEmployees}
                    setSalaryData={setSalaryData}
                    isLoading={isLoading}
                    setLoading={setLoading}
                />
            </div>

            {/* <div className="row">
        <div className="col-md-3"></div>
        <div className="col-md-3"></div>
        <div className="col-md-3"></div>
        <div className="col-md-3 mt-3 d-flex justify-content-end">
          <Button
            variant="primary"
            type="submit"
            onClick={() => {
              setSalaryStatus();
              changeEmployeesToPayItemsAmount();
            }}
          >
            Increment Confirmed
          </Button>
        </div>
      </div> */}

            <br></br>
            <br></br>
            <br></br>

            <NotificationContainer/>
        </>
    );
};

const mapStateToProps = (state) => ({
    setPayrollTaxDetails: state.setPayrollTaxDetails,
});

export default connect(mapStateToProps, {
    setPayrollTaxDetails,
})(SalaryExcel);
