import React, {Fragment, useEffect, useState} from "react";
import {Modal} from "react-bootstrap";

const PayrollProcessingEmployeeModal = ({employee, show, setShow, processData, periodProcess, ...props}) => {
    const [empId, setEmpId] = useState("");
    const [empName, setEmpName] = useState("");
    const [designation, setDesignation] = useState("");
    const [empType, setEmpType] = useState("");
    const [empCat, setEmpCat] = useState("");
    const [organization, setOrganization] = useState("");
    const [employeeProcessData, setEmployeeProcessData] = useState([]);

    useEffect(() => {
        setEmpId(employee.empNo);
        setEmpName(employee.empName);
        setDesignation(employee.designation);
        setEmpType(employee.employeeType);
        setEmpCat(employee.employeeCategory);
        setOrganization(employee.organization);

        const processEmp = processData.payrollProcessEmployees?.find(process => process.employeeId === employee.id)?.payrollProcessEmployeeResults;
        if (processEmp) setEmployeeProcessData(processEmp.map(p => ({
            payItem: `${p.payItem.code} - ${p.payItem.name}`,
            paymentType: `${p.payItem.paymentType.code} - ${p.payItem.paymentType.type}`,
            amount: p.amount,
            units: p.units
        })));
    }, [employee, processData]);

    const handleClose = () => {
        setShow(false);
    };

    return (
        <Fragment>
            <Modal show={show} onHide={handleClose} {...props} size="lg" scrollable={true}>
                <Modal.Header className="d-flex justify-content-between">
                    <Modal.Title><strong>{employee.empNo ?? "Id"} - {employee.empName ?? "Name"}</strong></Modal.Title>
                    <Modal.Title><strong>{periodProcess}</strong></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-12 mb-1">
                            <label htmlFor="validationCustom202"><strong>Employee Id:&nbsp;</strong></label>
                            {empId}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 mb-1">
                            <label htmlFor="validationCustom202"><strong>Employee Name:&nbsp;</strong></label>
                            {empName}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 mb-1">
                            <label htmlFor="validationCustom202"><strong>Designation:&nbsp;</strong></label>
                            {designation}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 mb-1">
                            <label htmlFor="validationCustom202"><strong>Organization:&nbsp;</strong></label>
                            {organization}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 mb-1">
                            <label htmlFor="validationCustom202"><strong>Category:&nbsp;</strong></label>
                            {empCat}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 mb-1">
                            <label htmlFor="validationCustom202"><strong>Type:&nbsp;&nbsp;</strong></label>
                            {empType}
                        </div>
                    </div>
                    {employeeProcessData.length > 0 && (<>
                        <div className="custom-separator"></div>
                        <h5><strong>Summary</strong></h5>
                    </>)}
                    {employeeProcessData.map((data, index) => (
                        <div className="row d-flex justify-content-start" key={index}>
                            <div className="col-5">
                                <label
                                    htmlFor="validationCustom202"><strong>{data.payItem}:&nbsp;&nbsp;</strong></label>
                            </div>
                            <div className="col-3">
                                {data.amount}
                            </div>
                            <div className="col-2">
                                {data.units}
                            </div>
                        </div>
                    ))}
                </Modal.Body>
            </Modal>
        </Fragment>
    );
};

export default PayrollProcessingEmployeeModal;
