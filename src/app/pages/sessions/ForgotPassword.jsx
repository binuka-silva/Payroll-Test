import React, {Component} from "react";
import {Formik} from "formik";
import * as yup from "yup";
import {loginWithEmailAndPassword} from "app/redux/actions/LoginActions";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import SweetAlert from "sweetalert2-react";
import {Button} from "react-bootstrap";
import {forgotPassword} from "../../api/authServices/authService";
import history from "../../../@history";
import GullLoadable from "../../../@gull/components/GullLoadable/GullLoadable";

const ForgotPasswordSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("email is required"),
});

class ForgotPassword extends Component {
    state = {
        email: "",
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

    handleSubmit = async (value, {isSubmitting}) => {
        try {
            this.setState({isLoading: true});
            await forgotPassword(value.email);
            this.toggleAlert("success");
        } catch (e) {
            this.toggleAlert("error");
            console.error(e);
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
                                <div className="col-md-6">
                                    <div className="p-4">
                                        <div className="auth-logo text-center mb-4">
                                            <img src="/assets/images/logo.png" alt="logo"/>
                                        </div>
                                        <h1 className="mb-3 text-18">Forgot Password</h1>
                                        <Formik
                                            initialValues={this.state}
                                            validationSchema={ForgotPasswordSchema}
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
                                                    <button
                                                        className="btn btn-rounded btn-primary w-100 mt-2"
                                                        type="submit"
                                                    >
                                                        Reset Password
                                                    </button>
                                                    <SweetAlert
                                                        show={success}
                                                        title="Success"
                                                        type="success"
                                                        text="Sending Reset Link Successfully"
                                                        onConfirm={() => history.push({
                                                            pathname: "/session/signin"
                                                        })}
                                                    />
                                                    <SweetAlert
                                                        show={error}
                                                        title="Error"
                                                        type="error"
                                                        text="Failed to Send Email"
                                                        onConfirm={() => this.toggleAlert("error")}
                                                    />
                                                </form>
                                            )}
                                        </Formik>

                                        <div className="mt-3 text-center">
                                            <Link to="/session/signin" className="text-muted">
                                                <u>Signin</u>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="col-md-6 text-center "
                                    style={{
                                        backgroundSize: "cover",
                                        backgroundImage: "url(/assets/images/photo-long-3.jpg)",
                                    }}
                                >
                                    <div className="pe-3 auth-right">
                                        {/*<Link
                                            to="/session/signup"
                                            className="btn btn-rounded btn-outline-primary btn-outline-email w-100 my-1 btn-icon-text"
                                        >
                                            <i className="i-Mail-with-At-Sign"></i> Sign up with Email
                                        </Link>*/}
                                        <Button className="btn btn-rounded btn-outline-google w-100 my-1 btn-icon-text"
                                                disabled={true}>
                                            <i className="i-Google-Plus"></i> Sign up with Google
                                        </Button>
                                        <Button
                                            className="btn btn-rounded w-100 my-1 btn-icon-text btn-outline-facebook"
                                            disabled={true}>
                                            <i className="i-Facebook-2"></i> Sign up with Facebook
                                        </Button>
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
})(ForgotPassword);
