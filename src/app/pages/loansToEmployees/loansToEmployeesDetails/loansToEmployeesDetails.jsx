import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import {Button, FormLabel} from "react-bootstrap";
import {connect, useSelector} from "react-redux";
import {NotificationManager} from "react-notifications";
import {setLoansToEmployeesrDetails} from "../../../redux/actions/LoansToEmployeesAction";
import LoansScheduleModal from "./LoansScheduleModal";
import LoansReScheduleModal from "./LoansReScheduleModal";
import SettleLoanModal from "./SettleLoanModal";
import InactiveLoanModal from "./InactiveLoanModal";
import "./loans.scss";
import {roundToCeiling} from "../../../common/loanCalculations";
import moment from "moment";

const LoansToEmployeesDetails = (setLoansToEmployeesrDetails) => {

    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [loanType, setLoanType] = useState("");
    const [loanName, setLoanName] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [employee, setEmployee] = useState("");
    const [payrollId, setPayrollId] = useState("");
    const [employeeName, setEmployeeName] = useState("");
    const [amount, setAmount] = useState(0);
    const [instalments, setInstalments] = useState(0);
    const [effectiveDate, setEffectiveDate] = useState("");
    const [applyDate, setApplyDate] = useState("");
    const [capitalAmount, setCapitalAmount] = useState(0);
    const [interestAmount, setInterestAmount] = useState(0);
    const [instalmentAmount, setInstalmentAmount] = useState(0);
    const [sequence, setSequence] = useState(0);
    const [balanceAmount, setBalanceAmount] = useState(0);
    const [balanceInterest, setBalanceInterest] = useState(0);
    const [balanceInstalment, setBalanceInstalment] = useState(0);
    const [lastProcessedDate, setLastProcessedDate] = useState("");
    const [active, setActive] = useState("");
    const [loansToEmployeeId, setLoansToEmployeeId] = useState("");
    const [isSettle, setIsSettle] = useState("");
    const [scheduleList, setScheduleList] = useState([]);
    const [scheduleData, setScheduleData] = useState([]);
    const [processPeriodData, setProcessPeriodData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showReModal, setReShowModal] = useState(false);
    const [showSettleModal, setSettleShowModal] = useState(false);
    const [showInModal, setInShowModal] = useState(false);

    const loansToEmployee = useSelector((state) => state.loansToEmployees);

    //Component did mount only
    useEffect(() => {
        window.scrollTo(0, 0);

        // Clear all notifications
        NotificationManager.listNotify.forEach((n) => NotificationManager.remove({id: n.id}));

        //Fetch table data
        if (loansToEmployee) {
            setCode(loansToEmployee.payroll.code);
            setName(loansToEmployee.payroll.name);
            setLoanType(loansToEmployee.loanrowData.loanType);
            setLoanName(loansToEmployee.loanrowData.loanTypeName);
            setPayrollId(loansToEmployee.payroll.id);
            setEmployeeId(loansToEmployee.employee.empNo);
            setEmployee(loansToEmployee.employee.id);
            setEmployeeName(loansToEmployee.employee.employeeName);
            setAmount(loansToEmployee.amount);
            setInstalments(loansToEmployee.instalments);
            setApplyDate(loansToEmployee.applyDate.split("T")[0]);
            const prossData = loansToEmployee.monthlyEmis.filter((m) => m.isProcessed === false); 
            setCapitalAmount(prossData[0]?.principal);
            setInterestAmount(prossData[0]?.interest);
            setInstalmentAmount((Number(prossData[0]?.principal) + Number(prossData[0]?.interest)).toFixed(2),);
            setSequence(loansToEmployee.sequence);
            const balanceEmis = loansToEmployee.monthlyEmis.filter(m => !m.isProcessed);
            setBalanceAmount(roundToCeiling(balanceEmis.map(b => b.principal).reduce((ac, currentVal) => ac + currentVal, 0), 0.01));
            setBalanceInterest(roundToCeiling(balanceEmis.map(b => b.interest).reduce((ac, currentVal) => ac + currentVal, 0), 0.01));
            setBalanceInstalment(balanceEmis.length);
            setActive((loansToEmployee.loanrowData.active === true) ? "Active" : "ÏnActive");
            setIsSettle(balanceEmis.length === 0 ? "Settled" : "Unsettled");
            setEffectiveDate(loansToEmployee.effectiveDate.split("T")[0]);
            setScheduleList(loansToEmployee.monthlyEmis);
            setScheduleData(loansToEmployee.scheduleData);
            setProcessPeriodData(loansToEmployee.processPeriodData);
            setLoansToEmployeeId(loansToEmployee.id);
 
            const lastProssDate = loansToEmployee.monthlyEmis?.findLast((v)=>v.isProcessed === true)?.modifiedDateTime?.split("T") 
            const lastProssDateInLoacalTime = lastProssDate ? (moment(new Date(lastProssDate)).subtract(new Date(lastProssDate).getTimezoneOffset(), "minutes").format("MM/DD/YYYY hh:mm A").split(" ")[0]): ""
            setLastProcessedDate(lastProssDateInLoacalTime);   
        }
    }, []);


    return (
      <>
        {showModal && (
          <LoansScheduleModal
            show={showModal}
            scheduleList={scheduleList}
            scheduleData={scheduleData}
            processPeriodData={processPeriodData}
            setShow={setShowModal}
            loansToEmployeesId={loansToEmployeeId}
            employee={employee}
            payrollId={payrollId}
          />
        )}
        {showReModal && (
          <LoansReScheduleModal
            show={showReModal}
            scheduleList={scheduleList}
            setShow={setReShowModal}
            balanceAmount={balanceAmount}
            effectiveDate={effectiveDate}
            payroll={loansToEmployee.payrollDefinitionId}
            payrollLoanTypeId={loansToEmployee.payrollLoanTypeId}
            employeeId={loansToEmployee.employeeId}
            applyDate={applyDate}
            active={active}
            sequence={sequence}
            loansToEmployeeId={loansToEmployee.id}
            setAmount={setAmount}
            setInstalment={setInstalments}
            setApplyDate={setApplyDate}
            setCapitalAmount={setCapitalAmount}
            setInterestAmount={setInterestAmount}
            setInstalmentAmount={setInstalmentAmount}
            setSequence={setSequence}
            setEffectiveDate={setEffectiveDate}
            setBalanceAmount={setBalanceAmount}
            setBalanceInterest={setBalanceInterest}
            setBalanceInstalment={setBalanceInstalment}
            setLastProcessedDate={setLastProcessedDate}
            setActive={setActive}
            setIsSettle={setIsSettle}
          />
        )}
        {showSettleModal && (
          <SettleLoanModal
            show={showSettleModal}
            scheduleList={scheduleList}
            setShow={setSettleShowModal}
            balanceAmount={balanceAmount}
            instalmentAmount={instalmentAmount}
            effectiveDate={effectiveDate}
            payroll={loansToEmployee.payrollDefinitionId}
            loansToEmployee={loansToEmployee}
            payrollLoanTypeId={loansToEmployee.payrollLoanTypeId}
            employeeId={loansToEmployee.employeeId}
            applyDate={applyDate}
            active={active}
            sequence={sequence}
            loansToEmployeeId={loansToEmployee.id}
          />
        )}
        {showInModal && (
          <InactiveLoanModal
            show={showInModal}
            setShow={setInShowModal}
            loansToEmployeeId={loansToEmployee.id}
            payrollLoanTypeId={loansToEmployee.payrollLoanTypeId}
            processPeriodData={loansToEmployee.processPeriodData}
          />
        )}
        <div className="row">
          <div className="col-md-10 row">
            <Breadcrumb
              routeSegments={[
                { name: "Dashboard", path: "/dashboard/v1/" },
                { name: "Loans To Employees", path: "/payroll-apply-loan" },
                { name: "Loans To Employees Details" },
              ]}
              isPreviousPagePersist
            ></Breadcrumb>
          </div>
        </div>
        <br></br>
        <div className="row">
          <div className="col-md-3">
            <FormLabel>Payroll</FormLabel>
            <input
              type="text"
              className="form-control"
              value={`${code} - ${name}`}
              readOnly={true}
            />
          </div>

          <div className="col-md-3">
            <FormLabel>Loan</FormLabel>
            <input
              type="text"
              className="form-control"
              value={`${loanType} - ${loanName}`}
              readOnly={true}
            />
          </div>

          <div className="col-md-3">
            <FormLabel>Employee Id</FormLabel>
            <input
              type="text"
              className="form-control"
              value={employeeId ?? ""}
              readOnly={true}
            />
          </div>
          <div className="col-md-3">
            <FormLabel>Employee Name</FormLabel>
            <input
              type="text"
              className="form-control"
              value={employeeName ?? ""}
              readOnly={true}
            />
          </div>
        </div>
        <br></br>
        <br></br>
        <div className="row">
          <div className="col-md-3">
            <label htmlFor="validationCustom202">
              <strong>Apply Amount:&nbsp;</strong>
            </label>
            {amount}
          </div>
          <div className="col-md-3">
            <label htmlFor="validationCustom202">
              <strong>Instalments:&nbsp;</strong>
            </label>
            {instalments}
          </div>
          <div className="col-md-3">
            <label htmlFor="validationCustom202">
              <strong>Effective Date:&nbsp;</strong>
            </label>
            {effectiveDate}
          </div>
          <div className="col-md-3">
            <label htmlFor="validationCustom202">
              <strong>Apply Date:&nbsp;</strong>
            </label>
            {applyDate}
          </div>
        </div>
        <br></br>
        <div className="row">
          <div className="col-md-3">
            <label htmlFor="validationCustom202">
              <strong>Monthly Capital Amount:&nbsp;</strong>
            </label>
            {capitalAmount}
          </div>
          <div className="col-md-3">
            <label htmlFor="validationCustom202">
              <strong>Monthly Interest Amount:&nbsp;</strong>
            </label>
            {interestAmount}
          </div>
          <div className="col-md-3">
            <label htmlFor="validationCustom202">
              <strong>Monthly Instalment Amount:&nbsp;</strong>
            </label>
            {instalmentAmount}
          </div>
          <div className="col-md-3">
            <label htmlFor="validationCustom202">
              <strong>Sequence:&nbsp;</strong>
            </label>
            {sequence}
          </div>
        </div>
        <br></br>
        <div className="row">
          <div className="col-md-3">
            <label htmlFor="validationCustom202">
              <strong>Balance Amount:&nbsp;</strong>
            </label>
            {balanceAmount}
          </div>
          <div className="col-md-3">
            <label htmlFor="validationCustom202">
              <strong>Balance Interest:&nbsp;</strong>
            </label>
            {balanceInterest}
          </div>
          <div className="col-md-3">
            <label htmlFor="validationCustom202">
              <strong>Balance Instalment:&nbsp;</strong>
            </label>
            {balanceInstalment}
          </div>
          <div className="col-md-3">
            <label htmlFor="validationCustom202">
              <strong>Last Processed Date:&nbsp;</strong>
            </label>
            {lastProcessedDate}
          </div>
        </div>
        <br></br>
        <div className="row">
          <div className="col-md-3">
            <label htmlFor="validationCustom202">
              <strong>Loan Status:&nbsp;</strong>
            </label>
            {active}
          </div>
          <div className="col-md-3">
            <label htmlFor="validationCustom202">
              <strong>Loan Settlement Status:&nbsp;</strong>
            </label>
            {isSettle}
          </div>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-3"></div>
          <div className="col-md-3">
            <div>
              <Button
                variant="primary"
                type="submit"
                className="loan-block"
                onClick={() => setShowModal(true)}
              >
                View Schedule
              </Button>
            </div>
          </div>
          <div className="col-md-3">
            <div>
              <Button
                variant="primary"
                type="submit"
                className="loan-block"
                onClick={() => setReShowModal(true)}
              >
                Loan Re-Schedule
              </Button>
            </div>
            <br></br>
            <div>
              <Button
                variant="primary"
                type="submit"
                className="loan-block"
                onClick={() => setSettleShowModal(true)}
              >
                Settle Loan
              </Button>
            </div>
            <br></br>
            <div>
              <Button
                variant="primary"
                type="submit"
                className="loan-block"
                onClick={() => setInShowModal(true)}
              >
                Inactive Loan
              </Button>
            </div>
          </div>
        </div>
        <NotificationContainer />
      </>
    );
};

const mapStateToProps = (state) => ({
    setLoansToEmployeesrDetails: state.setLoansToEmployeesrDetails,
});

export default connect(mapStateToProps, {
    setLoansToEmployeesrDetails,
})(LoansToEmployeesDetails);
