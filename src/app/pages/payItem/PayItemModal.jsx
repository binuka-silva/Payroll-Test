import React, {Fragment, useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";

const PayItemModal = ({glCode, setGlCode, fetchProcessPeriodDataFunc, show, setShow, ...props}) => {
    const [intGlCode, setIntGlCode] = useState("");
    const [edit, setEdit] = useState(false);

    const handleClose = () => {
        setShow(false);
    };

    useEffect(() => {
        setIntGlCode(glCode);
    }, [glCode]);

    return (
        <Fragment>
            <Modal show={show} onHide={handleClose} {...props}>
                <Modal.Header closeButton>
                    <Modal.Title>Other Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <label htmlFor="validationCustom202">GL Code</label>
                            <input
                                type="text"
                                className="form-control"
                                id="validationCustom202"
                                placeholder="GL Code"
                                name="code"
                                value={intGlCode}
                                readOnly={!edit}
                                onChange={(e) => setIntGlCode(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={(e) => setEdit(true)}>
                        Edit
                    </Button>
                    <Button variant="primary" type="submit" onClick={() => edit && setGlCode(intGlCode)}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default PayItemModal;
