import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import UsersList from "./UsersList";
import userService from "../../api/userServices/userService";
import NotificationContainer from "react-notifications/lib/NotificationContainer";

const Users = () => {
    const [isLoading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getAllUsers();
    }, []);

    const getAllUsers = () => {
        setLoading(true);
        userService().getAllUsers().then(({data}) => {
            data = data.map(userData => ({
                id: userData.id,
                userEmail: userData.email,
                name: userData.name ?? "",
                designation: userData.designation ?? "",
                department: userData.department ?? "",
                userRole: userData.userRoles[0].name,
                activeStatus: userData.isActive,
                validFrom: userData.startDate.replaceAll("-", "/").split("T")[0],
                validTo: userData.endDate.replaceAll("-", "/").split("T")[0],
            }));
            setUsers(data);
            setLoading(false);
        }).catch(r => {
            setLoading(false);
            console.error(r);
        });
    }

    return (
        <>
            <div className="row">
                <div className="col-md-12 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Dashboard", path: "/dashboard/v1/"},
                            {name: "User"},
                        ]}
                    ></Breadcrumb>
                </div>
            </div>
            <div className="row">
                <UsersList
                    fetchUserList={getAllUsers}
                    userList={users}
                    isLoading={isLoading}
                />
            </div>
            <NotificationContainer/>
        </>
    );
}

export default Users;
