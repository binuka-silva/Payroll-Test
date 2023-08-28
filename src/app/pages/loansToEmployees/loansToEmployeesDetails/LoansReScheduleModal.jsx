import React, {Fragment, useEffect, useState} from "react";
import {Button, FormLabel, Modal} from "react-bootstrap";
import {NotificationManager} from "react-notifications";
import loansToEmployeesService from "../../../api/loansToEmployeesServices/loansToEmployeesService";
import { payrollPeriodProcess } from "../constant";
import { roundToCeiling } from "../../../common/loanCalculations";
import moment from "moment";
import { loanActionTypes } from "../constant";

const LoansReScheduleModal = ({
                                  show,
                                  setShow,
                                  scheduleList,
                                  balanceAmount,
                                  effectiveDate,
                                  payroll,
                                  payrollLoanTypeId,
                                  employeeId,
                                  applyDate,
                                  active,
                                  sequence,
                                  loansToEmployeeId,
                                  setAmount,
                                  setInstalment,
                                  setApplyDate,
                                  setCapitalAmount,
                                  setInterestAmount,
                                  setInstalmentAmount,
                                  setSequence,
                                  setEffectiveDate,
                                  setBalanceAmount,
                                  setBalanceInterest,
                                  setBalanceInstalment,
                                  setLastProcessedDate,
                                  setActive,
                                  setIsSettle,
                                  ...props
                              }) => {
    const [employeesList, setEmployeeList] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [employeeType, setEmployeeType] = useState("");
    const [instalments, setInstalments] = useState(0);
    const [templateData, setTemplateData] = useState({});

    const handleClose = () => {
        setShow(false);
    };

    useEffect(() => {
        // Clear all notifications
        NotificationManager.listNotify.forEach((n) => NotificationManager.remove({id: n.id}));
    }, []);

    const reScheduleLoan = () => new Promise((resolve, reject) => {

        const data = {
            amount: balanceAmount,
            instalments: parseInt(instalments),
            effectiveDate: effectiveDate,
            payrollDefinitionId: payroll,
            payrollLoanTypeId: payrollLoanTypeId,
            employeeId: employeeId,
            applyDate: applyDate,
            active: active === "Active" ? true : false,
            sequence: sequence,
        };
        
        loansToEmployeesService().update(data, loansToEmployeeId, loanActionTypes.RESCHEDULE).then(() => {
            
            NotificationManager.success("records was successfully re-scheduled", "Success");

            loansToEmployeesService().findOne(loansToEmployeeId).then((newData)=>{
            
            let loanData = newData.data  
            let prossData = loanData.monthlyEmis.filter((m) => m.isProcessed === false); 

            setAmount(loanData.amount);
            setInstalment(loanData.instalments);
            setApplyDate(loanData.applyDate.split("T")[0]);
            setCapitalAmount(prossData[0]?.principal);
            setInterestAmount(prossData[0]?.interest);
            setInstalmentAmount((Number(loanData?.monthlyEmis[0]?.principal) + Number(loanData?.monthlyEmis[0]?.interest)).toFixed(2),);
            setSequence(loanData.sequence);
            setEffectiveDate(loanData.effectiveDate.split("T")[0]);
            const balanceEmis = loanData.monthlyEmis.filter(m => !m.isProcessed);
            setBalanceAmount(roundToCeiling(balanceEmis.map(b => b.principal).reduce((ac, currentVal) => ac + currentVal, 0), 0.01));
            setBalanceInterest(roundToCeiling(balanceEmis.map(b => b.interest).reduce((ac, currentVal) => ac + currentVal, 0), 0.01));
            setBalanceInstalment(balanceEmis.length);

            const lastProssDate = loanData.monthlyEmis?.findLast((v)=>v.isProcessed === true)?.modifiedDateTime?.split("T") 
            const lastProssDateInLoacalTime = lastProssDate ? (moment(new Date(lastProssDate)).subtract(new Date(lastProssDate).getTimezoneOffset(), "minutes").format("MM/DD/YYYY hh:mm A").split(" ")[0]): ""
            setLastProcessedDate(lastProssDateInLoacalTime);
            setActive(loanData.active === true ? "Active" : "ÏnActive");
            setIsSettle(balanceEmis.length === 0 ? "Settled" : "Unsettled");

         })
            handleClose();
            resolve();
        })        
        .catch((error) => {
            console.error(error);
            reject();
        });
    });

    return (
        <Fragment>
            <Modal size="lg" show={show} onHide={handleClose} {...props}>
                <Modal.Header closeButton>
                    <Modal.Title>Loan Re-Schedule</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-6">
                            <FormLabel>Re-Schedule Installment Amount</FormLabel>
                            <input
                                type="number"
                                className="form-control"
                                value={balanceAmount ?? ""}
                                readOnly={true}
                            />
                        </div>
                        <div className="col-md-6">
                            <FormLabel>Re-Schedule Instalments</FormLabel>
                            <input
                                type="number"
                                className="form-control"
                                value={instalments ?? 0}
                                onChange={(e) => setInstalments(e.target.value)}
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
                        onClick={reScheduleLoan}
                    >
                        Re-Schedule
                    </Button>
                    <Button className="px-3" variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default LoansReScheduleModal;
