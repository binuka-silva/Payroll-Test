import React, {Fragment, useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import {Formik} from "formik";
import * as yup from "yup";
import {classList} from "@utils";
import {NotificationManager,} from "react-notifications";
import bankService from "../../api/bankServices/bankService";

const BankModal = ({fetchBankDataFunc, ...props}) => {

    useEffect(() => {
        // Clear all notifications
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
    }, []);

    const [show, setShow] = useState(false);
    const initFormState = {
        code: "",
        name: "",
        address: "",
    };
    const [formState, setState] = useState(initFormState);

    const bankFormSchema = yup.object().shape({
        code: yup.string().required("Code field is required"),
        name: yup.string().required("Name filed is required"),
        address: yup.string().required("Address filed is required"),
    });

    const handleClose = () => {
        setShow(false);
    };

    const handleSubmit = async (values) => new Promise(async (resolve, reject) => {

        //Obj Create
        let bank = {
            "code": values.code,
            "name": values.name,
            "address": values.address,
            "isActive": true,
            "createdDateTime": new Date(),
            "createdBy": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        }

        bankService().create(bank).then(async (response) => {
            NotificationManager.success("A record was successfully created", "Success");
            //Reload list
            fetchBankDataFunc();
            resolve();
        }).catch(error => {
            if (error.statusCode === 409) {
                NotificationManager.error(error.message, "Error");
            }
            reject();
            throw new Error("An error occurred when attempting to add a record !");
        });
    })

    return (
        <Fragment>
            <Button className="text-capitalize" onClick={() => setShow(true)}>
                {"Add"}
            </Button>

            <Modal show={show} onHide={handleClose} {...props}>
                <Formik
                    initialValues={formState}
                    validationSchema={bankFormSchema}
                    onSubmit={handleSubmit}
                >
                    {({
                          values,
                          errors,
                          touched,
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          isSubmitting,
                      }) => {
                        return (
                            <form
                                className="needs-validation"
                                onSubmit={handleSubmit}
                                noValidate>
                                <Modal.Header closeButton>
                                    <Modal.Title>Add</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="row">
                                        <div
                                            className={classList({
                                                "col-md-12 mb-3": true,
                                                "valid-field":
                                                    !errors.code && touched.code,
                                                "invalid-field":
                                                    errors.code && touched.code,
                                            })}
                                        >
                                            <label htmlFor="validationCustom202">
                                                Code
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="validationCustom202"
                                                placeholder="EmployeeTemplateDetails code"
                                                name="code"
                                                value={values.code}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                            />
                                            <div className="invalid-feedback">
                                                Code is required
                                            </div>
                                        </div>
                                        <div
                                            className={classList({
                                                "col-md-12 mb-3": true,
                                                "valid-field":
                                                    touched.name && !errors.name,
                                                "invalid-field":
                                                    touched.name && errors.name,
                                            })}
                                        >
                                            <label htmlFor="validationCustom222">
                                                EmployeeTemplateDetails name
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="validationCustom222"
                                                placeholder="EmployeeTemplateDetails name"
                                                value={values.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                name="name"
                                                required
                                            />
                                            <div className="invalid-feedback">
                                                EmployeeTemplateDetails name is required
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div
                                            className={classList({
                                                "col-md-12 mb-3": true,
                                                "valid-field": touched.address && !errors.address,
                                                "invalid-field": touched.address && errors.address,
                                            })}
                                        >
                                            <label htmlFor="validationCustom03">
                                                Address
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="validationCustom03"
                                                placeholder="EmployeeTemplateDetails address"
                                                name="address"
                                                value={values.address}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                            />
                                            <div className="invalid-feedback">
                                                EmployeeTemplateDetails address is required.
                                            </div>
                                        </div>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Close
                                    </Button>
                                    <Button variant="primary" name="submit">
                                        Save Changes
                                    </Button>
                                </Modal.Footer>
                            </form>
                        );
                    }}
                </Formik>
            </Modal>
        </Fragment>
    );
};

export default BankModal;
