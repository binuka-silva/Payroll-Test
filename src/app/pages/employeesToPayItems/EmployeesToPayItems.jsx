import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import payrollProcessService from "../../api/payrollProcessServices/payrollProcessService";
import {connect} from "react-redux";
import {Button, FormLabel} from "react-bootstrap";
import payItemTypeService from "app/api/payItemTypeServices/payItemTypeService";
import payItemPeriodService from "app/api/payItemPeriodServices/payItemPeriodService";
import EmployeesToPayItemsList from "./EmployeesToPayItemsList";
import {setPayrollTaxDetails} from "../../redux/actions/PayrollTaxDetailsActions";
import {labels, payrollPeriodProcess, requestPath} from "./constant";
import EmployeesToPayItemsModal from "./EmployeesToPayItemsModal";
import AutoCompleteDropDown from "../../components/AutoCompleteDropDown";
import localStorageService from "../../services/localStorageService";
import payItemService from "app/api/payItemServices/payItemService";
import GullLoadable from "../../../@gull/components/GullLoadable/GullLoadable";
import moment from "moment";
import {NavLink} from "react-router-dom";
import PayrollDropDown from "../../components/PayrollDropDown";

const EmployeesToPayItems = () => {
    const [isLoading, setLoading] = useState(false);
    const [isWindowLoading, setWindowLoading] = useState(false);
    const [employeesToPayItemsList, setEmployeesToPayItemsList] = useState([]);
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [dateFromPeriod, setDateFromPeriod] = useState("");
    const [dateToPeriod, setPDateToPeriod] = useState("");
    const [amount, setAmount] = useState("");
    const [units, setUnits] = useState("");
    const [employerAmount, setEmployerAmount] = useState("");
    const [payItem, setPayItem] = useState("");
    const [payItemType, setPayItemType] = useState("");
    const [payItemPeriod, setPayItemPeriod] = useState("");
    const [sPeriods, setSPeriods] = useState("");
    const [ePeriods, setEPeriods] = useState("");
    const [prossPeriods, setProssPeriods] = useState("");

    const [payItemTypeData, setPayItemTypeData] = useState([]);
    const [payItemPeriodData, setPayItemPeriodData] = useState([]);
    const [payItemsData, setPayItemsData] = useState([]);
    const [payItemData, setPayItemData] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [payrollProcessList, setPayrollProcessList] = useState([]);
    const [labelList, setLabelList] = useState([]);
    const [userLabels, setUserLabels] = useState([]);
    const [startDateData, setStartDateData] = useState([]);
    const [endDateData, setEndDateData] = useState([]);
    const [processPeriodList, setProcessPeriodList] = useState([]);
    const [closePeriodsData, setClosePeriodsData] = useState([]);

    const [payroll, setPayroll] = useState(null);

    const [selectedPayItemType, setSelectedPayItemType] = useState(null);
    const [selectedPayItemPeriod, setSelectedPayItemPeriod] = useState(null);
    const [filteredPayItem, setFilteredPayItem] = useState([]);

    const [employee, setEmployee] = useState("");
    const [employeeInDropdown, setEmployeeInDropdown] = useState("");

    useEffect(() => {
        setLabelList(
            localStorageService
                .getItem("label_list")
                ?.filter(
                    (list) => list.permissionPage.path === window.location.pathname
                )
        );
        setUserLabels(localStorageService.getItem("auth_user")?.labels);

        fetchPayrollProcessData();
        fetchPayItemTypeData();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
        setWindowLoading(true);
        if (payrollProcessList?.length !== 0) {
            payrollProcessService()
                .findOne(
                    localStorageService.getItem("selected_payroll")?.value ??
                    payrollProcessList.find((payrollProcess) =>
                        payrollProcess.value === localStorageService.getItem("auth_user")?.payrollDefinitionId)?.value ??
                    payrollProcessList[0].value,
                    window.location.pathname
                )
                .then(({data: details}) => {
                    setPayroll(details);
                    setPayrollDetails(details);
                });
        }
    }, [payrollProcessList]);

    useEffect(() => {
        const payrollPayItems = payroll?.payrollPayItemPageHeader.payrollPayItems
            .filter((v) => v.active === true)
            .map((payrollPayItem) => {
                const payItem = payItemData.find(
                    (v) => v.value === payrollPayItem.payItemId
                );

                return {
                    value: payrollPayItem.id,
                    label: payItem?.label,
                    code: payItem?.code,
                    payItemType: payItemData?.find(
                        (v) => v.value === payrollPayItem.payItemId
                    )?.payItemType,
                    payItemPeriod: payItemData?.find(
                        (v) => v.value === payrollPayItem.payItemId
                    )?.payItemPeriod,
                    paymentType: payItemData?.find(
                        (v) => v.value === payrollPayItem.payItemId
                    )?.paymentType,
                };
            });

        setPayItemsData(payrollPayItems);

        let data = payrollPayItems?.filter((v) => v.payItemType === selectedPayItemType?.label && v.payItemPeriod === selectedPayItemPeriod?.label);

        let filteredData = data?.map((payrollProcess) => ({
            value: payrollProcess.value,
            label: `${payrollProcess.code} - ${payrollProcess.label}`,
        }));
        setFilteredPayItem(filteredData ? filteredData : []);
    }, [payItemData]);

    const fetchPayrollProcessData = async () => {
        await payrollProcessService()
            .getNames()
            .then(({data: payrollList}) => {
                payrollList = payrollList.map((payrollProcess) => ({
                    value: payrollProcess.id,
                    label: `${payrollProcess.code} - ${payrollProcess.name}`,
                }));
                setPayrollProcessList(payrollList);
            })
    }

    const payrollOnChange = async (e, selected) => {
        if (selected) {
            setWindowLoading(true);
            const {data} = await payrollProcessService().findOne(selected.value, requestPath);
            localStorageService.setItem("selected_payroll", selected);
            setPayrollDetails(data);
            setPayroll(data);
            setPayItemType("");
            setSelectedPayItemType(null);
            setPayItemPeriod("");
            setSelectedPayItemPeriod(null);
            setEmployeesToPayItemsList([]);

            let pp = data.payRollPeriod.payRollPeriodDetails.map((period) => {
                return {
                    value: period.periodNo,
                    periodNo: period.periodProcess,
                    label: `${period.dateFrom.split(" ")[0]} - ${
                        period.dateTo.split(" ")[0]
                    }`,
                };
            });
            setProssPeriods(pp?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.label);
            setSPeriods(pp?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.label.split(" ")[0]);
            setEPeriods(pp?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.label.split(" ")[2]);
            setWindowLoading(false);
        }
    };

    const setPayrollDetails = (details) => {
        setLoading(true);

        setCode(details?.code);
        setName(details?.name);

        let processPeriodDataList = details.payRollPeriod.payRollPeriodDetails.map((period) => {
            return {
                value: period.periodNo,
                periodNo: period.periodProcess,
                sDate: moment(period.dateFrom.split(" ")[0]).format("YYYY-MM-DD"),
                eDate: moment(period.dateTo.split(" ")[0]).format("YYYY-MM-DD"),
                label: `${moment(period.dateFrom.split(" ")[0]).format("YYYY-MM-DD")} - ${moment(period.dateTo.split(" ")[0]).format("YYYY-MM-DD")}`,
            };
        });
        setProcessPeriodList(processPeriodDataList);

        setDateFromPeriod(
            details?.payRollPeriod?.payRollPeriodDetails
                ?.find((v) => v.periodProcess !== payrollPeriodProcess.CLOSE)
                ?.dateFrom.split(" ")[0]
        );
        setPDateToPeriod(
            details?.payRollPeriod?.payRollPeriodDetails
                ?.find((v) => v.periodProcess !== payrollPeriodProcess.CLOSE)
                ?.dateTo.split(" ")[0]
        );

        let df = details.payRollPeriod.payRollPeriodDetails.map((period) => {
            return {
                value: period.periodNo,
                periodNo: period.periodProcess,
                label: moment(period.dateFrom.split(" ")[0]).format("YYYY-MM-DD"),
                startDate: moment(period.dateFrom.split(" ")[0]).format("YYYY-MM-DD"),
                endDate: moment(period.dateTo.split(" ")[0]).format("YYYY-MM-DD"),
            };
        });
        setStartDateData(df);

        let dt = details.payRollPeriod.payRollPeriodDetails.map((period) => {
            return {
                value: period.periodNo,
                label: moment(period.dateTo.split(" ")[0]).format("YYYY-MM-DD"),
            };
        });
        setEndDateData(dt);

        let closePeriods = details.payRollPeriod.payRollPeriodDetails?.filter((v) => v.periodProcess === payrollPeriodProcess.CLOSE).map((period) => {
            return {
                dateFrom: moment(period.dateFrom.split(" ")[0]).format("YYYY-MM-DD"),
            };
        });
        setClosePeriodsData(closePeriods);

        // if (details.payrollTaxDetails) {
        //   setEmployeesToPayItemsList(payroll.payrollTaxDetails);
        // }

        setLoading(false);
        setWindowLoading(false);
    };

    //Load data
    async function fetchPayItemData() {
        setLoading(true);
        payItemService()
            .getAll()
            .then((response) => {
                let payItemDataArray = [];
                response.data.forEach((item) => {
                    payItemDataArray.push({
                        value: item.id,
                        label: item.name,
                        code: item.code,
                        payItemName: item.name,
                        payItemType: item.payItemType.type,
                        payItemPeriod: item.payItemPeriod.name,
                        paymentType: item.paymentType.type,
                        activeStatus: item.active,
                    });
                });
                setPayItemData(payItemDataArray);
                setLoading(false);
            });
    }

    // Load data
    async function fetchPayItemTypeData() {
        payItemTypeService()
            .getAll()
            .then(({data}) => {
                var payItemTypeDataList = data.map((payItemType) => ({
                    value: payItemType.id,
                    label: payItemType.type
                }));
                setPayItemTypeData(payItemTypeDataList);
            });
    }

    // Load data
    async function fetchPayItemPeriodData() {
        setLoading(true);
        payItemPeriodService()
            .getAll()
            .then((response) => {
                let payItemPeriodDataArray = [];
                response.data.forEach((item) => {
                    payItemPeriodDataArray.push({value: item.id, label: item.name});
                });
                setPayItemPeriodData(payItemPeriodDataArray);
                setLoading(false);
            });
    }

    const fetchEmployees = () => {
        payrollProcessService()
            .getPayrollEmployees(payroll?.id)
            .then(({data: response}) => {
                response = response.map((emp) => ({
                    value: emp.id,
                    label: emp.empNo,
                    empName: emp.employeeName,
                    designation: emp.posCode,
                    isActive: emp.employeeStatus,
                }));
                setEmployeeData(response);
            });
    }

    //Fetch table data
    const fetchEmployeesPayItemsData = (payroll, itemData) => {
        setLoading(true);
        if (employeeData.length <= 0) {
            fetchEmployees();
        }

        let a = [];
        let b = [];
        let z = [];
        let y = [];
        payrollProcessService()
            .getEmployeesToPayItems(payroll.id)
            .then(({data}) => {

                z = data.employeesToPayItems?.find((v) => moment(v.startDate?.split("T")[0]).format("YYYY-MM-DD") === (moment(sPeriods).format("YYYY-MM-DD") ? moment(sPeriods).format("YYYY-MM-DD") : moment(dateFromPeriod).format("YYYY-MM-DD")))?.startDate?.split("T")[0];

                y = data.employeesToPayItems?.find((v) => moment(v.endDate?.split("T")[0]).format("YYYY-MM-DD") === (moment(ePeriods).format("YYYY-MM-DD") ? moment(ePeriods).format("YYYY-MM-DD") : moment(dateToPeriod).format("YYYY-MM-DD")))?.endDate?.split("T")[0];

                let f = moment(processPeriodList?.find((v) => v.sDate === (sPeriods ? sPeriods : (processPeriodList?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.label.split(" ")[0])))?.sDate).format("YYYY-MM-DD");
                let g = moment(processPeriodList?.find((v) => v.sDate === (sPeriods ? sPeriods : (processPeriodList?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.label.split(" ")[0])))?.eDate).format("YYYY-MM-DD");

                let p = moment(processPeriodList?.find((v) => v.eDate === (ePeriods ? ePeriods : (processPeriodList?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.label.split(" ")[0])))?.sDate).format("YYYY-MM-DD");
                let q = moment(processPeriodList?.find((v) => v.eDate === (ePeriods ? ePeriods : (processPeriodList?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.label.split(" ")[0])))?.eDate).format("YYYY-MM-DD");

                let h = moment(z).isBetween(f, g) || moment(z).isSame(f);
                let r = moment(y).isBetween(p, q) || moment(y).isSame(q);
                let s = true;

                if (h || r || s) {

                    if (selectedPayItemPeriod?.label === "Fixed") {

                        a = data.employeesToPayItems?.filter((v) => (moment(new Date(v.startDate)).format("YYYY-MM-DD")) <= (moment(new Date(sPeriods ? moment(sPeriods).format("YYYY-MM-DD") : moment(dateFromPeriod).format("YYYY-MM-DD"))).format("YYYY-MM-DD")));

                        b = a
                            ?.filter((v) => v.payrollPayItemId === (itemData?.value ?? payItem))
                            ?.map((employeesToPayItem) => ({
                                id: employeesToPayItem.id,
                                amount: employeesToPayItem.amount,
                                units: employeesToPayItem.units,
                                employerAmount: employeesToPayItem.employerAmount,
                                startDate: employeesToPayItem.startDate?.split("T")[0],
                                endDate: employeesToPayItem.endDate?.split("T")[0],
                                employee: employeesToPayItem.employee.empNo,
                                empName: employeesToPayItem.employee.employeeName,
                            }));

                        setEmployeesToPayItemsList(b);

                    } else {

                        a = data.employeesToPayItems?.filter((v) => (moment(v.startDate?.split("T")[0]).format("YYYY-MM-DD") === (sPeriods ? moment(sPeriods).format("YYYY-MM-DD") : moment(dateFromPeriod).format("YYYY-MM-DD"))) || (moment(v.endDate?.split("T")[0]).format("YYYY-MM-DD") === (ePeriods ? moment(ePeriods).format("YYYY-MM-DD") : moment(dateToPeriod).format("YYYY-MM-DD"))));

                        b = a?.filter((v) => v.payrollPayItemId === (itemData?.value ?? payItem))?.map((employeesToPayItem) => ({
                            id: employeesToPayItem.id,
                            amount: employeesToPayItem.amount,
                            units: employeesToPayItem.units,
                            employerAmount: employeesToPayItem.employerAmount,
                            startDate: employeesToPayItem.startDate?.split("T")[0],
                            endDate: employeesToPayItem.endDate?.split("T")[0],
                            employee: employeesToPayItem.employee.empNo,
                            empName: employeesToPayItem.employee.employeeName,
                        }));

                        setEmployeesToPayItemsList(b);
                        setLoading(false);
                    }


                } else {
                    setEmployeesToPayItemsList([]);

                }
                setLoading(false);


            });
    };

    const clearItems = () => {
        setAmount("");
        setUnits("");
        setEmployerAmount("");
    };

    const clearRowStyle = () => {
        setFilteredEmployees([]);
    };

    const setNewEmployees = (value) => {
        setFilteredEmployees(value.map((emp) => emp.label));
        window.setTimeout(clearRowStyle, 60000);
    };

    return (
        <>
            {isWindowLoading && (
                <div className="overlay">
                    <GullLoadable/>
                </div>
            )}
            {showModal && (
                <EmployeesToPayItemsModal
                    show={showModal}
                    employeeData={employeeData}
                    setShow={setShowModal}
                    fetchEmployeesToPayItemsFunc={fetchEmployeesPayItemsData}
                    employeesToPayItemsList={employeesToPayItemsList}
                    clearItemsFunc={clearItems}
                    newlyAddedEmployees={setNewEmployees}
                    payItem={payItem}
                    payrollId={payroll.id}
                    amount={amount}
                    units={units}
                    employerAmount={employerAmount}
                    dateFromPeriod={dateFromPeriod}
                    dateToPeriod={dateToPeriod}
                    payroll={payroll}
                    sPeriods={sPeriods}
                    ePeriods={ePeriods}
                    startDateData={startDateData}
                    closePeriodsData={closePeriodsData}
                    prossPeriods={prossPeriods}
                    setEmployee={setEmployee}
                    setEmployeeInDropdown={setEmployeeInDropdown}
                />
            )}
            <div className="row">
                <div className="col-md-7 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Dashboard", path: "/dashboard/v1/"},
                            {name: "Employees to Pay Items"},
                        ]}
                    ></Breadcrumb>
                </div>
                <div className="col-md-2">
                    <div className="mt-2 d-flex justify-content-start">
                        <NavLink to={"/pay-items"}>
                            <span className="capitalize text-muted">|&nbsp;Pay&nbsp;Items&nbsp;|</span>
                        </NavLink>
                    </div>
                </div>
                <div className="col-md-3 ">
                    <div className="mt-1 d-flex justify-content-end">
                        {/*<PayrollButton toList={"/payroll-assign-pay-items"} />*/}
                        <PayrollDropDown payrollOnChange={payrollOnChange} payrollProcessList={payrollProcessList}/>
                    </div>
                </div>
            </div>
            <div className="row mb-1">
                <div className="col-md-2">
                    <FormLabel>
                        {userLabels.find(
                                (label) => label.labelId === labels.payrollCode.toLowerCase()
                            )?.editedLabel ??
                            labelList.find(
                                (label) => label.labelId === labels.payrollCode.toLowerCase()
                            )?.label}
                    </FormLabel>
                    <input
                        type="text"
                        className="form-control"
                        value={code ?? ""}
                        onChange={(e) => setCode(e.target.value)}
                        readOnly={true}
                    />
                </div>

                <div className="col-md-2">
                    <FormLabel>
                        {userLabels.find(
                                (label) => label.labelId === labels.payrollName.toLowerCase()
                            )?.editedLabel ??
                            labelList.find(
                                (label) => label.labelId === labels.payrollName.toLowerCase()
                            )?.label}
                    </FormLabel>
                    <input
                        type="text"
                        className="form-control"
                        value={name ?? ""}
                        onChange={(e) => setName(e.target.value)}
                        readOnly={true}
                    />
                </div>

                <div className="col-md-2">
                    <FormLabel>
                        {userLabels.find(
                                (label) => label.labelId === labels.processPeriod.toLowerCase()
                            )?.editedLabel ??
                            labelList.find(
                                (label) => label.labelId === labels.processPeriod.toLowerCase()
                            )?.label}
                    </FormLabel>
                    <AutoCompleteDropDown
                        dropDownData={processPeriodList}
                        isFreeDropDown={true}
                        onChange={(e, selected) => {
                            setSPeriods(selected?.label.split(" ")[0]);
                            setEPeriods(selected?.label.split(" ")[2]);
                            setProssPeriods(selected?.label);
                            setPayItemType("");
                            setSelectedPayItemType(null);
                            setPayItemPeriod("");
                            setSelectedPayItemPeriod(null);
                            setPayItem("");
                            setAmount("");
                            setUnits("");
                            setEmployeesToPayItemsList([]);
                        }}
                        size={"small"}
                        label="Search"
                        defaultValue={prossPeriods?.length === 0 ? (processPeriodList?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.label) : prossPeriods}
                    />
                </div>

                <div className="col-md-2">
                    <FormLabel>
                        {userLabels.find(
                                (label) => label.labelId === labels.payItemType.toLowerCase()
                            )?.editedLabel ??
                            labelList.find(
                                (label) => label.labelId === labels.payItemType.toLowerCase()
                            )?.label}
                    </FormLabel>
                    <AutoCompleteDropDown
                        dropDownData={payItemTypeData}
                        isFreeDropDown={true}
                        onChange={(e, selected) => {
                            if (payItemPeriodData?.length <= 0 || payItemType === "") {
                                fetchPayItemPeriodData();
                            }
                            setPayItemType(selected?.value);
                            setSelectedPayItemType(selected);
                            setEmployeesToPayItemsList([]);
                            setPayItemPeriod("");
                            setSelectedPayItemPeriod(null);
                            setPayItem("");
                            setAmount("");
                            setUnits("");
                        }}
                        size={"small"}
                        label="Search"
                        defaultValue={
                            payItemTypeData?.find((v) => v.value === payItemType)?.label
                        }
                    />
                </div>

                <div className="col-md-2">
                    <FormLabel>
                        {userLabels.find(
                                (label) => label.labelId === labels.payItemPeriod.toLowerCase()
                            )?.editedLabel ??
                            labelList.find(
                                (label) => label.labelId === labels.payItemPeriod.toLowerCase()
                            )?.label}
                    </FormLabel>
                    <AutoCompleteDropDown
                        isFreeDropDown={true}
                        dropDownData={payItemPeriodData}
                        disabled={payItemType === ""}
                        onChange={(e, selected) => {
                            fetchPayItemData();
                            setPayItemPeriod(selected?.value);
                            setSelectedPayItemPeriod(selected);
                            setEmployeesToPayItemsList([]);
                            setPayItem("");
                            setAmount("");
                            setUnits("");
                        }}
                        size={"small"}
                        label="Search"
                        defaultValue={
                            payItemPeriodData?.find((v) => v.value === payItemPeriod)?.label
                        }
                    />
                </div>

                <div className="col-md-2">
                    <FormLabel>
                        {userLabels.find(
                                (label) => label.labelId === labels.payItem.toLowerCase()
                            )?.editedLabel ??
                            labelList.find(
                                (label) => label.labelId === labels.payItem.toLowerCase()
                            )?.label}
                    </FormLabel>
                    <AutoCompleteDropDown
                        dropDownData={filteredPayItem}
                        disabled={payItemPeriod === ""}
                        isFreeDropDown={true}
                        onChange={(e, selected) => {
                            setPayItem(selected?.value);
                            fetchEmployeesPayItemsData(payroll, selected);
                            setAmount("");
                            setUnits("");
                        }}
                        size={"small"}
                        label="Search"
                        defaultValue={
                            filteredPayItem?.find((v) => v.value === payItem)?.label
                        }
                    />
                </div>
            </div>

            <br></br>

            <div className="row mb-1">
                <div className="col-md-2">
                    <FormLabel>
                        {userLabels.find(
                                (label) => label.labelId === labels.amount.toLowerCase()
                            )?.editedLabel ??
                            labelList.find(
                                (label) => label.labelId === labels.amount.toLowerCase()
                            )?.label}
                    </FormLabel>
                    <input
                        type="number"
                        className="form-control"
                        value={amount ?? ""}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>

                <div className="col-md-2">
                    <FormLabel>
                        {userLabels.find(
                                (label) => label.labelId === labels.units.toLowerCase()
                            )?.editedLabel ??
                            labelList.find(
                                (label) => label.labelId === labels.units.toLowerCase()
                            )?.label}
                    </FormLabel>
                    <input
                        type="number"
                        className="form-control"
                        value={units ?? ""}
                        onChange={(e) => setUnits(e.target.value)}
                    />
                </div>

                <div className="col-md-2 mt-4 d-flex">
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={payItem === "" || (amount === "" && units === "") || (moment(closePeriodsData?.find((v) => v.dateFrom === moment(prossPeriods.split(" ")[0]).format("YYYY-MM-DD"))?.dateFrom).format("YYYY-MM-DD") === moment(prossPeriods.split(" ")[0]).format("YYYY-MM-DD") === true)}
                        onClick={() => setShowModal(true)}
                    >
                        Search Employee
                    </Button>
                </div>
            </div>

            <br></br>

            <div className="row">
                <EmployeesToPayItemsList
                    fetchEmployeesToPayItemsFunc={fetchEmployeesPayItemsData}
                    setEmployeesToPayItemsList={setEmployeesToPayItemsList}
                    employeesToPayItemsList={employeesToPayItemsList}
                    payItemsData={payItemsData}
                    employeeData={employeeData}
                    payItem={payItem}
                    dateFromPeriod={dateFromPeriod}
                    dateToPeriod={dateToPeriod}
                    isLoading={isLoading}
                    setLoading={setLoading}
                    newlyAddedEmployeeList={filteredEmployees}
                    payroll={payroll}
                    startDateData={startDateData}
                    endDateData={endDateData}
                    prossPeriods={prossPeriods}
                    processPeriodList={processPeriodList}
                    sPeriods={sPeriods}
                    ePeriods={ePeriods}
                    closePeriodsData={closePeriodsData}
                    employee={employee}
                    setEmployee={setEmployee}
                    employeeInDropdown={employeeInDropdown}
                    setEmployeeInDropdown={setEmployeeInDropdown}
                />
            </div>

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
})(EmployeesToPayItems);
