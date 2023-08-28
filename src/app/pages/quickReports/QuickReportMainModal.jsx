import React, {Fragment, useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";

import {NotificationManager} from "react-notifications";
import quickReportsService from "../../api/quickReportsServices/quickReportsService.js";

const QuickReportMainModal = ({
                                  fetchReportDataFunc,
                                  payroll,
                                  QuickReportTableData,
                                  editData,
                                  calculationTableData,
                                  show,
                                  setShow,
                                  setLoading,
                                  handleError,
                                  editModal,
                                  isRowClick,
                                  ...props
                              }) => {
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [header, setHeader] = useState("");
    const [query, setQuery] = useState("");
    const [description, setDescription] = useState("");

    const handleClose = () => {
        setCode("");
        setName("");
        setHeader("");
        setQuery("");
        setDescription("");
        setShow(false);
    };

    useEffect(() => {
        setCode(editData?.code);
        setName(editData?.name);
        setHeader(editData?.header);
        setQuery(editData?.query);
        setDescription(editData?.description);
    }, [editData]);

    useEffect(() => {
        // Clear all notifications
        NotificationManager.listNotify.forEach((n) =>
            NotificationManager.remove({id: n.id})
        );
    }, []);

    const handleSubmit = () => {
        new Promise(async (resolve, reject) => {
            setLoading(true);
            const data = {
                code: code,
                name: name,
                header: header,
                query: query,
                description: description,
            };

            quickReportsService()
                .create(data)
                .then((response) => {
                    setLoading(false);
                    NotificationManager.success(
                        "A record was successfully created",
                        "Success"
                    );
                    //Reload list
                    fetchReportDataFunc();
                    resolve();
                })
                .catch((error) => {
                    handleError(error);
                    setLoading(false);
                    reject();
                });
        });
    };

    const handleUpdate = () => {
        new Promise((resolve, reject) => {
            setLoading(true);
            const data = {
                code: code,
                name: name,
                header: header,
                query: query,
                description: description,
            };

            quickReportsService()
                .update(editData.id, data)
                .then((response) => {
                    setLoading(false);
                    NotificationManager.success(
                        "A record was successfully created",
                        "Success"
                    );
                    //Reload list
                    fetchReportDataFunc();
                    resolve();
                })
                .catch((error) => {
                    setLoading(false);
                    handleError(error);
                    reject();
                });
        });
    };

    return (
        <Fragment>
            <Modal show={show} onHide={handleClose} {...props}>
                <Modal.Header closeButton>
                    {editData ? (
                        <Modal.Title>Update</Modal.Title>
                    ) : (
                        <Modal.Title>Add</Modal.Title>
                    )}
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="row m-0">
                            <div className="col-md-6 mb-3">
                                <label>Query Code</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={code ?? ""}
                                    onChange={(e) => setCode(e.target.value)}
                                    readOnly={isRowClick}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={name ?? ""}
                                    onChange={(e) => setName(e.target.value)}
                                    readOnly={isRowClick}
                                />
                            </div>
                        </div>
                        <div className="row m-0">
                            <div className="col-md-6 mb-3 ">
                                <label>Header</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={header ?? ""}
                                    onChange={(e) => setHeader(e.target.value)}
                                    readOnly={isRowClick}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="validationCustom03">Description</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={description ?? ""}
                                    onChange={(e) => setDescription(e.target.value)}
                                    readOnly={isRowClick}
                                />
                            </div>
                        </div>
                        <div className="row m-0">
                            <div className="col-md-12 mb-3">
                                <label htmlFor="validationCustom03">Query</label>
                                <textarea
                                    rows="10"
                                    className="form-control"
                                    value={query ?? ""}
                                    onChange={(e) => setQuery(e.target.value)}
                                    readOnly={isRowClick}
                                />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    {editData ? (
                        <Button variant="primary" type="submit" onClick={handleUpdate}>
                            Update
                        </Button>
                    ) : (
                        <Button variant="primary" type="submit" onClick={handleSubmit}>
                            Save Changes
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default QuickReportMainModal;
