import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import {NavLink} from "react-router-dom";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import PayItemAdvanceParameterDetailsList from "./PayItemAdvanceParameterDetailsList";
import payItemAdvanceParameterDetailsService
    from "../../api/PayItemAdvanceParameterServeces/payItemAdvanceParameterDetailsService";
import {FormLabel} from "react-bootstrap";
import {connect, useSelector} from "react-redux";
import {NotificationManager} from "react-notifications";
import history from "../../../@history";
import ParameterDateRangePicker from "./ParameterDateRangePicker";
import {setPayItemAdvanceParameterDetails} from "../../redux/actions/PayItemAdvancedParameterActions";
import {NOTIFICATION_ERROR} from "../../common/notifications";
import {RESP_STATUS_CODES} from "../../common/response";
import {labels} from "./constant";
import localStorageService from "../../services/localStorageService";
import Tooltip from "@material-ui/core/Tooltip";
import SaveIcon from "@mui/icons-material/Save";

const PayItemAdvanceParameterDetails = ({
                                            setPayItemAdvanceParameterDetails,
                                        }) => {
    const [
        payItemAdvanceParameterDetailsList,
        setPayItemAdvanceParameterDetailsList,
    ] = useState([]);
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    let [validFrom, setValidFrom] = useState("");
    let [validTo, setValidTo] = useState("");
    const [validityPeriod, setValidityPeriod] = useState("");
    const [description, setDescription] = useState("");
    const [updateBtn, setUpdateBtn] = useState(false);
    const [labelList, setLabelList] = useState([]);
    const [userLabels, setUserLabels] = useState([]);

    const payItemAdvanceParameter = useSelector(
        (state) => state.payItemAdvanceParameter
    );

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
        NotificationManager.listNotify.forEach((n) =>
            NotificationManager.remove({id: n.id})
        );

        //Fetch table data
        //await fetchPayItemAdvanceParameterDetailsData();
        if (payItemAdvanceParameter.payItemAdvanceParameterDetails) {
            setPayItemAdvanceParameterDetailsList(
                payItemAdvanceParameter.payItemAdvanceParameterDetails
            );
            setCode(payItemAdvanceParameter.code);
            setName(payItemAdvanceParameter.name);
            setValidFrom(payItemAdvanceParameter.validFrom);
            setValidTo(payItemAdvanceParameter.validTo);
            //setValidityPeriod(`${payItemAdvanceParameter.validFrom.replaceAll("/", "-").split("T")[0]} ~ ${payItemAdvanceParameter.validTo.replaceAll("/", "-").split("T")[0]}`);
            setDescription(payItemAdvanceParameter.description);
            setUpdateBtn(true);
        }

        return () => {
            setPayItemAdvanceParameterDetails({
                payItemAdvanceParameterDetails: null,
                code: "",
                name: "",
                validFrom: "",
                validTo: "",
                description: "",
                id: "",
            });
        };
    }, []);

    // //Fetch table data
    const fetchPayItemAdvanceParameterDetailsData = () => {
        payItemAdvanceParameterDetailsService()
            .getAll()
            .then((response) => {
                setPayItemAdvanceParameterDetailsList(response.data);
            });
    };

    const onSubmit = () =>
        new Promise((resolve, reject) => {
            if (code !== "") {
                let payItemParameter = {
                    code,
                    name,
                    validFrom: `${validFrom.replaceAll("-", "/").split("T")[0]}`,
                    validTo: `${validTo.replaceAll("-", "/").split("T")[0]}`,
                    description,
                    payItemAdvanceParameterDetails: [],
                };
                payItemAdvanceParameterDetailsList.forEach((list) =>
                    payItemParameter.payItemAdvanceParameterDetails.push({
                        sequence: parseInt(list.sequence),
                        coveredValue: parseInt(list.coveredValue),
                        value: parseFloat(list.value ?? "0"),
                        value1: parseFloat(list.value1 ?? "0"),
                    })
                );

                payItemAdvanceParameterDetailsService()
                    .create(payItemParameter)
                    .then((response) => {
                        NotificationManager.success("successfully created", "Success");
                        //Reload list
                        resolve();
                        setPayItemAdvanceParameterDetailsList([]);
                        setCode("");
                        setName("");
                        setValidFrom("");
                        setValidTo("");
                        setValidityPeriod("");
                        setDescription("");

                        onSave();
                    })
                    .catch((error) => {
                        console.error(error);
                        reject();
                        if (
                            error.status === RESP_STATUS_CODES.FORBIDDEN ||
                            error.status === RESP_STATUS_CODES.UNAUTHORIZED
                        ) {
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
            } else {
                NotificationManager.error(
                    "Please enter a code before submitting.",
                    "Error"
                );
            }
        });

    const onSave = () =>
        new Promise((resolve, reject) => {
            history.push("/pay-item-advance-parameter");
        });

    const onUpdate = () =>
        new Promise((resolve, reject) => {
            let payItemParameter = {
                code,
                name,
                validFrom: `${validFrom.replaceAll("-", "/").split("T")[0]}`,
                validTo: `${validTo.replaceAll("-", "/").split("T")[0]}`,
                description,
                payItemAdvanceParameterDetails: [],
            };
            payItemAdvanceParameterDetailsList.forEach((list) =>
                payItemParameter.payItemAdvanceParameterDetails.push({
                    sequence: parseInt(list.sequence),
                    coveredValue: parseInt(list.coveredValue),
                    value: parseFloat(list.value ?? "0"),
                    value1: parseFloat(list.value1 ?? "0"),
                })
            );
            const id = payItemAdvanceParameter.id;
            payItemAdvanceParameterDetailsService()
                .update(id, payItemParameter)
                .then((response) => {
                    NotificationManager.success("successfully created", "Success");
                    //Reload list
                    resolve();
                    setPayItemAdvanceParameterDetailsList([]);
                    setCode("");
                    setName("");
                    setValidFrom("");
                    setValidTo("");
                    setValidityPeriod("");
                    setDescription("");

                    onSave();
                })
                .catch((error) => {
                    console.error(error);
                    reject();
                    if (
                        error.status === RESP_STATUS_CODES.FORBIDDEN ||
                        error.status === RESP_STATUS_CODES.UNAUTHORIZED
                    ) {
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

    const handleValidityPeriod = (props) => {
        setValidFrom(props[0]);
        setValidTo(props[1]);
    };

    return (
        <>
            <div className="row">
                <div className="col-md-10 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Dashboard", path: "/dashboard/v1/"},
                            {
                                name: "Pay Item Advance Parameters",
                                path: "/pay-item-advance-parameter",
                            },
                            {name: "Pay Item Advance Parameter Details"},
                        ]}
                    ></Breadcrumb>
                </div>
                <div className="col-md-1">
                    <div className="mt-2 d-flex justify-content-start">
                        <NavLink to={"/pay-items"}>
              <span className="capitalize text-muted">
                |&nbsp;Pay&nbsp;Items&nbsp;|
              </span>
                        </NavLink>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-2">
                    <FormLabel>
                        {userLabels.find(
                                (label) => label.labelId === labels.parameterCode.toLowerCase()
                            )?.editedLabel ??
                            labelList.find(
                                (label) => label.labelId === labels.parameterCode.toLowerCase()
                            )?.label}
                    </FormLabel>
                    <input
                        className="form-control"
                        type="text"
                        value={code ?? ""}
                        onChange={(v) => setCode(v.target.value)}
                        required
                    ></input>
                </div>

                <div className="col-md-2">
                    <FormLabel>
                        {userLabels.find(
                                (label) => label.labelId === labels.parameterName.toLowerCase()
                            )?.editedLabel ??
                            labelList.find(
                                (label) => label.labelId === labels.parameterName.toLowerCase()
                            )?.label}
                    </FormLabel>
                    <input
                        className="form-control"
                        type="text"
                        value={name ?? ""}
                        onChange={(v) => setName(v.target.value)}
                    ></input>
                </div>

                <div className="col-md-3 ">
                    <FormLabel>
                        {userLabels.find(
                                (label) => label.labelId === labels.validityPeriod.toLowerCase()
                            )?.editedLabel ??
                            labelList.find(
                                (label) => label.labelId === labels.validityPeriod.toLowerCase()
                            )?.label}
                    </FormLabel>
                    {payItemAdvanceParameter.validFrom &&
                    payItemAdvanceParameter.validTo ? (
                        <ParameterDateRangePicker
                            dateRangeFunc={handleValidityPeriod}
                            value={validityPeriod ?? ""}
                            startDate={new Date(payItemAdvanceParameter.validFrom)}
                            endDate={new Date(payItemAdvanceParameter.validTo)}
                        />
                    ) : (
                        <ParameterDateRangePicker
                            dateRangeFunc={handleValidityPeriod}
                            value={validityPeriod ?? ""}
                        />
                    )}
                </div>

                <div className="col-md-3 ">
                    <FormLabel>
                        {userLabels.find(
                                (label) => label.labelId === labels.description.toLowerCase()
                            )?.editedLabel ??
                            labelList.find(
                                (label) => label.labelId === labels.description.toLowerCase()
                            )?.label}
                    </FormLabel>
                    <input
                        className="form-control"
                        type="text"
                        value={description ?? ""}
                        onChange={(v) => setDescription(v.target.value)}
                    ></input>
                </div>

                <div className="col-md-2 mt-4 d-flex ">
                    {updateBtn ? (
                        <div className="mt-2">
                            <Tooltip title="Update All" placement="bottom">
                                <SaveIcon
                                    sx={{color: "#0A7373"}}
                                    type="submit"
                                    onClick={() => onUpdate()}
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
                                />
                            </Tooltip>
                        </div>
                    )}
                </div>
            </div>

            <br/>
            <br/>
            <div className="row">
                <PayItemAdvanceParameterDetailsList
                    fetchPayItemAdvanceParameterDetailsDataFunc={
                        fetchPayItemAdvanceParameterDetailsData
                    }
                    payItemAdvanceParameterDetailsList={
                        payItemAdvanceParameterDetailsList
                    }
                    setPayItemAdvanceParameterDetailsList={(e) => {
                        setPayItemAdvanceParameterDetailsList(e);
                    }}
                />
            </div>
            <NotificationContainer/>
        </>
    );
};

const mapStateToProps = (state) => ({
    setPayItemAdvanceParameterDetails: state.setPayItemAdvanceParameterDetails,
});

export default connect(mapStateToProps, {
    setPayItemAdvanceParameterDetails,
})(PayItemAdvanceParameterDetails);
