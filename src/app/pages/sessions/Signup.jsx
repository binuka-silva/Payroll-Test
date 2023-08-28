import React, {Component} from "react";
import {Formik} from "formik";
import * as yup from "yup";
import {connect} from "react-redux";
import {Button} from "react-bootstrap";
import SweetAlert from "sweetalert2-react";
import {Link} from "react-router-dom";
import {signup} from "../../api/authServices/authService";
import history from "../../../@history";
import GullLoadable from "../../../@gull/components/GullLoadable/GullLoadable";

const signUpSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("email is required"),
    name: yup.string().min(3, "Name must be 3 character long").required("Name is required"),
    password: yup
        .string()
        .min(3, "Password must be 3 character long")
        .required("Password is required"),
    rePassword: yup
        .string()
        .required("Password is required")
        .oneOf([yup.ref('password'), null], 'Passwords Mismatch'),
});

class Signup extends Component {
    state = {
        email: "",
        name: "",
        password: "",
        rePassword: "",
        success: false,
        error: false,
        isLoading: false,
    };

    toggleAlert = (name) => {
        this.setState({[name]: !this.state[name]});
    };

    closeAlert = (name) => {
        this.setState({[name]: false});
    };

    handleSubmit = async (values, {setSubmitting}) => {
        try {
            this.setState({isLoading: true});
            const response = await signup({
                email: values.email,
                password: values.password,
                username: values.name,
            });

            if (response.data) {
                this.toggleAlert("success");
            }
        } catch (e) {
            console.error(e);
            this.toggleAlert("error");
        }
        this.setState({isLoading: false});
    };

    render() {
        let {
            success,
            error,
        } = this.state;

        return (
            <div
                className="auth-layout-wrap"
                style={{
                    backgroundImage: "url(/assets/images/signin-background.jpg)",
                }}
            >
                {this.state.isLoading ? (<GullLoadable/>) :
                    (<div className="auth-content">
                        <div className="card o-hidden">
                            <div className="row">
                                <div
                                    className="col-md-6 text-center "
                                    style={{
                                        backgroundSize: "cover",
                                        backgroundImage: "url(/assets/images/photo-long-3.jpg)",
                                    }}
                                >
                                    <div className="ps-3 auth-right">
                                        <div className="auth-logo text-center mt-4">
                                            <img src="assets/images/logo.png" alt=""/>
                                        </div>
                                        <div className="flex-grow-1"></div>
                                        <div className="w-100 mb-4">
                                            <Link
                                                to="/session/signin"
                                                className="btn btn-rounded btn-outline-primary btn-outline-email w-100 my-1 btn-icon-text"
                                            >
                                                <i className="i-Mail-with-At-Sign"></i> Sign in with Email
                                            </Link>

                                            <Button
                                                className="btn btn-outline-google w-100 my-1 btn-icon-text btn-rounded"
                                                disabled={true}>
                                                <i className="i-Google-Plus"></i> Sign in with Google
                                            </Button>
                                            <Button
                                                className="btn btn-outline-facebook w-100 my-1 btn-icon-text btn-rounded"
                                                disabled={true}>
                                                <i className="i-Facebook-2"></i> Sign in with Facebook
                                            </Button>
                                        </div>
                                        <div className="flex-grow-1"></div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="p-4">
                                        <h1 className="mb-3 text-18">Sign Up</h1>
                                        <Formik
                                            initialValues={this.state}
                                            validationSchema={signUpSchema}
                                            onSubmit={this.handleSubmit}
                                        >
                                            {({
                                                  values,
                                                  errors,
                                                  touched,
                                                  handleChange,
                                                  handleBlur,
                                                  handleSubmit,
                                                  isSubmitting,
                                              }) => (
                                                <form onSubmit={handleSubmit}>
                                                    <div className="form-group">
                                                        <label htmlFor="name">Your name</label>
                                                        <input
                                                            className="form-control form-control-rounded"
                                                            name="name"
                                                            type="text"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.name}
                                                        />
                                                        {errors.name && touched.name && (
                                                            <div className="text-danger mt-1 ml-2">
                                                                {errors.name}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="email">Email address</label>
                                                        <input
                                                            name="email"
                                                            className="form-control form-control-rounded"
                                                            type="email"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.email}
                                                        />
                                                        {errors.email && touched.email && (
                                                            <div className="text-danger mt-1 ml-2">
                                                                {errors.email}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="password">Password</label>
                                                        <input
                                                            name="password"
                                                            className="form-control form-control-rounded"
                                                            type="password"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.password}
                                                        />
                                                        {errors.password && touched.password && (
                                                            <div className="text-danger mt-1 ml-2">
                                                                {errors.password}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="rePassword">Retype password</label>
                                                        <input
                                                            name="rePassword"
                                                            className="form-control form-control-rounded"
                                                            type="password"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.rePassword}
                                                        />
                                                        {errors.rePassword && touched.rePassword && (
                                                            <div className="text-danger mt-1 ml-2">
                                                                {errors.rePassword}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button
                                                        className="btn btn-primary w-100 my-1 btn-rounded mt-3"
                                                        type="submit"
                                                    >
                                                        Sign Up
                                                    </button>
                                                    <SweetAlert
                                                        show={success}
                                                        title="Success"
                                                        type="success"
                                                        text="Thank you for joining with us. We sent a confirmation Email"
                                                        onConfirm={() => history.push({
                                                            pathname: "/session/signin"
                                                        })}
                                                    />
                                                    <SweetAlert
                                                        show={error}
                                                        title="Error"
                                                        type="error"
                                                        text="Failed to Signup"
                                                        onConfirm={() => this.toggleAlert("error")}
                                                    />
                                                </form>
                                            )}
                                        </Formik>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>)}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
});

export default connect(mapStateToProps, {})(Signup);
