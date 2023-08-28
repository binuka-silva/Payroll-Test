import React, {Fragment} from "react";
import {Button, Modal} from "react-bootstrap";
import LoadingButton from "../../../../@gull/components/buttons/LoadingButton";

const ReportsModal = ({
                          show,
                          setShow,
                          payroll,
                          row,
                          runQuery,
                          params,
                          defaultParams,
                          paramsValue,
                          setParamsValue,
                          isLoading,
                          setLoading,
                          ...props
                      }) => {
    const handleClose = () => {
        setShow(false);
    };

    const handleTextOnChange = (param, value) => {
        const p = paramsValue.filter(p => p.param !== param);
        setParamsValue([...p, {param, value}])
    }

    return (
        <Fragment>
            <Modal size="sm" show={show} onHide={handleClose} {...props} scrollable={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Run Query</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {params.map(param => (
                        <div className="d-flex justify-content-center mb-3" key={param}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={param}
                                value={paramsValue.find(p => p.param === param)?.value ?? ""}
                                onChange={(e) => handleTextOnChange(param, e.target.value)}
                            />
                        </div>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    {isLoading ? (
                        <LoadingButton
                            className="text-capitalize m-1"
                            variant="primary"
                            loading={true}
                            animation="border"
                            spinnerSize="sm"
                        >
                            &nbsp;Run
                        </LoadingButton>
                    ) : (<Button variant="primary" onClick={() => runQuery(row, params, defaultParams)}>
                        Run
                    </Button>)}
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default ReportsModal;
