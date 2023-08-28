import React, {Fragment, useEffect, useState} from "react";
import {Button, FormLabel, Modal} from "react-bootstrap";
import EmployeesList from "./EmployeesList";
import PayrollButton from "app/components/PayrollButton";
import employeesToPayItemsServices from "app/api/employeesToPayItemsServices/employeesToPayItemsServices";
import {NotificationManager} from "react-notifications";
import AutoCompleteDropDown from "../../components/AutoCompleteDropDown";
import {payrollPeriodProcess} from "./constant";
import moment from "moment";

const EmployeesToPayItemsModal = ({
                                      show,
                                      setShow,
                                      employeeData,
                                      fetchEmployeesToPayItemsFunc,
                                      employeesToPayItemsList,
                                      clearItemsFunc,
                                      newlyAddedEmployees,
                                      payItem,
                                      payrollId,
                                      amount,
                                      units,
                                      employerAmount,
                                      dateFromPeriod,
                                      dateToPeriod,
                                      payroll,
                                      sPeriods,
                                      ePeriods,
                                      startDateData,
                                      closePeriodsData,
                                      prossPeriods,
                                      setEmployee,
                                      setEmployeeInDropdown,
                                      ...props
                                  }) => {
    const [employeesList, setEmployeeList] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [employeeType, setEmployeeType] = useState("");
    const [keyword, setKeyword] = useState("");
    const [isSubmitBtnDisabled, setSubmitBtnDisabled] = useState(false);

    const handleClose = () => {
        setShow(false);
    };

    useEffect(() => {
        // Clear all notifications
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
    }, []);

    // Fill table
    const fetchEmployees = async () => {
        setSubmitBtnDisabled(false);
        let employeeArray = employeeData;
        if (employeesToPayItemsList?.length > 0) {
            let addedIdList = employeesToPayItemsList.map((emp) => emp.employee);
            employeeArray = employeeArray.filter(
                (emp) => !addedIdList.includes(emp.label)
            );
        }
        if (keyword === "") {
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
        setSubmitBtnDisabled(true);
        setEmployeeInDropdown("");
        setEmployee("");
        new Promise((resolve, reject) => {
            let x = startDateData?.find(
                (v) => v.periodNo !== payrollPeriodProcess.CLOSE
            )?.startDate;
            let y = startDateData?.find(
                (v) => v.periodNo !== payrollPeriodProcess.CLOSE
            )?.endDate;

            //Obj Create
            const employeesToPayItemsList = filteredEmployees.map((employee) => ({
                employeeId: employee.value,
                payrollPayItemId: payItem,
                payrollDefinitionId: payrollId,
                amount: amount ?? null,
                units: units ?? null,
                employerAmount: employerAmount ?? null,
                startDate: sPeriods ? sPeriods : x,
                endDate: ePeriods ? ePeriods : y,
            }));

            if (employeesToPayItemsList?.length === 0) {
                reject();
                return;
            }
            newlyAddedEmployees(filteredEmployees);

            employeesToPayItemsServices()
                .create(employeesToPayItemsList)
                .then((response) => {
                    NotificationManager.success(
                        employeesToPayItemsList?.length +
                        " records was successfully created",
                        "Success"
                    );

                    //Reload list
                    fetchEmployeesToPayItemsFunc(payroll);
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
        });
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
                        //onClick={addRows}
                        disabled={isSubmitBtnDisabled}
                    >
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default EmployeesToPayItemsModal;
