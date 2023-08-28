import React, {forwardRef, useEffect, useState} from "react";

import MaterialTable from "@material-table/core";

import AddBox from "@material-ui/icons/AddBox";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Edit from "@material-ui/icons/Edit";
import SaveAlt from "@material-ui/icons/SaveAlt";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Remove from "@material-ui/icons/Remove";
import ViewColumn from "@material-ui/icons/ViewColumn";
import {Search} from "@material-ui/icons";
import localStorageService from "../../../services/localStorageService";
import handlePageSize from "../../../common/tablePageSize";
import {NotificationManager} from "react-notifications";
import {payrollPeriodProcess} from "../../payrollProcessing/constant";
import {reportIdQuery, reportQuery, tokenQuery} from "./constant";
import {BASE_CRYSTAL_URL} from "../../../api/constants/apiConfigurations";
import {getCookie, setCookie} from "../../../common/cookieService";

const ReportsList = ({
                         tableData,
                         payroll, setLoading
                     }) => {
    //Table Columns
    const [columns, setColumns] = useState([]);

    //Table Columns
    useEffect(() => {
        NotificationManager.listNotify.forEach((n) =>
            NotificationManager.remove({id: n.id})
        );
        window.scrollTo(0, 0);
        setColumns([
            {
                title: "Id",
                field: "id",
                hidden: true,
            },
            {
                title: "Created Date Time",
                field: "createdDateTime",
                hidden: true,
            },
            {
                title: "Created By",
                field: "createdBy",
                hidden: true,
            },
            {
                title: "Report Code",
                field: "code",
            },
            {
                title: "Name",
                field: "name",
            },
            {
                title: "Report",
                field: "report",
            }
        ]);
    }, []);

    const tableIcons = {
        Add: forwardRef((props, ref) => <AddBox {...props} ref={ref}/>),
        Check: forwardRef((props, ref) => <Check {...props} ref={ref}/>),
        Clear: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
        Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref}/>),
        DetailPanel: forwardRef((props, ref) => (
            <ChevronRight {...props} ref={ref}/>
        )),
        Edit: forwardRef((props, ref) => <Edit {...props} ref={ref}/>),
        Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref}/>),
        Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref}/>),
        FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref}/>),
        LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref}/>),
        NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
        PreviousPage: forwardRef((props, ref) => (
            <ChevronLeft {...props} ref={ref}/>
        )),
        ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
        Search: forwardRef((props, ref) => <Search {...props} ref={ref}/>),
        SortArrow: forwardRef((props, ref) => (
            <ArrowDownward {...props} ref={ref}/>
        )),
        ThirdStateCheck: forwardRef((props, ref) => (
            <Remove {...props} ref={ref}/>
        )),
        ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref}/>),
    };

    const clickRow = (e, rowData) => new Promise( (resolve, reject) => {
        try {
            let link;
            const isLogged = getCookie("reportLoggedIn");
            if (isLogged) {
                link = `${BASE_CRYSTAL_URL}/report.aspx?${reportIdQuery}=${rowData.id}`
            } else {
                link = `${BASE_CRYSTAL_URL}/auth?${tokenQuery}=${localStorageService.getItem("jwt_token")}&${reportIdQuery}=${rowData.id}`
                setCookie("reportLoggedIn", true);
            }

            const element = document.createElement('a');
            element.setAttribute('href', link);
            element.setAttribute('target', "_blank");
            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();
            document.body.removeChild(element);
        } catch (e) {
            console.error(e);
        }
    });

    return (
        <>
            <MaterialTable
                icons={tableIcons}
                title={
                    <span>
            <strong>
              {
                  payroll?.payRollPeriod?.payRollPeriodDetails
                      ?.find((v) => v.periodProcess !== payrollPeriodProcess.CLOSE)
                      ?.dateFrom.split(" ")[0]
              }{" "}
                -{" "}
                {
                    payroll?.payRollPeriod?.payRollPeriodDetails
                        ?.find((v) => v.periodProcess !== payrollPeriodProcess.CLOSE)
                        ?.dateTo.split(" ")[0]
                }
            </strong>
          </span>}
                columns={columns}
                data={tableData}
                options={{
                    addRowPosition: "first",
                    actionsColumnIndex: -1,
                    filtering: true,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    pageSize:
                        JSON.parse(
                            localStorageService.getItem("auth_user")?.tablePageCount
                        )?.[window.location.pathname] ?? 5,
                }}
                onRowClick={clickRow}
                onRowsPerPageChange={(pageSize) =>
                    handlePageSize(pageSize, window.location.pathname)
                }
            />
        </>
    );
};

export default ReportsList;
