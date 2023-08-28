import React, {Fragment, useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";

const PayrollParameterModal = ({value, setValue, show, setShow, ...props}) => {
    const [intValue, setIntValue] = useState("");
    const [edit, setEdit] = useState(false);

    const handleClose = () => {
        setShow(false);
    };

    useEffect(() => {
        setIntValue(value);
    }, [value]);

    return (
        <Fragment>
            <Modal show={show} onHide={handleClose} {...props}>
                <Modal.Header closeButton>
                    <Modal.Title>Payroll Parameter Value</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <label htmlFor="validationCustom202">Value</label>
                            <input
                                type="text"
                                className="form-control"
                                id="validationCustom202"
                                placeholder="Value"
                                name="value"
                                value={intValue}
                                readOnly={!edit}
                                onChange={(e) => setIntValue(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={(e) => setEdit(true)}>
                        Edit
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={() => edit && setValue(intValue)}
                    >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default PayrollParameterModal;
