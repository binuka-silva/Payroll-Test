import React, {Fragment, useEffect, useState} from "react";
import {Button, FormLabel, FormSelect, Modal} from "react-bootstrap";
import EmployeesList from "./EmployeesList";
import PayrollButton from "app/components/PayrollButton";
import {NotificationManager} from "react-notifications";

const LoansToEmployeesModal = ({
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
        NotificationManager.listNotify.forEach((n) => NotificationManager.remove({id: n.id}));
    }, []);

    // Fill table
    const fetchEmployees = async () => {
        let employeeArray = employeeData;
        if (keyword == "") {
            setEmployeeList(employeeArray);
            return;
        }
        switch (employeeType) {
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
                            <FormSelect onChange={(e) => setEmployeeType(e.target.value)}>
                                <option>Select</option>
                                <option value="empNo">Employee Number</option>
                                <option value="name">Name</option>
                                <option value="designation">Designation</option>
                                <option value="status">Status</option>
                            </FormSelect>
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

export default LoansToEmployeesModal;
