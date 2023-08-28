import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import PageLabelConfigurationList from "./PageLabelConfigurationList";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import userRolesService from "../../api/userRolesServices/userRoleService";
import labelConfigurationService from "../../api/configurationServices/labelConfigurationService";
import {NotificationManager} from "react-notifications";
import {pages} from "./constant";

const PageLabelConfiguration = () => {
    const [permissionData, setPermissionData] = useState([]);
    const [labelConfigurationList, setLabelConfigurationList] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);

    //Component did mount only
    useEffect(() => {
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        window.scrollTo(0, 0);
        //Fetch table data
        fetchLabelConfigurationData();
        fetchPermissionData();
    }, []);

    const fetchLabelConfigurationData = () => {
        setLoading(true);
        labelConfigurationService()
            .getAll()
            .then(({data}) => {
                data = data.map((labelConfig) => ({
                    id: labelConfig?.id,
                    pageId: labelConfig?.permissionPageId,
                    category: labelConfig.permissionPage?.navLevelPath?.split("/")[0]
                        ?? (pages.advPayItemParaDetails.toLowerCase() === labelConfig.permissionPage?.id ? "Pay Items"
                            : pages.employeeTemplateDetails.toLowerCase() === labelConfig.permissionPage?.id ? "Employee"
                                : pages.payrollPeriodDetails.toLowerCase() === labelConfig.permissionPage?.id ? "Payroll Periods"
                                    : pages.taxDetails.toLowerCase() === labelConfig.permissionPage?.id ? "Payroll" : ""),
                    permissionPage: labelConfig.permissionPage?.name,
                    label: labelConfig.labelName,
                    modifiedLabel: labelConfig.editedLabel,
                }));
                setTableData(data);
                setLoading(false);
            }).catch(err => {
            console.error(err);
            NotificationManager.error("Data Fetch Failed", "Failed");
            setLoading(false);
        });
    };

    //Fetch table data
    const fetchPermissionData = () => {
        userRolesService()
            .getAllPages()
            .then((response) => {
                let pagesDataArray = [];
                response.data.forEach((item) => {
                    pagesDataArray.push({value: item.id, label: item.name});
                });
                setPermissionData(pagesDataArray);
            });
    };

    return (
        <>
            <div className="row">
                <div className="col-md-12 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Dashboard", path: "/dashboard/v1/"},
                            {name: "Page Label Configuration"},
                        ]}
                    ></Breadcrumb>
                </div>
            </div>

            {/* <div className="col-md-12 row d-flex justify-content-end">
        <div className="col-md-2 ">
          <FormLabel>Label Language</FormLabel>
          <FormSelect>
            <option>Select</option>
            <option>English</option>
            <option>Sinhala (සිංහල)</option>
            <option>Tamil (தமிழ்)</option>
            <option>Bangladesh (বাংলাদেশ)</option>
            <option>Spanish (española)</option>
          </FormSelect>
        </div>
      </div> */}

            <br></br>

            <div className="row">
                <PageLabelConfigurationList
                    permissionDataList={permissionData}
                    fetchLabelConfigurationDataFunc={fetchLabelConfigurationData}
                    labelConfigurationList={labelConfigurationList}
                    tableData={tableData}
                    loading={loading}
                />
            </div>
            <NotificationContainer/>
        </>
    );
};

export default PageLabelConfiguration;
