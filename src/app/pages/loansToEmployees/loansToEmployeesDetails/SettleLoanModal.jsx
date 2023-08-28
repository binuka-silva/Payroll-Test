import React, {Fragment, useEffect, useState} from "react";
import {Button, FormCheck, FormLabel, Modal} from "react-bootstrap";
import {NotificationManager} from "react-notifications";
import loansToEmployeesService from "../../../api/loansToEmployeesServices/loansToEmployeesService";
import {loanActionTypes} from "../constant";

const SettleLoanModal = ({
                             show,
                             setShow,
                             scheduleList,
                             balanceAmount,
                             effectiveDate,
                             payroll, loansToEmployee,
                             payrollLoanTypeId,
                             employeeId,
                             applyDate,
                             active,
                             sequence,
                             loansToEmployeeId,
                             instalmentAmount,
                             ...props
                         }) => {
    const [isPayrollSettle, setPayrollSettle] = useState(true);

    const handleClose = () => {
        setShow(false);
    };

    useEffect(() => {
        // Clear all notifications
        setPayrollSettle(loansToEmployee.isPayrollSettle);
        NotificationManager.listNotify.forEach((n) =>
            NotificationManager.remove({id: n.id})
        );
    }, []);

    const settleLoan = () => {
        const data = {
            payrollLoanTypeId: payrollLoanTypeId,
            isPayrollSettle
        };
        loansToEmployeesService().update(data, loansToEmployeeId, loanActionTypes.SETTLEMENT).then(() => {
            NotificationManager.success("Loan settlement successful", "Success");
            handleClose();
        }).catch((error) => {
            console.error(error);
        });
    };

    return (
        <Fragment>
            <Modal size="lg" show={show} onHide={handleClose} {...props}>
                <Modal.Header closeButton>
                    <Modal.Title>Settle Loan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-6">
                            <FormLabel>Balance Amount</FormLabel>
                            <input
                                type="number"
                                className="form-control"
                                value={balanceAmount ?? ""}
                                readOnly={true}
                            />
                        </div>
                        <div className="col-md-6">
                            <FormLabel>Monthly Instalment Amount</FormLabel>
                            <input
                                type="number"
                                className="form-control"
                                value={instalmentAmount ?? 0}
                                readOnly={true}
                            />
                        </div>
                    </div>

                    <div className="row mx-2">
                        {/* <ScheduleList
              scheduleList={scheduleList}
              handleClose={handleClose}
            /> */}
                    </div>
                </Modal.Body>
                <Modal.Footer className="justify-content-end">
                    <FormCheck
                        onChange={(e) => setPayrollSettle(e.target.checked)
                        }
                        checked={isPayrollSettle}
                        type="switch"
                        label="Settle Using Payroll"
                    />
                    <Button
                        className="px-3"
                        variant="primary"
                        type="submit"
                        onClick={settleLoan}
                    >
                        Settle Loan
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default SettleLoanModal;
