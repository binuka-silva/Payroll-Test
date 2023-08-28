import React, {useEffect, useState} from "react";
import NotificationContainer from "react-notifications/lib/NotificationContainer";

import {Button, Card, FormLabel,} from "react-bootstrap";
import {connect, useSelector} from "react-redux";
import {setPayrollTaxDetails} from "../../../redux/actions/PayrollTaxDetailsActions";
import moment from "moment";
import {payrollPeriodProcess} from "../constant";
import localStorageService from "../../../services/localStorageService";
import {labels} from "./constant";

const TaxDetails = ({
                        setPayrollTaxDetails,
                        taxNumber,
                        epfId,
                        etfId,
                        setTaxNumber,
                        setEpfId,
                        setEtfId,
                        payrollProcessList,
                        ...props
                    }) => {
    const [intTaxNumber, setIntTaxNumber] = useState("");
    const [intEPFId, setIntEPFId] = useState("");
    const [intETFId, setIntETFId] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [edit, setEdit] = useState(false);

    const payrolltaxDetails = useSelector((state) => state.payrollTaxDetails);

    const [labelList, setLabelList] = useState([]);
    const [userLabels, setUserLabels] = useState([]);

    useEffect(() => {
        setLabelList(
            localStorageService
                .getItem("label_list")
                ?.filter((list) => list.permissionPage.path === window.location.pathname)
        );
        setUserLabels(localStorageService.getItem("auth_user")?.labels);
    }, []);

    //Component did mount only
    useEffect(() => {
        window.scrollTo(0, 0);
        if (payrolltaxDetails) {
            setIntTaxNumber(payrolltaxDetails.taxNumber);
            setIntEPFId(payrolltaxDetails.epfId);
            setIntETFId(payrolltaxDetails.etfId);

            const yearStartDetail = payrolltaxDetails?.payRollPeriod?.payRollPeriodDetails.find(
                (detail) => detail.taxPeriod?.split("-")[1] === "01"
            );
            const openedDetail = payrolltaxDetails?.payRollPeriod?.payRollPeriodDetails.find(
                (detail) => detail.periodProcess === payrollPeriodProcess.OPEN
            );
            if (yearStartDetail) {
                if (yearStartDetail.taxPeriod?.split("-")[0] === openedDetail?.taxPeriod?.split("-")[0]) {
                    setDateFrom(moment(yearStartDetail.dateFrom.split(" ")[0]).format("yyyy-MM-DD"));
                    setDateTo(
                        moment(yearStartDetail.dateFrom?.split(" ")[0])
                            .add("year", 1)
                            .subtract("days", 1)
                            .format("yyyy-MM-DD")
                    );
                } else {
                    const newYear = payrolltaxDetails?.payRollPeriod?.payRollPeriodDetails.findIndex(
                        (detail) => detail.taxPeriod?.split("-")[1] === "01"
                    );
                    const PrevYear = payrolltaxDetails?.payRollPeriod?.payRollPeriodDetails[newYear - 1];
                    setDateFrom(
                        moment(PrevYear.dateTo?.split(" ")[0])
                            .subtract("year", 1)
                            .add("days", 1)
                            .format("yyyy-MM-DD")
                    );
                    setDateTo(moment(PrevYear.dateTo.split(" ")[0]).format("yyyy-MM-DD"));
                }
            }
        }
    }, [payrollProcessList]);


    return (
        <>
            <div>
                <Card style={{marginTop: "20px", padding: "10px"}}>
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            {/* <label htmlFor="validationCustom202">
                Tax Identification Number
              </label> */}
                            <FormLabel>
                                {userLabels.find(
                                        (label) =>
                                            label.labelId ===
                                            labels.taxIdentificationNumber.toLowerCase()
                                    )?.editedLabel ??
                                    labelList.find(
                                        (label) =>
                                            label.labelId ===
                                            labels.taxIdentificationNumber.toLowerCase()
                                    )?.label}
                            </FormLabel>
                            <input
                                type="text"
                                className="form-control"
                                id="validationCustom202"
                                placeholder="Tax Number"
                                name="number"
                                value={intTaxNumber ?? ""}
                                readOnly={!edit}
                                onChange={(e) => setIntTaxNumber(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-4 mb-3">
                            {/* <label htmlFor="validationCustom202">Start Date</label> */}
                            <FormLabel>
                                {userLabels.find(
                                        (label) => label.labelId === labels.startDate.toLowerCase()
                                    )?.editedLabel ??
                                    labelList.find(
                                        (label) => label.labelId === labels.startDate.toLowerCase()
                                    )?.label}
                            </FormLabel>
                            <input
                                type="text"
                                className="form-control"
                                id="validationCustom202"
                                placeholder="Start Date"
                                name="dateFrom"
                                value={dateFrom ?? ""}
                                readOnly={true}
                                onChange={(e) => setDateFrom(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-4 mb-3">
                            {/* <label htmlFor="validationCustom202">End Date</label> */}
                            <FormLabel>
                                {userLabels.find(
                                        (label) => label.labelId === labels.endDate.toLowerCase()
                                    )?.editedLabel ??
                                    labelList.find(
                                        (label) => label.labelId === labels.endDate.toLowerCase()
                                    )?.label}
                            </FormLabel>
                            <input
                                type="text"
                                className="form-control"
                                id="validationCustom202"
                                placeholder="End Date"
                                name="dateTo"
                                value={dateTo ?? ""}
                                readOnly={true}
                                onChange={(e) => setDateTo(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </Card>

                <Card
                    style={{marginTop: "20px", marginBottom: "20px", padding: "10px"}}
                >
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <FormLabel>
                                {userLabels.find(
                                        (label) => label.labelId === labels.epfId.toLowerCase()
                                    )?.editedLabel ??
                                    labelList.find(
                                        (label) => label.labelId === labels.epfId.toLowerCase()
                                    )?.label}
                            </FormLabel>
                            <input
                                type="text"
                                className="form-control"
                                id="validationCustom202"
                                placeholder="EPF Id"
                                name="epfId"
                                value={intEPFId ?? ""}
                                readOnly={!edit}
                                onChange={(e) => setIntEPFId(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-4 mb-3">
                            <FormLabel>
                                {userLabels.find(
                                        (label) => label.labelId === labels.etfId.toLowerCase()
                                    )?.editedLabel ??
                                    labelList.find(
                                        (label) => label.labelId === labels.etfId.toLowerCase()
                                    )?.label}
                            </FormLabel>
                            <input
                                type="text"
                                className="form-control"
                                id="validationCustom202"
                                placeholder="ETF Id"
                                name="etfId"
                                value={intETFId ?? ""}
                                readOnly={!edit}
                                onChange={(e) => setIntETFId(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </Card>

                <div className="row">
                    <div className="d-flex justify-content-end">
                        <Button
                            style={{width: "120px", marginLeft: "15px"}}
                            variant="secondary"
                            onClick={(e) => setEdit(true)}
                        >
                            Edit
                        </Button>
                        <Button
                            style={{width: "120px", marginLeft: "15px"}}
                            variant="primary"
                            type="submit"
                            onClick={(e) => {
                                if (edit) {
                                    setTaxNumber(intTaxNumber);
                                    setEpfId(intEPFId);
                                    setEtfId(intETFId);
                                }
                            }}
                        >
                            Save
                        </Button>
                    </div>
                </div>

                <NotificationContainer/>
            </div>
        </>
    );
};

const mapStateToProps = (state) => ({
    setPayrollTaxDetails: state.setPayrollTaxDetails,
});

export default connect(mapStateToProps, {
    setPayrollTaxDetails,
})(TaxDetails);