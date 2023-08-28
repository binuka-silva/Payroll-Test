import React, {Fragment, useEffect, useState} from "react";
import {Button, FormCheck, Modal} from "react-bootstrap";
import employeeService from "../../../../api/payrollProcessServices/employeeService";
import {useSelector} from "react-redux";
import swal from "sweetalert2";
import BankDetailList from "./BankDetailsList";
import EmployeeParameterList from "./EmployeeParameterList";
import {NotificationManager} from "react-notifications";

const EmployeeModal = ({employee, show, setShow, bankData, branchData, fetchEmpDataFunc, ...props}) => {
    const [empId, setEmpId] = useState("");
    const [empName, setEmpName] = useState("");
    const [designation, setDesignation] = useState("");
    const [empType, setEmpType] = useState("");
    const [empCat, setEmpCat] = useState("");
    const [organization, setOrganization] = useState("");
    const [employeeBankDetails, setEmployeeBankDetails] = useState([]);
    const [isActive, setActive] = useState(false);
    const [isBankPayment, setBankPayment] = useState(false);
    const [isPayrollActive, setPayrollActive] = useState(false);
    const [payrollActiveDate, setPayrollActiveDate] = useState(new Date());
    const [isProfileCompleted, setProfileCompleted] = useState(false);

    const payrollDetail = useSelector((state) => state.payrollTaxDetails);

    useEffect(() => {
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
    }, [])

    useEffect(() => {
        setEmpId(employee.empId);
        setEmpName(employee.name);
        setDesignation(employee.designation);
        setEmpType(employee.employeeType);
        setEmpCat(employee.employeeCategory);
        setOrganization(employee.organization);
        setActive(employee.isActive);
        setBankPayment(employee.isBankPayment);
        setPayrollActive(employee.isPayrollActive);
        setProfileCompleted(employee.isProfileCompleted);
        employee.payrollActiveChangeDate && setPayrollActiveDate(new Date(employee.payrollActiveChangeDate));
    }, [employee]);

    const handleClose = () => {
        setShow(false);
    };

    const updateEmployee = async () => {
        const employeeReq = {
            payrollDefinitionId: payrollDetail.id,
            isBankPayment,
            isPayrollActive,
            employeeId: employee.id
        }

        await employeeService().update([employeeReq]);
        fetchEmpDataFunc();
    }

    const handleSubmit = async () => {
        try {
            if (employeeBankDetails.length === 0) {
                if ((isBankPayment && !employee.isBankPayment) && (!isPayrollActive && employee.isPayrollActive)) {
                    swal.fire({
                        title: "Are you sure?",
                        text: "Processed Employee will be Change",
                        type: "question",
                        icon: "warning",
                        showCancelButton: true,
                        toast: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes",
                        cancelButtonText: "No",
                    })
                        .then(async (result) => {
                            if (result.value) {
                                await updateEmployee();
                                NotificationManager.success(
                                    "Successfully Updated",
                                    "Updated"
                                );
                            } else {
                                setBankPayment(false);
                                setPayrollActive(true);
                            }
                        });
                } else {
                    if (isBankPayment && !employee.isBankPayment) {
                        swal.fire({
                            title: "Are you sure?",
                            text: "Bank Details is not provided",
                            type: "question",
                            icon: "warning",
                            showCancelButton: true,
                            toast: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Yes",
                            cancelButtonText: "No",
                        })
                            .then(async (result) => {
                                if (result.value) {
                                    await updateEmployee();
                                    NotificationManager.success(
                                        "Successfully Updated",
                                        "Updated"
                                    );
                                } else {
                                    setBankPayment(false);
                                }
                            });
                    } else {
                        if (!isPayrollActive && employee.isPayrollActive) {
                            swal.fire({
                                title: "Are you sure?",
                                text: "Processed Employee will be Change",
                                type: "question",
                                icon: "warning",
                                showCancelButton: true,
                                toast: true,
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Yes",
                                cancelButtonText: "No",
                            })
                                .then(async (result) => {
                                    if (result.value) {
                                        await updateEmployee();
                                        NotificationManager.success(
                                            "Successfully Updated",
                                            "Updated"
                                        );
                                    } else {
                                        setPayrollActive(true);
                                    }
                                });
                        } else {
                            await updateEmployee();
                            NotificationManager.success(
                                "Successfully Updated",
                                "Updated"
                            );
                        }
                    }
                }
            } else {
                await updateEmployee();
                NotificationManager.success(
                    "Successfully Updated",
                    "Updated"
                );
            }
        } catch (e) {
            console.error(e);
            NotificationManager.error(
                "Update Failed",
                "Error"
            );
        }
    }

    return (
        <Fragment>
            <Modal show={show} onHide={handleClose} {...props} size="xl" scrollable={true}>
                <Modal.Header closeButton>
                    <Modal.Title><strong>{employee.empId ?? "Id"} - {employee.name ?? "Name"}</strong></Modal.Title>
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
                    <div className="row">
                        <div className="col-md-12 mb-1">
                            <label htmlFor="validationCustom202"><strong>Payroll Active Changed
                                Date:&nbsp;</strong></label>
                            {employee.payrollActiveChangeDate && payrollActiveDate.toDateString()}
                        </div>
                    </div>
                    <div className="d-flex flex-row justify-content-between mb-2">
                        <div className="d-flex flex-row flex-wrap gap-3">
                            <FormCheck
                                label="Bank Payment"
                                onChange={(e) => setBankPayment(e.target.checked)}
                                type="switch"
                                checked={isBankPayment ?? false}
                            />
                            <FormCheck
                                label="Payroll Active"
                                onChange={(e) => setPayrollActive(e.target.checked)}
                                type="switch"
                                checked={isPayrollActive ?? false}
                            />
                        </div>
                        <Button variant="primary" type="submit" onClick={handleSubmit} className="mr-2">
                            Save Changes
                        </Button>
                    </div>
                    <BankDetailList employeeId={employee.id} bankData={bankData} branchData={branchData}
                                    setEmployeeBankDetails={setEmployeeBankDetails}/>
                    <div className="custom-separator"></div>
                    <EmployeeParameterList employeeId={employee.id}/>
                </Modal.Body>
            </Modal>
        </Fragment>
    );
};

export default EmployeeModal;
