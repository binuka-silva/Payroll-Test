import React, {Fragment, useEffect, useState} from "react";
import {Button, FormLabel, Modal} from "react-bootstrap";
import {NotificationManager} from "react-notifications";
import loansToEmployeesService from "../../../api/loansToEmployeesServices/loansToEmployeesService";
import {loanActionTypes, payrollPeriodProcess} from "../constant";
import moment from "moment";

const InactiveLoanModal = ({
                               show,
                               setShow,
                               balanceAmount,
                               instalmentAmount,
                               payrollLoanTypeId,
                               loansToEmployeeId, processPeriodData,
                               ...props
                           }) => {

    const [monthCount, setMonthCount] = useState(0);
    const [inActiveDate, setInActiveDate] = useState("");

    const handleClose = () => {
        setShow(false);
    };

    useEffect(() => {
        // Clear all notifications
        NotificationManager.listNotify.forEach((n) => NotificationManager.remove({id: n.id}));
    }, []);

    useEffect(() => {
   
         fetchLoanData();
    }, []);

    const fetchLoanData = () => {
     
         loansToEmployeesService().findOne(loansToEmployeeId).then((newData)=>{
               
            let loanData = newData.data   

            setMonthCount(loanData.inactiveMonths);
            setInActiveDate(moment(loanData.inactivePeriod?.dateFrom).format("yyyy-MM-DD"));
            
         })
    };

    const inactiveLoan = () => {
        const data = {
            payrollLoanTypeId: payrollLoanTypeId,
            processPeriodData: processPeriodData?.find((v) => v.periodProcess !== payrollPeriodProcess.CLOSE)?.id,
            inactiveMonths: monthCount
        };
        loansToEmployeesService().update(data, loansToEmployeeId, loanActionTypes.INACTIVE).then(() => {
            NotificationManager.success("Loans became inactive successfully.", "Success");
            handleClose();
        }).catch((error) => {
            console.error(error);
        });
    };

    return (
        <Fragment>
            <Modal size="lg" show={show} onHide={handleClose} {...props}>
                <Modal.Header closeButton>
                    <Modal.Title>Inactive Loan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-6">
                            <FormLabel>Month Count</FormLabel>
                            <input
                                type="number"
                                className="form-control"
                                value={monthCount ?? 0}
                                onChange={(e) => setMonthCount(e.target.value)}
                            />
                        </div>
                        <div className="col-md-6">
                            <FormLabel>Inactive Period</FormLabel>
                            <input
                                type="date"
                                className="form-control"
                                value={inActiveDate ?? ""}
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
                    <Button
                        className="px-3"
                        variant="primary"
                        type="submit"
                        onClick={inactiveLoan}
                    >
                        Inactive Loan
                    </Button>
                    <Button className="px-3" variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default InactiveLoanModal;
