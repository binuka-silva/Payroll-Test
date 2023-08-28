import React, {useState} from "react";
import {Formik} from "formik";
import * as yup from "yup";
import {connect} from "react-redux";
import {Link, useLocation} from "react-router-dom";
import history from "../../../@history";
import GullLoadable from "../../../@gull/components/GullLoadable/GullLoadable";
import {resetPassword} from "../../api/authServices/authService";

const resetPasswordSchema = yup.object().shape({
    password: yup
        .string()
        .min(3, "Password must be 3 character long")
        .required("Password is required"),
    rePassword: yup
        .string()
        .required("Password is required")
        .oneOf([yup.ref('password'), null], 'Passwords Mismatch'),
});

const ResetPassword = () => {
    const location = useLocation().search;
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const handleSubmit = async (values, {setSubmitting}) => {
        try {
            setLoading(true);
            const id = new URLSearchParams(location).get("id");
            const code = new URLSearchParams(location).get("code");
            const response = await resetPassword({
                password: values.password,
                code, id
            });

            response.status === 200 && history.push({
                pathname: "/session/signin"
            });

        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    return (
        <div
            className="auth-layout-wrap"
            style={{
                backgroundImage: "url(/assets/images/signin-background.jpg)",
            }}
        >
            {isLoading ? (<GullLoadable/>) :
                (<div className="reset-auth-content">
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
                                        <img src="/assets/images/logo.png" alt=""/>
                                    </div>
                                    <div className="flex-grow-1"></div>
                                    <div className="w-100 mb-4">
                                        <Link
                                            to="/session/signin"
                                            className="btn btn-rounded btn-outline-primary btn-outline-email w-100 my-1 btn-icon-text"
                                        >
                                            <i className="i-Mail-with-At-Sign"></i> Sign in with Email
                                        </Link>

                                        {/*<Button
                                            className="btn btn-outline-google w-100 my-1 btn-icon-text btn-rounded"
                                            disabled={true}>
                                            <i className="i-Google-Plus"></i> Sign in with Google
                                        </Button>
                                        <Button
                                            className="btn btn-outline-facebook w-100 my-1 btn-icon-text btn-rounded"
                                            disabled={true}>
                                            <i className="i-Facebook-2"></i> Sign in with Facebook
                                        </Button>*/}
                                    </div>
                                    <div className="flex-grow-1"></div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="p-4">
                                    <h1 className="mb-3 text-18">Reset Password</h1>
                                    <Formik
                                        initialValues={{
                                            password, rePassword
                                        }}
                                        validationSchema={resetPasswordSchema}
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
                                          }) => (
                                            <form onSubmit={handleSubmit}>
                                                <div className="form-group">
                                                    <label htmlFor="password">New Password</label>
                                                    <input
                                                        name="password"
                                                        className="form-control form-control-rounded"
                                                        type="password"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values?.password ?? ""}
                                                    />
                                                    {errors.password && touched.password && (
                                                        <div className="text-danger mt-1 ml-2">
                                                            {errors.password}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="rePassword">Confirm password</label>
                                                    <input
                                                        name="rePassword"
                                                        className="form-control form-control-rounded"
                                                        type="password"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values?.rePassword ?? ""}
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
                                                    Reset Password
                                                </button>
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

const mapStateToProps = (state) => ({
    user: state.user,
});

export default connect(mapStateToProps, {})(ResetPassword);
