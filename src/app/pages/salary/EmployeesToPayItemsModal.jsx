import React, {Fragment, useEffect, useState} from "react";
import {Button, FormLabel, Modal} from "react-bootstrap";
import EmployeesList from "./EmployeesList";
import PayrollButton from "app/components/PayrollButton";
import salaryService from "app/api/salaryServices/salaryService";
import {NotificationManager} from "react-notifications";
import AutoCompleteDropDown from "../../components/AutoCompleteDropDown";
import moment from "moment";
import "moment-precise-range-plugin";
import {payrollPeriodProcess, salaryStatus,} from "./constant";

const EmployeesToPayItemsModal = ({
                                      show,
                                      setShow,
                                      employeeData,
                                      fetchSalaryFunc,
                                      salaryList,
                                      clearItemsFunc,
                                      newlyAddedEmployees,
                                      payItem,
                                      payrollId,
                                      isPercentage,
                                      value,
                                      effectiveDate,
                                      dateFromPeriod,
                                      dateToPeriod,
                                      payroll,
                                      sPeriods,
                                      ePeriods,
                                      startDateData,
                                      closePeriodsData,
                                      prossPeriods,
                                      ...props
                                  }) => {
    const [employeesList, setEmployeeList] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [employeeType, setEmployeeType] = useState("");
    const [keyword, setKeyword] = useState("");
    const [templateData, setTemplateData] = useState({});

    const handleClose = () => {
        setShow(false);
        clearItemsFunc();
    };

    useEffect(() => {
        // Clear all notifications
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
    }, []);

    // Fill table
    const fetchEmployees = async () => {
        let employeeArray = employeeData;
        if (salaryList?.length > 0) {
            let addedIdList = salaryList.map((emp) => emp.employee);
            employeeArray = employeeArray.filter(
                (emp) => !addedIdList.includes(emp.label)
            );
        }
        if (keyword == "") {
            setEmployeeList(employeeArray);
            return;
        }
        switch (employeeType?.value) {
            case "empNo":
                employeeArray = employeeArray.filter((emp) =>
                    emp.label?.toLowerCase().includes(keyword)
                );
                setEmployeeList(employeeArray);
                break;
            case "name":
                employeeArray = employeeArray.filter((emp) =>
                    emp.empName?.toLowerCase().includes(keyword)
                );
                setEmployeeList(employeeArray);
                break;
            case "designation":
                employeeArray = employeeArray.filter((emp) =>
                    emp.designation?.toLowerCase().includes(keyword)
                );
                setEmployeeList(employeeArray);
                break;
            case "status":
                employeeArray = employeeArray.filter((emp) =>
                    emp.isActive?.toLowerCase().includes(keyword)
                );
                setEmployeeList(employeeArray);
                break;
            default:
                setEmployeeList(employeeArray);
                break;
        }
    };

    const checkProcessStatus = () => {

        let status = moment(closePeriodsData?.find((v) => v.dateFrom === moment(prossPeriods.split(" ")[0]).format("YYYY-MM-DD"))?.dateFrom).format("YYYY-MM-DD") === moment(prossPeriods.split(" ")[0]).format("YYYY-MM-DD")

        if (status === false) {
            addRows();
        } else {
            NotificationManager.error("This payroll period is already closed..", "Error");
        }

    };

    const addRows = () => {
        new Promise((resolve, reject) => {

            let x = moment(startDateData?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.startDate).format("YYYY-MM-DD");
            let period = payroll?.payRollPeriod?.payRollPeriodDetails?.find((v) => (moment(v.dateFrom.split(" ")[0]).format("YYYY-MM-DD")) === (moment(sPeriods ? sPeriods : x).format("YYYY-MM-DD")))?.id;
            let employees = filteredEmployees.map((employee) => ({
                employeeId: employee.value,
            }));

            if (isPercentage === true) {

                let monthDifference = 0;
                let dayDifference = 0;
                let months = 0;
                let days = 0;

                if ((moment(effectiveDate).isBetween((sPeriods ? sPeriods : dateFromPeriod), (ePeriods ? ePeriods : dateToPeriod))) || (moment(effectiveDate).isSame((sPeriods ? sPeriods : dateFromPeriod))) || (moment(effectiveDate).isSame((ePeriods ? ePeriods : dateToPeriod)))) {
                    monthDifference = 0;
                    dayDifference = 0;
                    months = 0;
                    days = 0;
                } else {
                    //monthDifference = Math.round(moment(new Date(x)).diff(new Date(effectiveDate ? effectiveDate : x), "months", true)).toFixed(2);
                    //monthDifference  = moment.preciseDiff((moment(x).format("YYYY-MM-DD")),(moment(effectiveDate ? effectiveDate : x).format("YYYY-MM-DD")), true);
                    //monthDifference =  moment(new Date(x)).diff(new Date(effectiveDate ? effectiveDate : x), "months", true).toFixed(2);
                    //months = monthDifference.months;
                    //days = monthDifference.days;

                    let a = moment(x).date();
                    let b = moment(effectiveDate ? effectiveDate : x).add(1, "month").set("date", a).format("YYYY-MM-DD");
                    monthDifference = moment.preciseDiff((moment(x).format("YYYY-MM-DD")), (moment(effectiveDate ? effectiveDate : x).format("YYYY-MM-DD")), true);
                    dayDifference = moment.preciseDiff((moment(effectiveDate ? effectiveDate : x).format("YYYY-MM-DD")), (moment(b).format("YYYY-MM-DD")), true);

                    months = monthDifference.months;
                    days = dayDifference.days;
                }

                // let oldAmount = employeeData?.find((v) => v.value === (employees.find((p)=>p.employeeId===v.value)?.employeeId))?.oldValue;
                // let percentageValue = (oldAmount * value) / 100;
                // let arrearsMonth = ((percentageValue) * (months)).toFixed(2);
                // let arrearsDays = (((percentageValue) * (days))/30).toFixed(2);
                // let arrearsValue = (Number(arrearsMonth) + Number(arrearsDays)).toFixed(2);
                // let newAmount = (Number(percentageValue) + Number(oldAmount)).toFixed(2);

                let daysInMonth = moment((effectiveDate ? effectiveDate : x), "YYYY-MM").daysInMonth();

                //Obj Create
                const salaryList = filteredEmployees.map((employee) => ({
                    employeeId: employee.value,
                    payrollPayItemId: payItem,
                    payrollDefinitionId: payrollId,
                    payRollPeriodDetailsId: period,
                    isPercentage: isPercentage ?? false,
                    value: value ?? 0,
                    arrearsAmount: (Number(((((employee.oldValue) * value) / 100) * (months)).toFixed(2)) + Number((((((employee.oldValue) * value) / 100) * (days)) / (daysInMonth)).toFixed(2))).toFixed(2) ?? 0,
                    oldValue: (employee.oldValue) ?? 0,
                    newValue: (Number(((employee.oldValue) * value) / 100) + Number((employee.oldValue))).toFixed(2) ?? 0,
                    effectiveDate: effectiveDate ? effectiveDate : (sPeriods ? sPeriods : x),
                    salaryStatus: salaryStatus.APPLICATION
                }));

                if (salaryList?.length == 0) {
                    reject();
                    return;
                }
                newlyAddedEmployees(filteredEmployees);

                if (isExists()) {
                    reject();
                    return;
                }

                salaryService()
                    .createSalaryList(salaryList)
                    .then((response) => {
                        NotificationManager.success(
                            salaryList?.length + " records was successfully created",
                            "Success"
                        );

                        //Reload list
                        fetchSalaryFunc(payroll);
                        clearItemsFunc();
                        handleClose();
                        resolve();
                    })
                    .catch((error) => {
                        console.error(error);
                        if (error.statusCode === 409) {
                            NotificationManager.error(error.message, "Error");
                        }
                        reject();
                    });


            } else {

                let monthDifference = 0;
                let dayDifference = 0;
                let months = 0;
                let days = 0;

                if ((moment(effectiveDate).isBetween((sPeriods ? sPeriods : dateFromPeriod), (ePeriods ? ePeriods : dateToPeriod))) || (moment(effectiveDate).isSame((sPeriods ? sPeriods : dateFromPeriod))) || (moment(effectiveDate).isSame((ePeriods ? ePeriods : dateToPeriod)))) {
                    monthDifference = 0;
                    dayDifference = 0;
                    months = 0;
                    days = 0;
                } else {
                    //monthDifference = Math.round(moment(new Date(x)).diff(new Date(effectiveDate ? effectiveDate : x), "months", true)).toFixed(2);
                    //monthDifference  = moment.preciseDiff((moment(x).format("YYYY-MM-DD")),(moment(effectiveDate ? effectiveDate : x).format("YYYY-MM-DD")), true);
                    //monthDifference =  moment(new Date(x)).diff(new Date(effectiveDate ? effectiveDate : x), "months", true).toFixed(2);
                    //months = monthDifference.months;
                    //days = monthDifference.days;

                    let a = moment(x).date();
                    let b = moment(effectiveDate ? effectiveDate : x).add(1, "month").set("date", a).format("YYYY-MM-DD");
                    monthDifference = moment.preciseDiff((moment(x).format("YYYY-MM-DD")), (moment(effectiveDate ? effectiveDate : x).format("YYYY-MM-DD")), true);
                    dayDifference = moment.preciseDiff((moment(effectiveDate ? effectiveDate : x).format("YYYY-MM-DD")), (moment(b).format("YYYY-MM-DD")), true);

                    months = monthDifference.months;
                    days = dayDifference.days;

                }

                // let oldAmount = employeeData?.find((v) => v.value === (employees.find((p)=>p.employeeId===v.value)?.employeeId))?.oldValue;
                // let arrearsMonth = ((value) * (months)).toFixed(2);
                // let arrearsDays = (((value) * (days))/30).toFixed(2);
                // let arrearsValue = (Number(arrearsMonth) + Number(arrearsDays)).toFixed(2);
                // let newAmount = (Number(value) + Number(oldAmount)).toFixed(2);

                let daysInMonth = moment((effectiveDate ? effectiveDate : x), "YYYY-MM").daysInMonth();

                //Obj Create
                const salaryList = filteredEmployees.map((employee) => ({
                    employeeId: employee.value,
                    payrollPayItemId: payItem,
                    payrollDefinitionId: payrollId,
                    payRollPeriodDetailsId: period,
                    isPercentage: isPercentage ?? false,
                    value: value ?? 0,
                    arrearsAmount: (Number(((value) * (months)).toFixed(2)) + Number((((value) * (days)) / (daysInMonth)).toFixed(2))).toFixed(2) ?? 0,
                    oldValue: (employee.oldValue) ?? 0,
                    newValue: (Number(value) + Number(employee.oldValue)).toFixed(2) ?? 0,
                    effectiveDate: effectiveDate ? effectiveDate : (sPeriods ? sPeriods : x),
                    salaryStatus: salaryStatus.APPLICATION
                }));

                if (salaryList?.length == 0) {
                    reject();
                    return;
                }
                newlyAddedEmployees(filteredEmployees);

                if (isExists()) {
                    reject();
                    return;
                }

                salaryService()
                    .createSalaryList(salaryList)
                    .then((response) => {
                        NotificationManager.success(
                            salaryList?.length + " records was successfully created",
                            "Success"
                        );

                        //Reload list
                        fetchSalaryFunc(payroll);
                        clearItemsFunc();
                        handleClose();
                        resolve();
                    })
                    .catch((error) => {
                        console.error(error);
                        if (error.statusCode === 409) {
                            NotificationManager.error(error.message, "Error");
                        }
                        reject();
                    });
            }
        });
    };

    const isExists = () => {

        const x = employeeData.find((b) => b.value === (filteredEmployees.find((v) => v.value === b.value)?.value))?.label;
        const existEmployees = salaryList.find((detail) => detail.employee === x)?.employee;

        const y = startDateData?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.endDate;
        const effDateCheck = new Date(effectiveDate) > new Date(y);

        const z = employeeData.find((b) => b.value === (filteredEmployees.find((v) => v.value === b.value)?.value))?.employmentDate;
        const regDateCheck = new Date(effectiveDate) < new Date(z);

        if (existEmployees) {
            NotificationManager.error("This Employee was already assigned", "Error");
            return true;
        }

        if (effDateCheck) {
            NotificationManager.error("This effective date is out of range.", "Error");
            return true;
        }
        if (regDateCheck) {
            NotificationManager.error("This effective date is after the employee's registered date.", "Error");
            return true;
        }
        return false;
    };


    const getSelectedRows = (rows) => {
        setFilteredEmployees(rows);
    };

    return (
        <Fragment>
            <Modal size="lg" show={show} onHide={handleClose} {...props}>
                <Modal.Header closeButton>
                    <Modal.Title>Search Employees</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-5">
                            <FormLabel>Search Criteria</FormLabel>
                            <AutoCompleteDropDown
                                dropDownData={[
                                    {value: "empNo", label: "Employee Number"},
                                    {value: "name", label: "Name"},
                                    {value: "designation", label: "Designation"},
                                    {value: "status", label: "Status"},
                                ]}
                                onChange={(e, selected) => {
                                    setEmployeeType(selected);
                                }}
                                label="Select"
                                defaultValue={employeeType}
                            />
                        </div>

                        <div className="col-5">
                            <FormLabel>Keyword</FormLabel>
                            <input
                                className="form-control"
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value.toLowerCase())}
                            ></input>
                        </div>

                        <div className="mt-3" style={{width: "75px"}}>
                            <PayrollButton
                                onClickSearch
                                onClick={fetchEmployees}
                            ></PayrollButton>
                        </div>
                    </div>

                    <br></br>

                    <div className="row mx-2">
                        <EmployeesList
                            selectedRows={getSelectedRows}
                            employeesList={employeesList}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer className="justify-content-end">
                    <Button className="px-3" variant="secondary" onClick={handleClose}>
                        Close
                    </Button>

                    <Button
                        className="px-3"
                        variant="primary"
                        type="submit"
                        onClick={checkProcessStatus}
                    >
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default EmployeesToPayItemsModal;
