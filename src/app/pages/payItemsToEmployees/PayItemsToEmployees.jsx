import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import payrollProcessService from "../../api/payrollProcessServices/payrollProcessService";
import {connect} from "react-redux";
import {Button, FormLabel} from "react-bootstrap";
import PayItemsToEmployeesFixedList from "./PayItemsToEmployeesFixedList";
import {setPayrollTaxDetails} from "../../redux/actions/PayrollTaxDetailsActions";
import {labels, payrollPeriodProcess, requestPath} from "./constant";
import PayItemsToEmployeesModal from "./PayItemsToEmployeesModal";
import AutoCompleteDropDown from "../../components/AutoCompleteDropDown";
import localStorageService from "../../services/localStorageService";
import payItemService from "app/api/payItemServices/payItemService";
import moment from "moment";
import GullLoadable from "../../../@gull/components/GullLoadable/GullLoadable";
import {NotificationManager} from "react-notifications";
import {NavLink} from "react-router-dom";
import PayrollDropDown from "../../components/PayrollDropDown";

const EmployeesToPayItems = () => {
    const [labelList, setLabelList] = useState([]);
    const [userLabels, setUserLabels] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [allPayItemData, setAllPayItemData] = useState([]);
    const [payrollProcessList, setPayrollProcessList] = useState([]);
    const [payItemsData, setPayItemsData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [isWindowLoading, setWindowLoading] = useState(true);

    const [payroll, setPayroll] = useState(null);
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [employeeData, setEmployeeData] = useState([]);

    const [dateFromPeriod, setDateFromPeriod] = useState("");
    const [dateToPeriod, setPDateToPeriod] = useState("");

    const [startDateData, setStartDateData] = useState([]);
    const [endDateData, setEndDateData] = useState([]);
    const [processPeriodData, setProcessPeriodData] = useState([]);

    const [closePeriodsData, setClosePeriodsData] = useState([]);
    const [employeeName, setEmployeeName] = useState("");
    const [prossPeriods, setProssPeriods] = useState("");
    const [sPeriods, setSPeriods] = useState("");
    const [ePeriods, setEPeriods] = useState("");
    const [showModal, setShowModal] = useState(false);

    const [fixed, setFixed] = useState([]);
    const [variable, setVariable] = useState([]);
    const [payItemsToEmployeesData, setPayItemsToEmployeesData] = useState([]);
    const [isPayrollChange, setPayrollChange] = useState(true);

    useEffect(() => {
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        window.scrollTo(0, 0);
        setLabelList(
            localStorageService
                .getItem("label_list")
                ?.filter(
                    (list) => list.permissionPage.path === window.location.pathname
                )
        );
        setUserLabels(localStorageService.getItem("auth_user")?.labels);
        fetchPayrollData();
    }, []);

    useEffect(() => {
        if (allPayItemData?.length === 0 && selectedEmployee !== "") {
            fetchPayItemData();
        }
    }, [selectedEmployee]);

    useEffect(() => {
        if (payItemsData?.length !== 0 && selectedEmployee !== "" && payItemsToEmployeesData.length !== 0) {
            filterPayItemsToEmployeesData(payItemsToEmployeesData, selectedEmployee);
        }
    }, [selectedEmployee, payItemsData, payItemsToEmployeesData]);

    useEffect(() => {
        if (isPayrollChange && selectedEmployee !== "") {
            setPayrollChange(false);
            fetchPayItemsToEmployeesData(payroll, selectedEmployee);

            setDateFromPeriod(
                payroll?.payRollPeriod?.payRollPeriodDetails
                    ?.find((v) => v.periodProcess !== payrollPeriodProcess.CLOSE)
                    ?.dateFrom.split(" ")[0]
            );

            setPDateToPeriod(
                payroll?.payRollPeriod?.payRollPeriodDetails
                    ?.find((v) => v.periodProcess !== payrollPeriodProcess.CLOSE)
                    ?.dateTo.split(" ")[0]
            );

            let df = payroll?.payRollPeriod.payRollPeriodDetails.map((period) => {
                return {
                    value: period.periodNo,
                    periodNo: period.periodProcess,
                    label: moment(period.dateFrom.split(" ")[0]).format("YYYY-MM-DD"),
                    startDate: moment(period.dateFrom.split(" ")[0]).format("YYYY-MM-DD"),
                    endDate: moment(period.dateTo.split(" ")[0]).format("YYYY-MM-DD"),
                };
            });
            setStartDateData(df);

            let dt = payroll?.payRollPeriod.payRollPeriodDetails.map((period) => {
                return {
                    value: period.periodNo,
                    label: moment(period.dateTo.split(" ")[0]).format("YYYY-MM-DD"),
                };
            });
            setEndDateData(dt);

            let closePeriods = payroll?.payRollPeriod.payRollPeriodDetails?.filter((v) => v.periodProcess === payrollPeriodProcess.CLOSE).map((period) => {
                return {
                    dateFrom: moment(period.dateFrom.split(" ")[0]).format("YYYY-MM-DD"),
                };
            });
            setClosePeriodsData(closePeriods);
        }
    }, [selectedEmployee]);

    useEffect(() => {
        setPayrollChange(true);
    }, [payroll]);

    useEffect(() => {
        if (payroll && allPayItemData?.length !== 0) {
            setPayItemDetails(payroll);
        }
    }, [allPayItemData]);

    function fetchPayrollData() {
        const storedPayrollId = localStorageService.getItem("selected_payroll")?.value ?? localStorageService.getItem("auth_user")?.payrollDefinitionId;
        payrollProcessService()
            .getNames()
            .then(({data: payrollList}) => {
                payrollList = payrollList.map((payrollProcess) => ({
                    value: payrollProcess.id,
                    label: `${payrollProcess.code} - ${payrollProcess.name}`,
                }));
                setPayrollProcessList(payrollList);

                if (!storedPayrollId) {
                    payrollProcessService()
                        .findOne(payrollList[0]?.value, window.location.pathname)
                        .then(({data: details}) => {
                            setPayrollDetails(details);
                            setWindowLoading(false);
                            setPayroll(details);
                        }).catch(error => {
                        if (error.status === 404) {
                            NotificationManager.error("There is no active employees for selected payroll", "Error")
                            setWindowLoading(false);
                            return {};
                        }
                    });
                }
            });

        if (storedPayrollId) {
            payrollProcessService()
                .findOne(storedPayrollId, window.location.pathname)
                .then(({data: details}) => {
                    setPayrollDetails(details);
                    setWindowLoading(false);
                    setPayroll(details);
                }).catch(error => {
                if (error.status === 404) {
                    NotificationManager.error("There is no active employees for selected payroll", "Error")
                    setWindowLoading(false);
                    return {};
                }
            });
        }
    }

    const setPayrollDetails = (details) => {
        setCode(details?.code);
        setName(details?.name);

        let payrollEmployeeData = details.selectedEmployeesPageHeader.map((emp) => {
            return {
                value: emp.id,
                label: emp.empNo,
                empName: emp.employeeName,
                designation: emp.empPosCode,
                isActive: emp.employeeStatus,
            };
        });

        setEmployeeData(payrollEmployeeData);

        let pp = details.payRollPeriod.payRollPeriodDetails.map((period) => {
            return {
                value: period.periodNo,
                periodNo: period.periodProcess,
                sDate: moment(period.dateFrom.split(" ")[0]).format("YYYY-MM-DD"),
                eDate: moment(period.dateTo.split(" ")[0]).format("YYYY-MM-DD"),
                //label: `${period.dateFrom.split(" ")[0]} - ${period.dateTo.split(" ")[0]}`,
                label: `${moment(period.dateFrom.split(" ")[0]).format("YYYY-MM-DD")} - ${moment(period.dateTo.split(" ")[0]).format("YYYY-MM-DD")}`,
            };
        });
        setProcessPeriodData(pp);
    }

    //Load pay item data
    function fetchPayItemData() {
        payItemService()
            .getAll()
            .then(({data: response}) => {
                response = response.map((item) => ({
                    value: item.id,
                    label: item.code,
                    name: item.name,
                    code: item.code,
                    payItemType: item.payItemType.type,
                    payItemPeriod: item.payItemPeriod.name,
                    paymentType: item.paymentType.type,
                    activeStatus: item.active,
                }));

                setAllPayItemData(response);
            });
    }

    const setPayItemDetails = (details) => {
        const payrollPayItems = details.payrollPayItemPageHeader.payrollPayItems
            .filter((v) => v.active === true)
            .map((payrollPayItem) => {
                const payItem = allPayItemData.find(
                    (v) => v.value === payrollPayItem.payItemId
                );

                return {
                    value: payrollPayItem.id,
                    label: payItem?.label,
                    name: payItem?.name,
                    code: payItem?.code,
                    payItemType: allPayItemData?.find(
                        (v) => v.value === payrollPayItem.payItemId
                    )?.payItemType,
                    payItemPeriod: allPayItemData?.find(
                        (v) => v.value === payrollPayItem.payItemId
                    )?.payItemPeriod,
                    paymentType: allPayItemData?.find(
                        (v) => v.value === payrollPayItem.payItemId
                    )?.paymentType,
                };
            });

        setPayItemsData(payrollPayItems);
    };

    //Fetch table data
    const fetchPayItemsToEmployeesData = (details, empData) => {
        setLoading(true);
        payrollProcessService()
            .getEmployeesToPayItems(details.id)
            .then(({data}) => {
                setPayItemsToEmployeesData(data);
                setLoading(false);
            });
    };

    const filterPayItemsToEmployeesData = (data, empData) => {
        let a = [];
        let b = [];
        let z = [];
        let y = [];
        let m = [];
        let n = [];
        let k = [];

        z = data.employeesToPayItems?.find((v) => moment(v.startDate?.split("T")[0]).format("YYYY-MM-DD") === (moment(sPeriods).format("YYYY-MM-DD") ? moment(sPeriods).format("YYYY-MM-DD") : moment(dateFromPeriod).format("YYYY-MM-DD")))?.startDate?.split("T")[0];

        y = data.employeesToPayItems?.find((v) => moment(v.endDate?.split("T")[0]).format("YYYY-MM-DD") === (moment(ePeriods).format("YYYY-MM-DD") ? moment(ePeriods).format("YYYY-MM-DD") : moment(dateToPeriod).format("YYYY-MM-DD")))?.endDate?.split("T")[0];

        let f = moment(processPeriodData?.find((v) => v.sDate === (sPeriods ? sPeriods : processPeriodData?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.label.split(" ")[0]))?.sDate).format("YYYY-MM-DD");
        let g = moment(processPeriodData?.find((v) => v.sDate === (sPeriods ? sPeriods : processPeriodData?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.label.split(" ")[0]))?.eDate).format("YYYY-MM-DD");

        let j = moment(processPeriodData?.find((v) => v.eDate === (ePeriods ? ePeriods : processPeriodData?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.label.split(" ")[0]))?.sDate).format("YYYY-MM-DD");
        let q = moment(processPeriodData?.find((v) => v.eDate === (ePeriods ? ePeriods : processPeriodData?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.label.split(" ")[0]))?.eDate).format("YYYY-MM-DD");

        let h = moment(z).isBetween(f, g) || moment(z).isSame(f);
        let r = moment(y).isBetween(j, q) || moment(y).isSame(q);
        let s = true;

        if (h || r || s) {
            m = data.employeesToPayItems?.filter((v) => (moment(new Date(v.startDate)).format("YYYY-MM-DD")) <= (moment(new Date(sPeriods ? moment(sPeriods).format("YYYY-MM-DD") : moment(dateFromPeriod).format("YYYY-MM-DD"))).format("YYYY-MM-DD")));
            n = m?.filter((v) => v.employeeId === (empData?.value ?? selectedEmployee?.value));

            a = data.employeesToPayItems?.filter((v) => (moment(v.startDate?.split("T")[0]).format("YYYY-MM-DD") === (sPeriods ? moment(sPeriods).format("YYYY-MM-DD") : moment(dateFromPeriod).format("YYYY-MM-DD"))) || (moment(v.endDate?.split("T")[0]).format("YYYY-MM-DD") === (ePeriods ? moment(ePeriods).format("YYYY-MM-DD") : moment(dateToPeriod).format("YYYY-MM-DD"))));
            b = a?.filter((v) => v.employeeId === (empData?.value ?? selectedEmployee?.value));

            let fpay = payItemsData?.filter((v, index) => {
                let pays = n.find((d) => d.payrollPayItemId === v.value);
                return pays;
            });

            let vpay = payItemsData?.filter((v, index) => {
                let pays = b.find((d) => d.payrollPayItemId === v.value);
                return pays;
            });

            if (fpay || vpay) {
                let fixed = [];
                let variable = [];
                let fixedItems = fpay
                    .filter((v) => v.payItemPeriod === "Fixed")
                    .forEach((p) => {
                        fixed.push(
                            ...n
                                .filter((f) => f.payrollPayItemId === p.value)
                                .map((employeesToPayItem) => {
                                    return {
                                        id: employeesToPayItem.id,
                                        amount: employeesToPayItem.amount ?? "",
                                        units: employeesToPayItem.units ?? "",
                                        startDate: employeesToPayItem.startDate?.split("T")[0],
                                        endDate: employeesToPayItem.endDate?.split("T")[0],
                                        payItem: payItemsData?.find(
                                            (v) => v.value === employeesToPayItem.payrollPayItemId
                                        )?.code,
                                        payItemName: payItemsData?.find(
                                            (v) => v.value === employeesToPayItem.payrollPayItemId
                                        )?.name,
                                    };
                                })
                        );
                    });
                let variableItems = vpay
                    .filter((v) => v.payItemPeriod === "Variable")
                    .forEach((p) => {
                        variable.push(
                            ...b
                                .filter((f) => f.payrollPayItemId === p.value)
                                .map((employeesToPayItem) => {
                                    return {
                                        id: employeesToPayItem.id,
                                        amount: employeesToPayItem.amount ?? "",
                                        units: employeesToPayItem.units ?? "",
                                        startDate: employeesToPayItem.startDate?.split("T")[0],
                                        endDate: employeesToPayItem.endDate?.split("T")[0],
                                        payItem: payItemsData?.find(
                                            (v) => v.value === employeesToPayItem.payrollPayItemId
                                        )?.code,
                                        payItemName: payItemsData?.find(
                                            (v) => v.value === employeesToPayItem.payrollPayItemId
                                        )?.name,
                                    };
                                })
                        );
                    });
                setFixed(fixed);
                setVariable(variable);
            }
        } else {
            setFixed([]);
            setVariable([]);
        }
        setLoading(false);
    };

    const payrollOnChange = async (e, selected) => {
        if (!selected) return;
        setWindowLoading(true);
        const {data} = await payrollProcessService()
            .findOne(
                selected.value,
                requestPath
            ).catch(error => {
                if (error.status === 404) {
                    NotificationManager.error("There is no active employees for selected payroll", "Error")
                    setWindowLoading(false);
                    return {};
                }
            });
        if (!data) return;
        localStorageService.setItem("selected_payroll", selected);
        setPayroll(data);
        setEmployeeName("");
        setSelectedEmployee("");
        setFixed([]);
        setVariable([]);

        let pp = data.payRollPeriod.payRollPeriodDetails.map((period) => {
            return {
                value: period.periodNo,
                periodNo: period.periodProcess,
                label: `${period.dateFrom.split(" ")[0]} - ${
                    period.dateTo.split(" ")[0]
                }`,
            };
        });
        setProssPeriods((pp?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.label));
        setSPeriods(pp?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.label.split(" ")[0]);
        setEPeriods(pp?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.label.split(" ")[2]);

        window.scrollTo(0, 0);
        setPayrollDetails(data);
        setPayItemDetails(data);
        setWindowLoading(false);
    };

    const setEmpName = (emp) => {
        const data = employeeData?.find((v) => v.value === emp)?.empName;
        setEmployeeName(data);
    };

    return (
        <>
            {isWindowLoading && (
                <div className="overlay">
                    <GullLoadable/>
                </div>
            )}
            {showModal && (
                <PayItemsToEmployeesModal
                    show={showModal}
                    employeeData={employeeData}
                    setShow={setShowModal}
                    payrollId={payroll.id}
                    setEmployee={setSelectedEmployee}
                    setEmployeeName={setEmployeeName}
                />
            )}

            <div className="row">
                <div className="col-md-7 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Dashboard", path: "/dashboard/v1/"},
                            {name: "Pay Items To Employees"},
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
                <div className="col-md-3">
                    <div className="mt-1 d-flex justify-content-end">
                        <PayrollDropDown payrollOnChange={payrollOnChange} payrollProcessList={payrollProcessList}/>
                    </div>
                </div>
            </div>
            <div className="row mb-1 ">
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
                        dropDownData={processPeriodData}
                        isFreeDropDown={true}
                        onChange={(e, selected) => {
                            setSPeriods(selected?.label.split(" ")[0]);
                            setEPeriods(selected?.label.split(" ")[2]);
                            setProssPeriods(selected?.label);
                            setEmployeeName("");
                            setSelectedEmployee("");
                            setFixed([]);
                            setVariable([]);
                        }}
                        size={"small"}
                        label="Search"
                        defaultValue={prossPeriods?.length === 0 ? (processPeriodData?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.label) : prossPeriods}
                    />
                </div>

                <div className="col-md-2">
                    <FormLabel>
                        {userLabels.find(
                                (label) => label.labelId === labels.employeeId.toLowerCase()
                            )?.editedLabel ??
                            labelList.find(
                                (label) => label.labelId === labels.employeeId.toLowerCase()
                            )?.label}
                    </FormLabel>
                    <AutoCompleteDropDown
                        isFreeDropDown={true}
                        dropDownData={employeeData}
                        onChange={(e, selected) => {
                            setSelectedEmployee(selected);
                            setEmpName(selected?.value);
                        }}
                        size={"small"}
                        label="Search"
                        defaultValue={selectedEmployee}
                    />
                </div>

                <div className="col-md-2">
                    <FormLabel>
                        {userLabels.find(
                                (label) => label.labelId === labels.employeeName.toLowerCase()
                            )?.editedLabel ??
                            labelList.find(
                                (label) => label.labelId === labels.employeeName.toLowerCase()
                            )?.label}
                    </FormLabel>
                    <input
                        type="text"
                        className="form-control"
                        value={employeeName ?? ""}
                        onChange={(e) => setEmployeeName(e.target.value)}
                        readOnly={true}
                    />
                </div>

                <div className="col-md-2 mt-4 d-flex">
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={() => setShowModal(true)}
                    >
                        Search Employee
                    </Button>
                </div>
            </div>

            <br></br>
            <br></br>

            <div className="row">
                <PayItemsToEmployeesFixedList
                    fetchPayItemsToEmployeesFunc={fetchPayItemsToEmployeesData}
                    payItemsData={payItemsData}
                    employee={selectedEmployee?.value}
                    employees={selectedEmployee}
                    isLoading={isLoading}
                    setLoading={setLoading}
                    payroll={payroll}
                    fixed={fixed}
                    variable={variable}
                    startDateData={startDateData}
                    endDateData={endDateData}
                    prossPeriods={prossPeriods}
                    sPeriods={sPeriods}
                    setSPeriods={setSPeriods}
                    setEPeriods={setEPeriods}
                    ePeriods={ePeriods}
                    closePeriodsData={closePeriodsData}
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
