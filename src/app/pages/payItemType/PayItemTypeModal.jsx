import React, {Fragment, useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import {Formik} from "formik";
import * as yup from "yup";
import {classList} from "@utils";
import {NotificationManager} from "react-notifications";
import payItemTypeService from "../../api/payItemTypeServices/payItemTypeService";

const PayItemTypeModal = ({name, fetchPayItemTypeDataFunc, ...props}) => {

    useEffect(() => {
        // Clear all notifications
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
    }, []);

    const [show, setShow] = useState(false);
    const initFormState = {
        code: "",
        type: "",
        description: "",
    };
    const [formState, setState] = useState(initFormState);

    const payItemTypeFormSchema = yup.object().shape({
        code: yup.string().required("Code field is required"),
        type: yup.string().required("Type filed is required"),
        description: yup.string().required("Description filed is required"),
    });

    const handleClose = () => {
        setShow(false);
    };

    const handleSubmit = async (values, {setSubmitting}) => {
        let payItemType = {
            code: values.code,
            type: values.type,
            description: values.description,
            IsDelete: false,
            createdDateTime: new Date(),
            createdBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        };

        await payItemTypeService()
            .create(payItemType)
            .then(async (response) => {
                NotificationManager.success(
                    "Successful creation of a record",
                    "Success"
                );
                fetchPayItemTypeDataFunc();
                handleClose();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <Fragment>
            <Button className="text-capitalize" onClick={() => setShow(true)}>
                {name || "Add"}
            </Button>

            <Modal show={show} onHide={handleClose} {...props}>
                <Formik
                    initialValues={formState}
                    validationSchema={payItemTypeFormSchema}
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
                                noValidate
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>Add</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="row">
                                        <div
                                            className={classList({
                                                "col-md-12 mb-3": true,
                                                "valid-field": !errors.code && touched.code,
                                                "invalid-field": errors.code && touched.code,
                                            })}
                                        >
                                            <label htmlFor="validationCustom202">Code</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="validationCustom202"
                                                placeholder="Pay item type code"
                                                name="code"
                                                value={values.code}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                            />
                                            <div className="invalid-feedback">Code is required</div>
                                        </div>
                                        <div
                                            className={classList({
                                                "col-md-12 mb-3": true,
                                                "valid-field": touched.type && !errors.type,
                                                "invalid-field": touched.type && errors.type,
                                            })}
                                        >
                                            <label htmlFor="validationCustom222">Pay item type</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="validationCustom222"
                                                placeholder="Pay item type"
                                                value={values.type}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                name="type"
                                                required
                                            />
                                            <div className="invalid-feedback">
                                                Pay item type is required
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div
                                            className={classList({
                                                "col-md-12 mb-3": true,
                                                "valid-field":
                                                    touched.description && !errors.description,
                                                "invalid-field":
                                                    touched.description && errors.description,
                                            })}
                                        >
                                            <label htmlFor="validationCustom03">Description</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="validationCustom03"
                                                placeholder="Description"
                                                name="description"
                                                value={values.description}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                            />
                                            <div className="invalid-feedback">
                                                Pay item type description is required.
                                            </div>
                                        </div>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Close
                                    </Button>
                                    <Button variant="primary" type="submit">
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

export default PayItemTypeModal;
