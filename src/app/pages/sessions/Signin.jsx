import React, {Component} from "react";
import {Formik} from "formik";
import * as yup from "yup";
import {loginWithEmailAndPassword} from "app/redux/actions/LoginActions";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import jwtAuthService from "../../api/authServices/authService";
import history from "../../../@history";
import GullLoadable from "../../../@gull/components/GullLoadable/GullLoadable";
import "./style/signin.css";

const SigninSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("email is required"),
    password: yup
        .string()
        .min(3, "Password must be 3 character long")
        .required("password is required"),
});

class Signin extends Component {
    state = {
        email: "",
        password: "",
        error: false,
        errorMsg: "",
        isLoading: false,
    };

    handleSubmit = async (value, {isSubmitting}) => {
        this.setState({isLoading: true});
        try {
            const {auth, error} = await jwtAuthService.loginWithEmailAndPassword(value);
            if (auth) {
                this.setState({isLoading: false});
                history.push("/dashboard/v1/");
            } else {
                this.setState({error: true});
                this.setState({errorMsg: error.response.data})
                this.setState({isLoading: false});
            }
        } catch (e) {
            this.setState({isLoading: false});
            console.error(e);
        }
    };

    signInWithMicrosoft = async () => {
        this.setState({isLoading: true});
        try {
            const {auth, error} = await jwtAuthService.loginWithAzureAd();

            if (auth) {
                this.setState({isLoading: false});
                history.push("/dashboard/v1/");
            } else {
                this.setState({error: true});
                this.setState({errorMsg: error.response.data})
                this.setState({isLoading: false});
            }
        } catch (e) {
            this.setState({isLoading: false});
            console.error(e);
        }
    }

    render() {
        return (
            <div
                className="auth-layout-wrap"
                style={{
                    backgroundImage: "url(/assets/images/signin-background.jpg)",
                }}
            >
                {this.state.isLoading ? (<GullLoadable/>) :
                    (<div className="auth-content d-flex justify-content-center">
                        <div className="card o-hidden w-100">
                            <div className="row">
                                <div
                                    style={{
                                        backgroundSize: "cover",
                                        backgroundImage: "url(/assets/images/photo-long-3.jpg)",
                                    }}
                                >
                                    <div className="p-4">
                                        <div className="auth-logo text-center mb-4">
                                            <img src="/assets/images/logo.png" alt="logo"/>
                                        </div>
                                        <h1 className="mb-3 text-18">Sign In</h1>
                                        <Formik
                                            initialValues={this.state}
                                            validationSchema={SigninSchema}
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
                                                <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
                                                    <div className="form-group w-100">
                                                        <label htmlFor="email">Email address</label>
                                                        <input
                                                            className="form-control form-control-rounded position-relative"
                                                            type="email"
                                                            name="email"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.email}
                                                        />
                                                        {errors.email && (
                                                            <div className="text-danger mt-1 ml-2">
                                                                {errors.email}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="form-group w-100">
                                                        <label htmlFor="password">Password</label>
                                                        <input
                                                            className="form-control form-control-rounded"
                                                            type="password"
                                                            name="password"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.password}
                                                        />
                                                        {errors.password && (
                                                            <div className="text-danger mt-1 ml-2">
                                                                {errors.password}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button
                                                        className="btn btn-rounded btn-primary w-100 my-1 mt-2"
                                                        type="submit"
                                                    >
                                                        Sign In
                                                    </button>
                                                    <button
                                                        className="signin-button"
                                                        onClick={this.signInWithMicrosoft}
                                                    >
                                                        <img src="/assets/images/microsoft-logo.png" alt="microsoft-logo"/>
                                                        Sign in with Microsoft
                                                    </button>
                                                    {this.state.error && (
                                                        <div className="text-danger mt-1 ml-2">
                                                            {this.state.errorMsg}
                                                        </div>
                                                    )}
                                                </form>
                                            )}
                                        </Formik>

                                        {/*<div className="mt-3 text-center">
                                            <Link to="/session/forgot-password" className="text-muted">
                                                <u>Forgot Password?</u>
                                            </Link>
                                        </div>*/}
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
    loginWithEmailAndPassword: PropTypes.func.isRequired,
    user: state.user,
});

export default connect(mapStateToProps, {
    loginWithEmailAndPassword,
})(Signin);
