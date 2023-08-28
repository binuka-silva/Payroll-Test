import React, {Fragment, useEffect, useState} from "react";
import {Button, FormLabel, FormSelect, Modal} from "react-bootstrap";
import EmployeesList from "./EmployeesList";
import PayrollButton from "app/components/PayrollButton";
import {NotificationManager} from "react-notifications";
import AutoCompleteDropDown from "../../components/AutoCompleteDropDown";

const PayItemsToEmployeesModal = ({
                                      show,
                                      setShow,
                                      employeeData,
                                      payrollId,
                                      setEmployee,
                                      setEmployeeName,
                                      ...props
                                  }) => {
    const [employeesList, setEmployeeList] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [employeeType, setEmployeeType] = useState("");
    const [keyword, setKeyword] = useState("");
    const [templateData, setTemplateData] = useState({});

    const handleClose = () => {
        setShow(false);
    };

    useEffect(() => {
        // Clear all notifications
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
    }, []);

    // Fill table
    const fetchEmployees = async () => {
        let employeeArray = employeeData;
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

    //   const addRows = () => {
    //     new Promise((resolve, reject) => {
    //       //Obj Create
    //       const employeesToPayItemsList = filteredEmployees.map((employee) => ({
    //         employeeId: employee.value,
    //         payrollPayItemId: payItem,
    //         payrollDefinitionId: payrollId,
    //         amount: amount ?? null,
    //         units: units ?? null,
    //         employerAmount: employerAmount ?? null,
    //         startDate: dateFromPeriod,
    //         endDate: dateToPeriod,
    //       }));

    //       if (employeesToPayItemsList.length == 0) {
    //         reject();
    //         return;
    //       }
    //       newlyAddedEmployees(filteredEmployees);

    //       employeesToPayItemsServices()
    //         .create(employeesToPayItemsList)
    //         .then(async (response) => {
    //           NotificationManager.success(
    //             employeesToPayItemsList.length +
    //               " records was successfully created",
    //             "Success"
    //           );

    //           //Reload list
    //           fetchEmployeesToPayItemsFunc(payroll);
    //           clearItemsFunc();
    //           handleClose();
    //           resolve();
    //         })
    //         .catch((error) => {
    //           console.error(error);
    //           if (error.statusCode === 409) {
    //             NotificationManager.error(error.message, "Error");
    //           }
    //           reject();
    //         });
    //     });
    //   };

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
                            setEmployee={setEmployee}
                            setEmployeeName={setEmployeeName}
                            handleClose={handleClose}
                            employeeData={employeeData}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer className="justify-content-end">
                    <Button className="px-3" variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default PayItemsToEmployeesModal;
