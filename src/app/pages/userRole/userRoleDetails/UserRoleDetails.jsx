import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import UserRoleDetailList from "./UserRoleDetailList";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import {useSelector} from "react-redux";
import {Button, FormLabel} from "react-bootstrap";
import userRolesService from "../../../api/userRolesServices/userRoleService";
import {CRUDs, labels, pages} from "./constant";
import {NotificationManager} from "react-notifications";
import history from "../../../../@history";
import {NOTIFICATION_ERROR} from "../../../common/notifications";
import {RESP_STATUS_CODES} from "../../../common/response";
import GullLoadable from "../../../../@gull/components/GullLoadable/GullLoadable";
import localStorageService from "../../../services/localStorageService";


const UserRoleDetails = () => {
    const [tableData, setTableData] = useState([]);
    const [navData, setNavData] = useState([]);
    const [permissionData, setPermissionData] = useState([]);
    const [payrollData, setPayrollData] = useState([]);
    const [selectedPayrolls, setSelectedPayrolls] = useState([]);
    const [selectedReports, setSelectedReports] = useState([]);
    const [reportsData, setReportsData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const userRole = useSelector((state) => state.userRole);

    const [labelList, setLabelList] = useState([]);
    const [userLabels, setUserLabels] = useState([]);

    useEffect(() => {
        //Todo: window.location.path to path filter
        setLabelList(
            localStorageService
                .getItem("label_list")
                ?.filter((list) => list.permissionPage.path === "/user-roles")
        );
        setUserLabels(localStorageService.getItem("auth_user")?.labels);
    }, []);

    useEffect(() => {
        setLoading(true);
        // Clear all notifications
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        const navPages = userRole?.pages?.map(list => list.page?.navLevelPath?.split("/")[0]).filter(nav => nav !== undefined);

        const permissions = userRole?.pages?.map(list => ({
            pageId: list.pageId,
            permission: list.page.name,
            category: navPages.find(p => p === list.page?.navLevelPath?.split("/")[0])
                ?? (Object.values(pages.payrollPages).map(p => p.toLowerCase()).includes(list.pageId) ? "Payroll" : ""),
            read: list.read,
            write: list.write,
            update: list.update,
            delete: list.delete,
        }));
        setTableData(permissions);
        setNavData(navPages)

        userRolesService().getAllPages().then(({data}) => {
            setPermissionData(data.permissionPages.map(d => ({
                value: d.id,
                label: d.name,
                title: d.navLevelPath?.split("/")[0]
                    ?? (Object.values(pages.payrollPages).map(p => p.toLowerCase()).includes(d.id) ? "Payroll" : ""),
            })).filter(d => d.title !== undefined));
            const tempPayroll = [];
            setPayrollData(data.payrolls.map(d => {
                userRole.payrolls.find(payroll => payroll.id === d.id) && tempPayroll.push(d.id);
                return {
                    id: d.id,
                    name: d.name,
                }
            }));

            const tempReport = [];
            setReportsData(data.reports.map(d => {
                userRole.hiddenReports.find(report => report.id === d.id) && tempReport.push(d.id);
                return {
                    id: d.id,
                    name: d.name,
                }
            }));

            setSelectedPayrolls([...selectedPayrolls, ...tempPayroll]);
            setSelectedReports([...selectedReports, ...tempReport]);
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            console.error(err);
        });
    }, []);

    const onPayrollChange = (e) => {
        if (e.target.checked) {
            setSelectedPayrolls([...selectedPayrolls, e.target.id])
        } else {
            setSelectedPayrolls(selectedPayrolls.filter(id => id !== e.target.id));
        }
    }

    const onReportChange = (e) => {
        if (e.target.checked) {
            setSelectedReports([...selectedReports, e.target.id])
        } else {
            setSelectedReports(selectedReports.filter(id => id !== e.target.id));
        }
    }

    const onSubmit = async () => {
        try {
            const pages = tableData.filter(d => d.pageId).map(data => ({
                id: data.pageId,
                PermissionCruds: [data.read && CRUDs.READ, data.write && CRUDs.WRITE, data.update && CRUDs.UPDATE, data.delete && CRUDs.DELETE].filter(d => d !== undefined)
            }));

            const reqData = {pages};
            reqData.payrolls = selectedPayrolls;
            reqData.reports = selectedReports;
            const res = await userRolesService().changePermissions(userRole.id, reqData);
            NotificationManager.success(
                "The Permissions has been successfully updated",
                "Success"
            );
            res.status === 200 && history.push("/user-roles");
        } catch (e) {
            console.error(e);
            if (e.status === RESP_STATUS_CODES.FORBIDDEN || e.status === RESP_STATUS_CODES.UNAUTHORIZED) {
                NotificationManager.error(NOTIFICATION_ERROR.AUTH_FAILED, e.statusText);
            } else {
                NotificationManager.error(
                    "Saving Failed",
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
                            {name: "User Roles", path: "/user-roles"},
                            {name: "User Role Details"},
                        ]}
                    ></Breadcrumb>
                </div>
            </div>
            <div className="row row-xs mb-3">
                <div className="col-md-2">
                    <FormLabel>
                        {userLabels.find(
                                (label) => label.labelId === labels.userRole.toLowerCase()
                            )?.editedLabel ??
                            labelList.find(
                                (label) => label.labelId === labels.userRole.toLowerCase()
                            )?.label}
                        :
                    </FormLabel>
                    <input
                        type="text"
                        className="form-control"
                        value={userRole.role ?? ""}
                        readOnly={true}
                    />
                </div>
                <div className="col" style={{marginTop: "29px"}}>
                    <Button variant="primary" type="submit" onClick={onSubmit}>
                        Save
                    </Button>
                </div>
            </div>
            <div className="d-flex flex-row gap-3 flex-wrap">
                <FormLabel>
                    {userLabels.find(
                            (label) => label.labelId === labels.payrolls.toLowerCase()
                        )?.editedLabel ??
                        labelList.find(
                            (label) => label.labelId === labels.payrolls.toLowerCase()
                        )?.label}
                    :
                </FormLabel>
                {payrollData.map((data) => (
                    <label className="checkbox checkbox-primary" key={data.id}>
                        <input
                            type="checkbox"
                            onChange={onPayrollChange}
                            id={data.id}
                            checked={
                                selectedPayrolls.find((payrollId) => payrollId === data.id) ??
                                ""
                            }
                        />
                        <span>{data.name}</span>
                        <span className="checkmark"></span>
                    </label>
                ))}
            </div>
            <div className="d-flex flex-row gap-3 flex-wrap">
                <FormLabel>
                    {userLabels.find(
                            (label) => label.labelId === labels.reports.toLowerCase()
                        )?.editedLabel ??
                        labelList.find(
                            (label) => label.labelId === labels.reports.toLowerCase()
                        )?.label}
                    :
                </FormLabel>
                {reportsData.map((data) => (
                    <label className="checkbox checkbox-primary" key={data.id}>
                        <input
                            type="checkbox"
                            onChange={onReportChange}
                            id={data.id}
                            checked={
                                selectedReports.find((reportId) => reportId === data.id) ??
                                ""
                            }
                        />
                        <span>{data.name}</span>
                        <span className="checkmark"></span>
                    </label>
                ))}
            </div>
            <div className="row">
                <UserRoleDetailList
                    permissionDataList={permissionData}
                    tableDataList={tableData}
                    setTableDataList={setTableData}
                    navList={navData}
                />
            </div>
            <NotificationContainer/>
        </>
    );
};

export default UserRoleDetails;
