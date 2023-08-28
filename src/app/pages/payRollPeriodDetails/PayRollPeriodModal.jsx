import React, {Fragment, useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import {Formik} from "formik";
import * as yup from "yup";
import {classList} from "@utils";
import {NotificationManager} from "react-notifications";
import payRollPeriodDetailService from "../../api/payRollPeriodServices/payRollPeriodDetailService";

const PayRollPeriodModal = ({name, fetchPayRollPeriodDataFunc, ...props}) => {

    useEffect(() => {
        // Clear all notifications
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
    }, []);

    const [show, setShow] = useState(false);
    const initFormState = {
        periodNo: "",
        dateFrom: "",
        dateTo: "",
        taxPeriod: "",
        accountingPeriod: "",
        payDate: "",
    };
    const [formState, setState] = useState(initFormState);

    const payRollTypeFormSchema = yup.object().shape({
        periodNo: yup.string().required("Period number field is required"),
        dateFrom: yup.string().required("Date from filed is required"),
        dateTo: yup.string().required("Date To filed is required"),
        taxPeriod: yup.string().required("Tax Period filed is required"),
        accountingPeriod: yup
            .string()
            .required("Accounting Period filed is required"),
        payDate: yup.string().required("Pay Date filed is required"),
    });

    const handleClose = () => {
        setShow(false);
    };

    const handleSubmit = async (values, {setSubmitting}) => {
        let PayRollPeriod = {
            periodNo: values.periodNo,
            dateFrom: values.dateFrom,
            dateTo: values.dateTo,
            taxPeriod: values.taxPeriod,
            accountingPeriod: values.accountingPeriod,
            payDate: values.payDate,
            isActive: true,
            createdDateTime: new Date(),
            createdBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        };

        await payRollPeriodDetailService()
            .create(PayRollPeriod)
            .then(async (response) => {
                NotificationManager.success(
                    "Successful creation of a record",
                    "Success"
                );
                fetchPayRollPeriodDataFunc();
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
                    validationSchema={payRollTypeFormSchema}
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
                                                "valid-field": !errors.periodNo && touched.periodNo,
                                                "invalid-field": errors.periodNo && touched.periodNo,
                                            })}
                                        >
                                            <label htmlFor="validationCustom202">Period Number</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="validationCustom202"
                                                placeholder="Pay roll period number"
                                                name="periodNo"
                                                value={values.periodNo}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                            />
                                            <div className="invalid-feedback">
                                                Pay roll period number is required
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div
                                            className={classList({
                                                "col-md-6 mb-3": true,
                                                "valid-field": !errors.dateFrom && touched.dateFrom,
                                                "invalid-field": errors.dateFrom && touched.dateFrom,
                                            })}
                                        >
                                            <label htmlFor="validationCustom202">Date From</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="validationCustom202"
                                                placeholder="Date From"
                                                name="dateFrom"
                                                value={values.dateFrom}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                            />
                                            <div className="invalid-feedback">
                                                Pay roll date from is required
                                            </div>
                                        </div>
                                        <div
                                            className={classList({
                                                "col-md-6 mb-3": true,
                                                "valid-field": touched.dateTo && !errors.dateTo,
                                                "invalid-field": touched.dateTo && errors.dateTo,
                                            })}
                                        >
                                            <label htmlFor="validationCustom222">Date To</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="validationCustom222"
                                                placeholder="Date To"
                                                name="dateTo"
                                                value={values.dateTo}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                            />
                                            <div className="invalid-feedback">
                                                Pay roll date to is required
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div
                                            className={classList({
                                                "col-md-6 mb-3": true,
                                                "valid-field": !errors.taxPeriod && touched.taxPeriod,
                                                "invalid-field": errors.taxPeriod && touched.taxPeriod,
                                            })}
                                        >
                                            <label htmlFor="validationCustom202">Tax Period</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="validationCustom202"
                                                placeholder="Pay roll tax period"
                                                name="taxPeriod"
                                                value={values.taxPeriod}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                            />
                                            <div className="invalid-feedback">
                                                Pay roll tax period is required
                                            </div>
                                        </div>
                                        <div
                                            className={classList({
                                                "col-md-6 mb-3": true,
                                                "valid-field":
                                                    touched.accountingPeriod && !errors.accountingPeriod,
                                                "invalid-field":
                                                    touched.accountingPeriod && errors.accountingPeriod,
                                            })}
                                        >
                                            <label htmlFor="validationCustom222">
                                                Accounting Period
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="validationCustom222"
                                                placeholder="Pay roll accounting period"
                                                name="accountingPeriod"
                                                value={values.accountingPeriod}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                            />
                                            <div className="invalid-feedback">
                                                Pay roll accounting period is required
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div
                                            className={classList({
                                                "col-md-12 mb-3": true,
                                                "valid-field": !errors.payDate && touched.payDate,
                                                "invalid-field": errors.payDate && touched.payDate,
                                            })}
                                        >
                                            <label htmlFor="validationCustom202">Pay Date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="validationCustom202"
                                                placeholder="Pay roll pay date"
                                                name="payDate"
                                                value={values.payDate}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                            />
                                            <div className="invalid-feedback">
                                                Pay roll pay date is required
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

export default PayRollPeriodModal;
