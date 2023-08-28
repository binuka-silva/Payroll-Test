import React, {Fragment, useEffect, useState} from "react";
import {Button, FormLabel, Modal} from "react-bootstrap";
import {periodType} from "../../payrollPeriod/constant";
import {NotificationManager} from "react-notifications";
import payrollProcessService from "../../../api/payrollProcessServices/payrollProcessService";
import {NOTIFICATION_ERROR} from "../../../common/notifications";
import {RESP_STATUS_CODES} from "../../../common/response";
import AutoCompleteDropDown from "../../../components/AutoCompleteDropDown";
import {GullLoadable} from "@gull";

const PayrollProcessModal = ({
                                 payroll,
                                 show,
                                 setShow,
                                 isLoading,
                                 empTemplateList,
                                 payrollPeriodList,
                                 fetchEmpDataFunc,
                                 tableRef,
                                 currentPage,
                                 ...props
                             }) => {

    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [payRollPeriod, setPayRollPeriod] = useState("");
    const [employeeTemplate, setEmployeeTemplate] = useState("");
    const [cutoffDateList, setCutoffDateList] = useState([]);
    const [cutoffDate, setCutoffDate] = useState("");
    const [dropdownEmployeeTemplate, setDropdownEmployeeTemplate] = useState("");
    const [dropdownPayRollPeriod, setDropdownPayRollPeriod] = useState("");
    const [dropdownCutoffDate, setDropdownCutoffDate] = useState({});

    useEffect(() => {
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
    }, [])

    useEffect(() => {
        setDropdownCutoffDate(cutoffDateList.find(e => payroll.cutOffDate === e.value));
    }, [cutoffDateList]);

    useEffect(() => {
        setDropdownEmployeeTemplate(empTemplateList.find(e => e.code === payroll?.employeeTemplateObj?.code));
        setEmployeeTemplate(empTemplateList.find(e => e.code === payroll?.employeeTemplateObj?.code)?.value);
    }, [empTemplateList]);

    useEffect(() => {
        setDropdownPayRollPeriod(payrollPeriodList.find(e => e.label === payroll?.payRollPeriod));
        setPayRollPeriod(payrollPeriodList.find(e => e.label === payroll?.payRollPeriod)?.value);
    }, [payrollPeriodList]);

    useEffect(() => {
        setCode(payroll?.code);
        setName(payroll?.name);
        setCutoffDate(payroll?.cutOffDate);
        setCutoffDateList([
            {label: "Monday", value: "Monday"},
            {label: "Tuesday", value: "Tuesday"},
            {label: "Wednesday", value: "Wednesday"},
            {label: "Thursday", value: "Thursday"},
            {label: "Friday", value: "Friday"},
            {label: "Saturday", value: "Saturday"},
            {label: "Sunday", value: "Sunday"},
        ]);
    }, [payroll]);

    const handleClose = () => {
        setShow(false);
    };

    const handleSubmit = async () => {
        const payrollProcess = {
            code,
            name,
            cutOffDate: cutoffDate,
            employeeTemplateId: employeeTemplate,
            payRollPeriodId: payRollPeriod,
            isProcessed: false,
            IsDelete: false,
            modifiedDateTime: new Date(),
        };

        payrollProcessService()
            .update(payrollProcess, payroll.id)
            .then((response) => {
                NotificationManager.success(
                    "A record was successfully updated",
                    "Success"
                );
                tableRef.current.onQueryChange({page: currentPage});
                handleClose();
                // fetchEmpDataFunc();
            })
            .catch((error) => {
                console.error(error);
                if (error.status === RESP_STATUS_CODES.FORBIDDEN || error.status === RESP_STATUS_CODES.UNAUTHORIZED) {
                    NotificationManager.error(NOTIFICATION_ERROR.AUTH_FAILED, error.statusText);
                } else {
                    NotificationManager.error(
                        "An existing record already found",
                        "Error"
                    );
                }
            });
    }

    return (
        <Fragment>

            <Modal show={show} onHide={handleClose} {...props}>

                {isLoading && (
                    <div className="overlay">
                        <GullLoadable/>
                    </div>
                )}

                <Modal.Header closeButton>
                    <Modal.Title>Edit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <FormLabel>Payroll Code</FormLabel>
                        <input
                            type="text"
                            className="form-control"
                            value={code ?? ""}
                            onChange={(e) => setCode(e.target.value)}
                        />
                    </div>

                    <div>
                        <FormLabel>Payroll Name</FormLabel>
                        <input
                            type="text"
                            className="form-control"
                            value={name ?? ""}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <FormLabel>Employee Template</FormLabel>
                        <AutoCompleteDropDown
                            dropDownData={empTemplateList}
                            onChange={(e, selected) => {
                                setEmployeeTemplate(selected?.value);
                                setDropdownEmployeeTemplate(selected);
                            }}
                            label="Select"
                            isFreeDropDown={true}
                            defaultValue={dropdownEmployeeTemplate}
                        />
                    </div>

                    <div>
                        <FormLabel>Payroll Period</FormLabel>
                        <AutoCompleteDropDown
                            dropDownData={payrollPeriodList}
                            onChange={(e, selected) => {
                                setPayRollPeriod(selected?.value);
                                setDropdownPayRollPeriod(selected);
                            }}
                            isFreeDropDown={true}
                            label="Select"
                            defaultValue={dropdownPayRollPeriod}
                        />
                    </div>

                    <div>
                        <FormLabel>Cut-off Date</FormLabel>
                        {payrollPeriodList?.find(p => p.value === payRollPeriod)?.period === periodType.WEEK ? (
                            <AutoCompleteDropDown
                                dropDownData={cutoffDateList}
                                onChange={(e, selected) => {
                                    setCutoffDate(selected?.value);
                                    setDropdownCutoffDate(selected);
                                }}
                                label="Select"
                                isFreeDropDown={true}
                                defaultValue={dropdownCutoffDate}
                            />
                        ) : (<input
                            type="number"
                            className="form-control"
                            value={cutoffDate}
                            onChange={(e) => setCutoffDate(e.target.value)}
                        />)}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type="submit" onClick={handleSubmit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default PayrollProcessModal;
