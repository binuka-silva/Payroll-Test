import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import PayItemGroupDetailsList from "./PayItemGroupDetailsList";
import {FormLabel} from "react-bootstrap";
import {connect, useSelector} from "react-redux";
import GullLoadable from "../../../../@gull/components/GullLoadable/GullLoadable";
import {setPayItemGroupDetails} from "../../../redux/actions/PayItemGroupActions";
import payItemGroupDetailsService from "../../../api/payItemGroupServices/payItemGroupDetailsService";
import payItemService from "../../../api/payItemServices/payItemService";
import {NotificationManager} from "react-notifications";
import payItemGroupService from "../../../api/payItemGroupServices/payItemGroupService";
import {NOTIFICATION_ERROR} from "../../../common/notifications";
import {RESP_STATUS_CODES} from "../../../common/response";
import history from "../../../../@history";
import Tooltip from "@material-ui/core/Tooltip";
import SaveIcon from "@mui/icons-material/Save";


const PayItemGroupDetails = ({setPayItemGroupDetails}) => {
    const [payItemGroupDetailsList, setPayItemGroupDetailsList] = useState([]);
    const [payItemGroupId, setPayItemGroupId] = useState("");
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [payItemData, setPayItemData] = useState([]);
    const [arithmeticSigns, setArithmeticSigns] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const [updateBtn, setUpdateBtn] = useState(false);

    const payItemGroup = useSelector(
        (state) => state.payItemGroup
    );

    //Component did mount only
    useEffect(() => {
        window.scrollTo(0, 0);

        // Clear all notifications
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));

        fetchSigns();
        fetchPayItemData();

        setPayItemGroupId(payItemGroup.id);
        setCode(payItemGroup.code);
        setName(payItemGroup.name);
        setDescription(payItemGroup.description);

        payItemGroup.id && setUpdateBtn(true);
        return () => {
            setPayItemGroupDetails({
                code: "",
                name: "",
                description: "",
                id: "",
            });
        };
    }, []);

    useEffect(() => {
        payItemGroup.id && fetchPayItemGroupDetails();
    }, [arithmeticSigns]);

    const fetchPayItemGroupDetails = async () => {
        setLoading(true);
        await payItemGroupDetailsService()
            .findAllByGroupId(payItemGroup.id)
            .then(({data}) => {
                data = data.map(detail => ({
                    id: detail.id,
                    createdBy: detail.createdBy,
                    arithmeticalSign: arithmeticSigns.find(sign => sign.value === detail.arithmaticSign)?.label,
                    payItem: detail?.payItem?.code,
                    payItemName: detail?.payItem?.name,
                    description: detail.description
                }));
                setPayItemGroupDetailsList(data);
            })
        setLoading(false);
    };

    const fetchSigns = async () => {
        setLoading(true);
        payItemGroupDetailsService()
            .getSigns()
            .then(async (response) => {
                let signsDataArray = [];
                response.data.forEach((item) => {
                    signsDataArray.push({value: item.code, label: item.sign});
                });
                setArithmeticSigns(signsDataArray);
            });
        setLoading(false);
    }

    const fetchPayItemData = async () => {
        setLoading(true);
        await payItemService()
            .getAllNames()
            .then(({data}) => {
                data = data.map(payItem => ({
                    value: payItem.id,
                    label: payItem.code,
                    name: payItem.name
                }));
                setPayItemData(data);
            })
        setLoading(false);
    };

    // //Fetch table data
    const fetchPayItemPeriodDetailsData = () => {

    };

    const onSave = () =>
        new Promise((resolve, reject) => {
            history.push("/pay-item-groups");
        });

    const onSubmit = async () => {
        try {
            if (!(code && name && payItemGroupDetailsList.length !== 0)) return NotificationManager.error(
                "Add Required Details",
                "Error"
            );

            const payItemGroupDetails = payItemGroupDetailsList.map(detail => ({
                description: detail.description ?? "",
                arithmaticSign: parseInt(arithmeticSigns.find(sign => sign.label === detail.arithmeticalSign)?.value),
                payItemId: payItemData.find(item => item.label === detail.payItem)?.value,
                payItem: {id: payItemData.find(item => item.label === detail.payItem)?.value, code: "", name: ""},
            }));

            await payItemGroupService().create({code, name, description, payItemGroupDetails});
            NotificationManager.success(
                "The Record has been successfully created",
                "Success"
            );

            setCode("");
            setName("");
            setDescription("");
            setPayItemGroupDetailsList([]);
            onSave();

        } catch (e) {
            console.error(e);
            if (e.status === RESP_STATUS_CODES.FORBIDDEN || e.status === RESP_STATUS_CODES.UNAUTHORIZED) {
                NotificationManager.error(NOTIFICATION_ERROR.AUTH_FAILED, e.statusText);
            } else {
                NotificationManager.error(
                    "Save Failed",
                    "Error"
                );
            }
        }
    }

    const onUpdate = async () => {
        try {
            if (!(code && name && payItemGroupDetailsList.length !== 0)) return NotificationManager.error(
                "Code & Name must be Add",
                "Error"
            );

            const payItemGroupDetails = payItemGroupDetailsList.map(detail => ({
                id: detail.id,
                description: detail.description ?? "",
                arithmaticSign: parseInt(arithmeticSigns.find(sign => sign.label === detail.arithmeticalSign)?.value),
                payItemId: payItemData.find(item => item.label === detail.payItem)?.value
            }));

            await payItemGroupService().update({id: payItemGroupId, code, name, description, payItemGroupDetails});

            NotificationManager.success(
                "The Record has been successfully Updated",
                "Success"
            );

            setCode("");
            setName("");
            setDescription("");
            setPayItemGroupDetailsList([]);
            setUpdateBtn(false);
            onSave();

        } catch (e) {
            console.error(e);
            if (e.status === RESP_STATUS_CODES.FORBIDDEN || e.status === RESP_STATUS_CODES.UNAUTHORIZED) {
                NotificationManager.error(NOTIFICATION_ERROR.AUTH_FAILED, e.statusText);
            } else {
                NotificationManager.error(
                    "Update Failed",
                    "Error"
                );
            }
        }
    }

    return (
        <>
            {isLoading && (
                <div className="overlay">
                    <GullLoadable/>
                </div>
            )}
            <div className="row">
                <div className="col-md-12 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Dashboard", path: "/dashboard/v1/"},
                            {name: "Pay Item Group", path: "/pay-item-groups/"},
                            {name: "Pay Item Group Details"},
                        ]}
                    ></Breadcrumb>
                </div>
            </div>
            <div className="row justify-content-start">
                <div className="col-md-8 row">
                    <div className="col-md-4">
                        <FormLabel>Group Code</FormLabel>
                        <input
                            className="form-control"
                            type="text"
                            value={code ?? ""}
                            onChange={(v) => setCode(v.target.value)}
                        ></input>
                    </div>

                    <div className="col-md-4">
                        <FormLabel>Group Name</FormLabel>
                        <input
                            className="form-control"
                            type="text"
                            value={name ?? ""}
                            onChange={(v) => setName(v.target.value)}
                        ></input>
                    </div>

                    <div className="col-md-4 ">
                        <FormLabel>Description</FormLabel>
                        <input
                            className="form-control"
                            type="text"
                            value={description ?? ""}
                            onChange={(v) => setDescription(v.target.value)}
                        ></input>
                    </div>
                </div>

                <div className="col-md-4 mt-4 d-flex justify-content-start">
                    {updateBtn ? (
                        <div className="mt-2">
                            <Tooltip title="Update All" placement="bottom">
                                <SaveIcon
                                    sx={{color: "#0A7373"}}
                                    type="submit"
                                    onClick={onUpdate}
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
                                />
                            </Tooltip>
                        </div>
                    )}
                </div>
            </div>

            <br/>
            <br/>
            <div className="row">
                <PayItemGroupDetailsList
                    fetchPayItemPeriodDetailsDataFunc={fetchPayItemPeriodDetailsData}
                    payItemData={payItemData}
                    setPayItemData={setPayItemData}
                    arithmeticSigns={arithmeticSigns}
                    setArithmeticSigns={setArithmeticSigns}
                    payItemGroupDetailsList={payItemGroupDetailsList}
                    setPayItemGroupDetailsList={setPayItemGroupDetailsList}
                    payItemGroupId={payItemGroupId}
                    isLoading={isLoading}
                    payItemGroup={payItemGroup}
                />
            </div>
            <NotificationContainer/>
        </>
    );
};

const mapStateToProps = (state) => ({
    setPayItemGroupDetails: state.setPayItemGroupDetails,
});

export default connect(mapStateToProps, {
    setPayItemGroupDetails,
})(PayItemGroupDetails);
