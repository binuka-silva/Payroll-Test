import React, {Fragment, useEffect, useState} from "react";
import {Modal} from "react-bootstrap";
import bankFileService from "../../api/bankDisketteServices/bankFileService";

const GenerateBankDisketteModal = ({payrollBankFile, show, setShow, processData, ...props}) => {
    const [empType, setEmpType] = useState("");
    const [employeeProcessData, setEmployeeProcessData] = useState([]);

    useEffect(() => {
        bankFileService().findOne(payrollBankFile.bankFile).then(({data}) => {
            console.log(data)
        }).catch(e => {
            console.error(e);
        });

    }, [payrollBankFile, processData]);

    const handleClose = () => {
        setShow(false);
    };

    return (
        <Fragment>
            <Modal show={show} onHide={handleClose} {...props} size="xl" scrollable={true}>
                <Modal.Header closeButton>
                    <Modal.Title><strong>{payrollBankFile.bankDisketteCode ?? "Code"} - {payrollBankFile.bankDisketteName ?? "Name"}</strong></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-12 mb-1">
                            <label htmlFor="validationCustom202"><strong>Type:&nbsp;&nbsp;</strong></label>
                            {empType}
                        </div>
                    </div>
                    {employeeProcessData.length > 0 && (<>
                        <div className="custom-separator"></div>
                        <h5><strong>Summary</strong></h5>
                    </>)}
                </Modal.Body>
            </Modal>
        </Fragment>
    );
};

export default GenerateBankDisketteModal;
