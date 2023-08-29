import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import {NavLink} from "react-router-dom";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import PayRollPeriodList from "./PayRollPeriodList";
import payRollPeriodDetailService from "../../api/payRollPeriodServices/payRollPeriodDetailService";
import {Button, FormLabel} from "react-bootstrap";
import {NotificationManager} from "react-notifications";
import moment from "moment";
import history from "../../../@history";
import {connect, useSelector} from "react-redux";
import {setPayRollPeriodsDetails} from "../../redux/actions/PayrollPeriodsActions";
import {NOTIFICATION_ERROR} from "../../common/notifications";
import {RESP_STATUS_CODES} from "../../common/response";
import localStorageService from "../../services/localStorageService";
import {labels} from "./constant";
import AutoCompleteDropDown from "../../components/AutoCompleteDropDown";
import Tooltip from "@material-ui/core/Tooltip";
import SaveIcon from "@mui/icons-material/Save";
import generatePeriod from "../../common/generatePeriod";

const PayRollPeriod = ({setPayRollPeriodsDetails}) => {
    const [payRollPeriodList, setPayRollPeriodList] = useState([]);

    const [period, setPeriod] = useState("");
    const [periodName, setPeriodName] = useState("");
    const [payDay, setPayDay] = useState("");
    const [dropdownSelectedPayDay, setDropdownSelectedPayDay] = useState("");
    const [tax, setTax] = useState("");
    const [updateBtn, setUpdateBtn] = useState(false);
    const [isExtend, setExtend] = useState(false);

    const payrollPeriod = useSelector((state) => state.payrollPeriod);
    const [selectedDate, setSelectedDate] = useState(
        payrollPeriod.periodYear
            ? moment(payrollPeriod.payRollPeriodDetails[0].dateFrom).format("yyyy-MM-DD")
            : new Date()
    );

    const [selectedMonth, setSelectedMonth] = useState(false);
    const [selectedWeek, setSelectedWeek] = useState(false);
    const [selectedDay, setSelectedDay] = useState(false);

    const [labelList, setLabelList] = useState([]);
    const [userLabels, setUserLabels] = useState([]);

    useEffect(() => {
        setLabelList(
            localStorageService
                .getItem("label_list")
                ?.filter(
                    (list) => list.permissionPage.path === window.location.pathname
                )
        );
        setUserLabels(localStorageService.getItem("auth_user")?.labels);
    }, []);

    //Component did mount only
    useEffect(() => {
        window.scrollTo(0, 0);
        // Clear all notifications
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        //Fetch table data
        // await fetchPayRollPeriodData();
        if (payrollPeriod.payRollPeriodDetails) {
            setPayRollPeriodList(
                payrollPeriod.payRollPeriodDetails.map((detail) => ({
                    ...detail,
                    dateFrom: moment(detail.dateFrom).format("yyyy-MM-DD"),
                    dateTo: moment(detail.dateTo).format("yyyy-MM-DD"),
                    payDate: moment(detail.payDate).format("yyyy-MM-DD"),
                }))
            );
            setPeriodName(payrollPeriod.periodName);
            setPeriod(payrollPeriod.period);
            switch (payrollPeriod.period) {
                case "month":
                    setSelectedMonth(true);
                    break;
                case "week":
                    setSelectedWeek(true);
                    break;
                default:
                    setSelectedDay(true);
                    break;
            }
            setTax(payrollPeriod.tax);
            setPayDay(payrollPeriod.payDay);
            setUpdateBtn(true);
        }

        return () => {
            setPayRollPeriodsDetails({
                id: "",
                payRollPeriodDetails: null,
                periodName: "",
                period: "",
                tax: "",
                payDay: "",
                periodYear: "",
            });
        };
    }, []);

    //Fetch table data
    const fetchPayRollPeriodData = () => {
        payRollPeriodDetailService()
            .getAll()
            .then(async (response) => {
                setPayRollPeriodList(response.data);
            })
            .catch((e) => console.error(e));
    };

    const PayRollOnchange = (e, selected) => {
        setPeriod(selected?.value);
    };

    const onSubmit = () =>
        new Promise((resolve, reject) => {
            let payRollPeriod = {
                periodName,
                period,
                tax: parseInt(tax),
                payDay: parseInt(payDay),
                periodYear: selectedDate,
                payrollPeriodDetails: [],
            };
            payRollPeriodList.forEach((list) =>
                payRollPeriod.payrollPeriodDetails.push({
                    periodNo: parseInt(list.periodNo),
                    dateFrom: list.dateFrom,
                    dateTo: list.dateTo,
                    taxPeriod: list.taxPeriod,
                    accountingPeriod: list.accountingPeriod,
                    payDate: list.payDate,
                    payDay: list.payDay,
                    createdBy: list.createdBy,
                })
            );

            payRollPeriodDetailService()
                .create(payRollPeriod)
                .then((response) => {
                    //Reload list
                    resolve();
                    setPayRollPeriodList([]);
                    setPeriodName("");
                    setPeriod("");
                    setTax("");
                    setPayDay("");

                    onSave();
                });
        })
            .then(() => {
                NotificationManager.success("successfully created", "Success");
            })
            .catch((error) => {
                if (error.status === RESP_STATUS_CODES.FORBIDDEN || error.status === RESP_STATUS_CODES.UNAUTHORIZED) {
                    NotificationManager.error(
                        NOTIFICATION_ERROR.AUTH_FAILED,
                        error.statusText
                    );
                } else {
                    NotificationManager.error(
                        "An existing record already found",
                        "Error"
                    );
                }
            });

    const onSave = () =>
        new Promise((resolve, reject) => {
            history.push("/payroll-periods");
        });

    const onUpdate = () =>
        new Promise((resolve, reject) => {
            let payRollPeriod = {
                periodName,
                period,
                tax: parseInt(tax),
                payDay: parseInt(payDay),
                periodYear: selectedDate,
                payrollPeriodDetails: [],
            };
            payRollPeriodList.forEach((list) =>
                payRollPeriod.payrollPeriodDetails.push({
                    id: list.id,
                    periodNo: parseInt(list.periodNo),
                    dateFrom: list.dateFrom,
                    dateTo: list.dateTo,
                    taxPeriod: list.taxPeriod,
                    accountingPeriod: list.accountingPeriod,
                    payDate: list.payDate,
                    payDay: list.payDay,
                    createdBy: list.createdBy,
                })
            );
            const id = payrollPeriod.id;
            payRollPeriodDetailService()
                .update(id, isExtend, payRollPeriod)
                .then((response) => {
                    NotificationManager.success("successfully created", "Success");
                    //Reload list
                    resolve();
                    setPayRollPeriodList([]);
                    setPeriodName("");
                    setPeriod("");
                    setTax("");
                    setPayDay("");

                    onSave();
                })
                .catch((error) => {
                    console.error(error);
                    reject();
                    if (error.status === RESP_STATUS_CODES.FORBIDDEN || error.status === RESP_STATUS_CODES.UNAUTHORIZED) {
                        NotificationManager.error(
                            NOTIFICATION_ERROR.AUTH_FAILED,
                            error.statusText
                        );
                    } else {
                        NotificationManager.error(
                            "An existing record already found",
                            "Error"
                        );
                    }
                });
        });

    return (
        <>
            <div className="row">
                <div className="col-md-8 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Dashboard", path: "/dashboard/v1/"},
                            {name: "Payroll Period", path: "payroll-periods"},
                            {name: "Payroll Period Details"},
                        ]}
                    ></Breadcrumb>
                </div>
                <div className="col-md-4">
                    <div className="mt-2 d-flex justify-content-start">
                        <NavLink to={"/payroll"}>
              <span className="capitalize text-muted">
                |&nbsp;Payroll&nbsp;|
              </span>
                        </NavLink>
                    </div>
                </div>
            </div>
            <div className="row justify-content-between">
                <div className="col-md-2">
                    <FormLabel>
                        {userLabels.find(
                                (label) => label.labelId === labels.periodName.toLowerCase()
                            )?.editedLabel ??
                            labelList.find(
                                (label) => label.labelId === labels.periodName.toLowerCase()
                            )?.label}
                    </FormLabel>
                    <input
                        className="form-control"
                        type="text"
                        value={periodName ?? ""}
                        onChange={(v) => setPeriodName(v.target.value)}
                    ></input>
                </div>

                <div className="col-md-2">
                    <FormLabel>
                        {userLabels.find(
                                (label) => label.labelId === labels.period.toLowerCase()
                            )?.editedLabel ??
                            labelList.find(
                                (label) => label.labelId === labels.period.toLowerCase()
                            )?.label}
                    </FormLabel>
                    <AutoCompleteDropDown
                        dropDownData={[
                            {value: "month", label: "Month"},
                            {value: "week", label: "Week"},
                            {value: "biweek", label: "Bi-Week"},
                            {value: "day", label: "Day"},
                        ]}
                        isFreeDropDown={true}
                        onChange={PayRollOnchange}
                        label="Select"
                        defaultValue={period}
                    />
                </div>

                <div className="col-md-2">
                    <FormLabel>
                        {userLabels.find(
                                (label) =>
                                    label.labelId === labels.monthsToStartTaxYear.toLowerCase()
                            )?.editedLabel ??
                            labelList.find(
                                (label) =>
                                    label.labelId === labels.monthsToStartTaxYear.toLowerCase()
                            )?.label}
                    </FormLabel>
                    <input
                        className="form-control"
                        type="number"
                        min="0"
                        value={tax ?? ""}
                        onChange={(v) => setTax(v.target.value)}
                    ></input>
                </div>

                <div className="col-md-2">
                    <FormLabel>
                        {userLabels.find(
                                (label) => label.labelId === labels.payDay.toLowerCase()
                            )?.editedLabel ??
                            labelList.find(
                                (label) => label.labelId === labels.payDay.toLowerCase()
                            )?.label}
                    </FormLabel>
                    {period === "week" ? (
                        <AutoCompleteDropDown
                            dropDownData={[
                                {value: "1", label: "Monday"},
                                {value: "2", label: "Tuesday"},
                                {value: "3", label: "Wednesday"},
                                {value: "4", label: "Thursday"},
                                {value: "5", label: "Friday"},
                                {value: "6", label: "Saturday"},
                                {value: "7", label: "Sunday"},
                            ]}
                            isFreeDropDown={true}
                            onChange={(e, selected) => {
                                setPayDay(selected?.value);
                                setDropdownSelectedPayDay(selected?.label);
                            }}
                            label="Select"
                            defaultValue={
                                dropdownSelectedPayDay
                                    ? dropdownSelectedPayDay
                                    : payrollPeriod.payDay === 1
                                        ? "Monday"
                                        : payrollPeriod.payDay === 2
                                            ? "Tuesday"
                                            : payrollPeriod.payDay === 3
                                                ? "Wednesday"
                                                : payrollPeriod.payDay === 4
                                                    ? "Thursday"
                                                    : payrollPeriod.payDay === 5
                                                        ? "Friday"
                                                        : payrollPeriod.payDay === 6
                                                            ? "Saturday"
                                                            : "Sunday"
                            }
                        />
                    ) : (
                        <input
                            className="form-control"
                            type="number"
                            min="0"
                            max={period === "month" ? 31 : "biweek" ? 14 : 7}
                            value={period === "day" ? "" : payDay}
                            disabled={period === "day"}
                            onChange={(v) => {
                                period === "day" ? setPayDay(" ") : setPayDay(v.target.value);
                            }}
                        ></input>
                    )}
                </div>

                <div className="col-md-2">
                    <FormLabel>
                        {userLabels.find(
                                (label) => label.labelId === labels.startFrom.toLowerCase()
                            )?.editedLabel ??
                            labelList.find(
                                (label) => label.labelId === labels.startFrom.toLowerCase()
                            )?.label}
                    </FormLabel>
                    <input
                        className="form-control"
                        type="date"
                        // value={selectedDate ?? ""}
                        value={selectedDate ?? ""}
                        onChange={(v) => setSelectedDate(v.target.value)}
                    ></input>
                </div>

                <div className="col-md-1 mt-4 d-flex justify-content-end">
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={() => setPayRollPeriodList(generatePeriod(period, payDay, tax, selectedDate))}
                        disabled={
                            !(
                                (period === "month" && payDay <= 31) ||
                                (period === "week" && payDay <= 7) ||
                                (period === "biweek" && payDay <= 14) ||
                                period === "day"
                            )
                        }
                    >
                        Generate
                    </Button>
                </div>

                <div className="col-md-1 mt-4 d-flex  ">
                    {updateBtn ? (
                        <div className="mt-2">
                            <Tooltip title="Update All" placement="bottom">
                                <SaveIcon
                                    sx={{color: "#0A7373"}}
                                    type="submit"
                                    onClick={onUpdate}
                                    style={{marginRight: 20}}
                                />
                            </Tooltip>
                        </div>
                    ) : (
                        <div className="mt-2">
                            <Tooltip title="Save All" placement="bottom">
                                <SaveIcon
                                    sx={{color: "#0A7373"}}
                                    type="submit"
                                    onClick={onSubmit}
                                    style={{marginRight: 20}}
                                    disabled={
                                        !(
                                            (period === "month" && payDay <= 31) ||
                                            (period === "week" && payDay <= 7) ||
                                            period === "day"
                                        )
                                    }
                                />
                            </Tooltip>
                        </div>
                    )}
                </div>
            </div>

            <br/>
            <br/>

            <div className="row">
                <PayRollPeriodList
                    fetchPayRollPeriodDataFunc={fetchPayRollPeriodData}
                    payRollPeriodList={payRollPeriodList}
                    setPayRollPeriodList={(e) => {
                        setPayRollPeriodList(e);
                    }}
                    isUpdate={updateBtn}
                    onExtend={() => {
                        setExtend(true);
                        setPayRollPeriodList(generatePeriod(period, payDay, tax, selectedDate, moment(payrollPeriod.periodYear ? moment(payrollPeriod.periodYear).format("yyyy-MM-DD") : selectedDate).add(1, "years").format("DD.MM.YYYY")));
                        setSelectedDate(moment(payrollPeriod.periodYear).add(1, "years").format("yyyy-MM-DD"));
                    }}
                />
            </div>
            <NotificationContainer/>
        </>
    );
};

const mapStateToProps = (state) => ({
    setPayRollPeriodsDetails: state.setPayRollPeriodsDetails,
});

export default connect(mapStateToProps, {
    setPayRollPeriodsDetails,
})(PayRollPeriod);
