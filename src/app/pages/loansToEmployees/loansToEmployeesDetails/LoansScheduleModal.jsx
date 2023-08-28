import React, {Fragment, useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import ScheduleList from "./ScheduleList";
import {NotificationManager} from "react-notifications";
import payrollProcessService from "../../../api/payrollProcessServices/payrollProcessService";
import {payrollPeriodProcess} from "../constant";

const LoansToEmployeesModal = ({
                                   show,
                                   setShow,
                                   processPeriodData,
                                   loansToEmployeesId,
                                   employee,
                                   payrollId,
                                   ...props
                               }) => {
    const [employeesList, setEmployeeList] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [employeeType, setEmployeeType] = useState("");
    const [keyword, setKeyword] = useState("");
    const [templateData, setTemplateData] = useState({});
    const [scheduleList, setScheduleList] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const handleClose = () => {
        setShow(false);
    };

    useEffect(() => {
        // Clear all notifications
        NotificationManager.listNotify.forEach((n) => NotificationManager.remove({id: n.id}));
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
        //Fetch table data
        getMonthlyEmiSchedules(payrollId);
    }, []);

    //Fetch table data
    const getMonthlyEmiSchedules = (payrollId) => {

        setLoading(true);
        payrollProcessService().getLoansToEmployees(payrollId).then(({data}) => {
            let loansToEmployeeData = data.loansToEmployees?.filter((v) => v.id === loansToEmployeesId);
            data = loansToEmployeeData[0].monthlyEmis?.map((loan) => {
                return {
                    no: loan.no,
                    principal: loan.principal,
                    interest: loan.interest,
                    processPeriod: loan.isProcessed === true ? (processPeriodData?.find((v) => v.id === loan.processedPeriodId)?.label) : "",
                };
            });
            setScheduleList(data);
            setLoading(false);
        });
    };

    return (
        <Fragment>
            <Modal size="xl" show={show} onHide={handleClose} {...props} scrollable={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Loan Schedule</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row mx-2">
                        <ScheduleList
                            scheduleList={scheduleList}
                            isLoading={isLoading}
                        />
                    </div>
                </Modal.Body>
            </Modal>
        </Fragment>
    );
};

export default LoansToEmployeesModal;
