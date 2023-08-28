import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import * as yup from "yup";
import userRolesService from "../../../api/userRolesServices/userRoleService";
import UserRoleList from "./UserRoleList";
import NotificationContainer from "react-notifications/lib/NotificationContainer";

const userSchema = yup.object().shape({
    role: yup.string().required("Role is required"),
    description: yup.string().required("Description is required"),
});

const UserRoles = () => {
    const [isLoading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    useEffect(() => {
        getAllRoles();
    }, []);

    const getAllRoles = () => {
        setLoading(true);
        userRolesService()
            .getAllRoles()
            .then(({data}) => {
                data = data.map((role) => {
                    let pages = "";
                    let payrolls = ""
                    role.pages?.length > 0 && (pages += role.pages
                        ?.map((list) => list.page.name)
                        .reduce((preValue, newValue) => `${preValue}, ${newValue}`, "")
                        .slice(2));
                    role.payrollDefinitions?.length > 0 && (payrolls += role.payrollDefinitions
                        .map((payroll) => payroll.code)
                        .reduce((preValue, newValue) => `${preValue}, ${newValue}`, "")
                        .slice(2));
                    const newRole = {
                        id: role.id,
                        role: role.normalizedName,
                        description: role.description ?? "",
                        modifiedDateTime: role.modifiedDateTime,
                        modifiedBy: role.modifiedBy?.email,
                        hiddenPages: role.pages,
                        hiddenPayrolls: role.payrollDefinitions,
                        hiddenReports: role.reports,
                        pages, payrolls
                    };

                    const permissionsArray = [];
                    permissionsArray.push(...role.pages.map((p) => ({
                        role: role.id,
                        key: p.code,
                        cat: p.id,
                    })));
                    permissionsArray.push(...role.payrollDefinitions.map((p) => ({
                        role: role.id,
                        key: p.code,
                        cat: p.id,
                    })))

                    setSelectedPermissions(permissionsArray);

                    setLoading(false);
                    return newRole;
                });
                setRoles(data);
            })
            .catch((e) => {
                setLoading(false);
                console.error(e);
            });
    };

    return (
        <>
            <div className="row">
                <div className="col-md-12 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Dashboard", path: "/dashboard/v1/"},
                            {name: "User Roles"},
                        ]}
                    ></Breadcrumb>
                </div>
            </div>

            <div className="row">
                <UserRoleList
                    roleList={roles}
                    fetchRoleList={getAllRoles}
                    isLoading={isLoading}
                />
            </div>
            <NotificationContainer/>
        </>
    );
};

export default UserRoles;
