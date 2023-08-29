import React, {useEffect, useState} from "react";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import EmployeeTemplateDetailsList from "./EmployeeTemplateDetailsList";
import {Button, FormLabel} from "react-bootstrap";
import employeeDetailTemplateService from "../../../api/employeeTemplateServices/employeeTemplateDetailService";
import {connect, useSelector} from "react-redux";
import {NotificationManager} from "react-notifications";
import GullLoadable from "../../../../@gull/components/GullLoadable/GullLoadable";
import {setEmployeeTemplateDetails} from "../../../redux/actions/EmployeeTemplateActions";
import EmployeeDetailsSelectedList from "./EmployeeDetailsSelectedList";
import history from "../../../../@history";
import SelectedEmployeesList from "./SelectedEmployeeList";
import {NOTIFICATION_ERROR} from "../../../common/notifications";
import {RESP_STATUS_CODES} from "../../../common/response";
import {labels} from "./constant";
import localStorageService from "../../../services/localStorageService";
import {NavLink} from "react-router-dom";
import {Breadcrumb} from "@gull";
import Tooltip from "@material-ui/core/Tooltip";
import SaveIcon from "@mui/icons-material/Save";

const EmployeeTemplateDetails = ({setEmployeeTemplateDetails}) => {
    const [templateList, setTemplateList] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [criteriaList, setCriteriaList] = useState([]);
    const [templateCode, setTemplateCode] = useState("");
    const [templateName, setTemplateName] = useState("");
    const [updateBtn, setUpdateBtn] = useState(false);
    const [saveBtn, setSaveBtn] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [isEmployeeLoading, setEmployeeLoading] = useState(false);
    const [detailList, setDetailList] = useState([]);
    const employeeTemplate = useSelector((state) => state.employeeTemplate);
    const [templateData, setTemplateData] = useState({});

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
        setTemplateCode(employeeTemplate.code ?? "");
        setTemplateName(employeeTemplate.name ?? "");
        setTemplateData({details: []});
        if (employeeTemplate.details) {
            const criteriaIds = employeeTemplate.details.map((d) => d.criteria);
            const uniqueIds = [...new Set(criteriaIds)];
            fetchCriteria(uniqueIds);
            fetchSelectedCriteria(uniqueIds);
            setUpdateBtn(true);
        } else {
            fetchCriteria([]);
        }

        return () => {
            setEmployeeTemplateDetails({details: null, name: "", code: "", id: ""});
        };
    }, []);

    const setSavedData = () => {
    };

    /*    useEffect(() => {
           
          console.log(detailList);
      },[detailList]);

      useEffect(() => {

      },[criteriaList]);*/

    //Fetch table data
    const fetchCriteria = async (id) => {
        try {
            const {data} =
                await employeeDetailTemplateService().getAllEmployeeCriteria();
            setTemplateList(
                data.map((c) => {
                    if (id.length > 0) {
                        const selected = id.find((i) => i === c.id);
                        if (selected) {
                            return {
                                id: c.id,
                                criteria: c.name,
                                tableData: {
                                    checked: true,
                                },
                            };
                        } else {
                            return {
                                id: c.id,
                                criteria: c.name,
                            };
                        }
                    } else {
                        return {
                            id: c.id,
                            criteria: c.name,
                        };
                    }
                })
            );
        } catch (e) {
            console.error(e);
        }
    };

    const fetchSelectedCriteria = async (id) => {
        try {
            setLoading(true);
            const {data} =
                await employeeDetailTemplateService().getSelectedCriteria(id);
            const selectedValue = [];
            let x = [];
            let y = [];
            const selected = data.map((c) => {
                x = c.details.map((v) => {
                    const selected1 = employeeTemplate.details.find(
                        (d) => d.selection === v.id.toString()
                    );
                    if (selected1) {
                        const detail = {
                            id: v.id,
                            name: v.name,
                            pid: c.id,
                            isChecked: true,
                        };
                        y.push({
                            criteria: detail.pid,
                            selection: detail.id,
                            isChecked: true,
                        });
                        return detail;
                    } else {
                        return {
                            id: v.id,
                            name: v.name,
                            pid: c.id,
                        };
                    }
                });
                selectedValue.push(...x);
                return {
                    id: c.id,
                    name: c.name,
                    hasChild: true,
                };
            });
            setDetailList(y);
            setCriteriaList([...selected, ...selectedValue]);
            data && setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
            NotificationManager.error("Error Fetching Data", "Error");
        }
    };

    const setCriteriaDetails = (data) => {
        setLoading(true);

        const selectedType = {};
        const selectedDetails = data[0].details.map((d) => ({
            ...d,
            pid: data[0].id,
            name: d.name,
        }));
        selectedType.id = data[0].id;
        selectedType.name = data[0].name;
        selectedType.hasChild = true;
        selectedType.isChecked = false;

        const newCriteria = criteriaList.map((c) => {
            if (detailList.find((d) => d.selection === c.id)) {
                return {...c, isChecked: true};
            } else {
                return {...c, isChecked: false};
            }
        });

        setCriteriaList([...newCriteria, selectedType, ...selectedDetails]);

        setLoading(false);
    };

    const onSelectionChange = async (e) => {
        try {
            /*if (e.length < criteriaList.filter(c => c.hasChild).length) {
                      const newCriteria = [];
                      const newDetail = [];
                     

                      e.forEach(d => {
                          let filter1 = _.filter(criteriaList , (c) => {
                              // { id: d.id, pid: d.id}
                              return c.id === d.id || c.pid === d.id;
                          });
                          newCriteria.push(...filter1);
                          // newCriteria.push(...criteriaList.filter(c => c.id === d.id || c.pid === d.id));
                          // updateBtn && newDetail.push(...criteriaList.filter(c => c.id === d.id || d.id === c.pid).map(d => ({criteria: d.pid, selection: d.id, isChecked: true})));
                      });
                      // updateBtn && setDetailList(newDetail);
                      setCriteriaList(prevMovies => ([...newCriteria]));
                      return;
                  }*/

            setLoading(true);
            const employeeType = e.find((c) => c.id === "EmploymentType");
            const employeeCat = e.find((c) => c.id === "EmpCatName");
            const employeeCompany = e.find((c) => c.id === "CompanyId");
            const employeeDesignation = e.find((c) => c.id === "PosCode");
            const employeeStatus = e.find((c) => c.id === "EmployeeStatus");
            const wageClass = e.find((c) => c.id === "WageClass");

            if (
                employeeType &&
                !criteriaList.find((c) => c.id === "EmploymentType")
            ) {
                const {data} =
                    await employeeDetailTemplateService().getAllEmployeeTypes();
                setCriteriaDetails(data);
            }

            if (employeeCat && !criteriaList.find((c) => c.id === "EmpCatName")) {
                const {data} =
                    await employeeDetailTemplateService().getAllEmployeeCategory();
                setCriteriaDetails(data);
            }

            if (employeeCompany && !criteriaList.find((c) => c.id === "CompanyId")) {
                const {data} =
                    await employeeDetailTemplateService().getAllEmployeeCompany();
                setCriteriaDetails(data);
            }

            if (
                employeeDesignation &&
                !criteriaList.find((c) => c.id === "PosCode")
            ) {
                const {data} =
                    await employeeDetailTemplateService().getAllDesignation();
                setCriteriaDetails(data);
            }

            if (
                employeeStatus &&
                !criteriaList.find((c) => c.id === "EmployeeStatus")
            ) {
                const {data} =
                    await employeeDetailTemplateService().getAllEmployeeStatus();
                setCriteriaDetails(data);
            }

            if (wageClass && !criteriaList.find((c) => c.id === "WageClass")) {
                const {data} =
                    await employeeDetailTemplateService().getAllWageClass();
                setCriteriaDetails(data);
            }
        } catch (e) {
            setLoading(false);
            NotificationManager.error(e.response.data.detail, "Error");
            console.error(e);
        }
    };

    const onSelectedCriteriaSelectionChange = (e) => {
        const remove = e.data.filter((d) => d.isChecked === "false")[0];
        if (remove) {
            remove.hasChildren
                ? setDetailList(detailList.filter((c) => c.criteria !== remove.id))
                : setDetailList(detailList.filter((c) => c.selection !== remove.id));
        } else {
            setDetailList([
                ...detailList,
                ...e.data
                    .filter((d) => d.isChecked === "true")
                    .map((d) => ({
                        criteria: d.parentID,
                        selection: d.id,
                        isChecked: "true",
                    })),
            ]);
        }
    };

    const onUpdate = () => {
        if (templateName.length === 0 || templateCode.length === 0)
            return NotificationManager.error("Code or Name can't be empty", "Error");

        templateData.code = templateCode;
        templateData.name = templateName;
        templateData.details = detailList.filter(
            (d) => !("criteria" in d) || d.criteria !== null
        );
        const id = employeeTemplate.id;

        employeeDetailTemplateService()
            .updateTemplate(id, templateData)
            .then((r) => {
                setLoading(false);
                NotificationManager.success("successfully updated", "Success");
                setTemplateName("");
                setTemplateCode("");
                setCriteriaList([]);
                history.push("/employee-template");
            })
            .catch((e) => {
                setLoading(false);
                console.error(e);
                if (
                    e.status === RESP_STATUS_CODES.FORBIDDEN ||
                    e.status === RESP_STATUS_CODES.UNAUTHORIZED
                ) {
                    NotificationManager.error(
                        NOTIFICATION_ERROR.AUTH_FAILED,
                        e.statusText
                    );
                } else {
                    NotificationManager.error("Update Failed", "Error");
                }
            });
    };

    const onSubmit = () => {
        if (templateName.length === 0 || templateCode.length === 0)
            return NotificationManager.error("Code or Name can't be empty", "Error");

        setLoading(true);
        templateData.code = templateCode;
        templateData.name = templateName;
        templateData.details = detailList.filter((d) => d.criteria !== null);

        employeeDetailTemplateService()
            .saveTemplate(templateData)
            .then((r) => {
                setLoading(false);
                NotificationManager.success("successfully created", "Success");
                setTemplateName("");
                setTemplateCode("");
                setCriteriaList([]);
                history.push("/employee-template");
            })
            .catch((e) => {
                setLoading(false);
                console.error(e);
                if (
                    e.status === RESP_STATUS_CODES.FORBIDDEN ||
                    e.status === RESP_STATUS_CODES.UNAUTHORIZED
                ) {
                    NotificationManager.error(
                        NOTIFICATION_ERROR.AUTH_FAILED,
                        e.statusText
                    );
                } else {
                    NotificationManager.error("Failed to Save", "Error");
                }
            });
    };

    const onGetEmployees = async () => {
        try {
            setEmployeeLoading(true);
            templateData.details = detailList.filter(
                (d) => !("criteria" in d) || d.criteria !== null
            );
            const {data} =
                await employeeDetailTemplateService().getSelectedEmployees(
                    templateData.details.map((c) => {
                        delete c.isChecked;
                        return c;
                    })
                );
            data && setEmployeeLoading(false);
            setEmployeeList(data);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <>
            <div className="col-md-12 row">
                <div className="col-md-8 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Dashboard", path: "/dashboard/v1/"},
                            {name: "Employee Template", path: "/employee-template"},
                            {name: "Employee Template Details"},
                        ]}
                    />
                </div>
                <div className="col-md-1">
                    <div className="mt-2 d-flex justify-content-start">
                        <NavLink to={"/employees"}>
              <span className="capitalize text-muted">
                |&nbsp;Employee&nbsp;|
              </span>
                        </NavLink>
                    </div>
                </div>
                <div className="col-md-3 d-flex justify-content-end">
                    <div className="mt-2">
                        <Button
                            variant="primary"
                            type="submit"
                            onClick={onGetEmployees}
                            style={{marginRight: 20}}
                        >
                            Preview Employees
                        </Button>
                    </div>
                    <div className="ml-5">
                        {updateBtn ? (
                            <div className="mt-3">
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
                            <div className="mt-3">
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
            </div>
            <div className="row">
                {isLoading && (
                    <div className="overlay">
                        <GullLoadable/>
                    </div>
                )}

                <div className="row row-xs justify-content-start">
                    <div className="col-md-3">
                        <FormLabel>
                            {userLabels.find(
                                    (label) => label.labelId === labels.templateCode.toLowerCase()
                                )?.editedLabel ??
                                labelList.find(
                                    (label) => label.labelId === labels.templateCode.toLowerCase()
                                )?.label}
                        </FormLabel>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Template Code"
                            value={templateCode}
                            onChange={(e) => setTemplateCode(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3 mt-3 mt-md-0">
                        {/* <FormLabel>Template Name</FormLabel> */}
                        <FormLabel>
                            {userLabels.find(
                                    (label) => label.labelId === labels.templateName.toLowerCase()
                                )?.editedLabel ??
                                labelList.find(
                                    (label) => label.labelId === labels.templateName.toLowerCase()
                                )?.label}
                        </FormLabel>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Template Name"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                        />
                    </div>
                </div>
                <div className="custom-separator"></div>

                <div className="row">
                    <div className="col-lg-6">
                        <EmployeeTemplateDetailsList
                            fetchTemplateDataFunc={onSelectionChange}
                            templateList={templateList}
                        />
                    </div>
                    <div className="col">
                        <EmployeeDetailsSelectedList
                            criteriaList={criteriaList}
                            fetchCriteriaDataFunc={onSelectedCriteriaSelectionChange}
                        />
                        {/*<EmployeeTemplateDetailsCriteriaList templateList={criteriaList}
                                                                         fetchTemplateDataFunc={onSelectedCriteriaSelectionChange}/>*/}
                    </div>
                </div>
                <div className="custom-separator"></div>
                <div className="row">
                    <SelectedEmployeesList employeeList={employeeList} isLoading={isEmployeeLoading}/>
                </div>
            </div>

            <NotificationContainer/>
        </>
    );
};

const mapStateToProps = (state) => ({
    setEmployeeTemplateDetails: state.setEmployeeTemplateDetails,
});

export default connect(mapStateToProps, {
    setEmployeeTemplateDetails,
})(EmployeeTemplateDetails);
