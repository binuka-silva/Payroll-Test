import React, {useEffect, useState, useContext} from "react";
import {withRouter} from "react-router-dom";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import {Breadcrumb} from "../../../@gull";
import {Button, FormCheck, FormLabel} from "react-bootstrap";
import configurationService from "../../api/configurationServices/configurationService";
import {NotificationManager} from "react-notifications";
import GullLoadable from "../../../@gull/components/GullLoadable/GullLoadable";
import localStorageService from "../../services/localStorageService";
import {appTopLogoPath, backgroundImagePath, signInLogoPath} from "./constant";

import "./styles/style.scss";
import ImageUpload from "../../components/ImageUpload";
import { SketchPicker } from "react-color";
import AppContext from "app/appContext";

const Configuration = () => {
    const [isLoading, setLoading] = useState(false);
    const [isCommonBank, setCommonBank] = useState(false);
    const [isNegativeSalaryAutomatic, setNegativeSalaryAutomatic] = useState(false);
    const [employeePara, setEmployeePara] = useState("");
    const [title, setTitle] = useState(document.title);
    const [signInImgSrc, setSignInImgSrc] = useState(signInLogoPath);
    const [signInBackgroundImgSrc, setSignInBackgroundImgSrc] = useState(backgroundImagePath);
    const [appTopImgSrc, setAppTopImgSrc] = useState(appTopLogoPath);
    const [signInFile, setSignInFile] = useState(null);
    const [signInBackgroundFile, setSignInBackgroundFile] = useState(null);
    const [appTopFile, setAppTopFile] = useState(null);

    const signInFileReader = new FileReader();
    const signInBackgroundFileReader = new FileReader();
    const appTopFileReader = new FileReader();
    // const {color, setColor} = useContext(AppContext)
    const fs = require('fs');

    //Component did mount only
    useEffect(() => {
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        window.scrollTo(0, 0);
        fetchConfigs();
        //Fetch table data
    }, []);

    // Retrieve background color from localStorage
    useEffect(() => {
        const savedBgColor = localStorageService.getItem("bgColor");
        if (savedBgColor) {
          setColor(savedBgColor);
        }

        const savedHeaderColor = localStorageService.getItem("headerColor");
        if (savedHeaderColor) {
          setHeaderColor(savedHeaderColor);
        }

        const savedNavColor = localStorageService.getItem("navColor");
        if (savedNavColor) {
            setNavColor(savedNavColor);
        }
      }, []);

    signInFileReader.addEventListener("load", () => {
        setSignInImgSrc(signInFileReader.result + "");
    });
    signInBackgroundFileReader.addEventListener("load", () => {
        setSignInBackgroundImgSrc(signInBackgroundFileReader.result + "");
    });
    appTopFileReader.addEventListener("load", () => {
        setAppTopImgSrc(appTopFileReader.result + "");
    });

    const fetchConfigs = async () => {
        try {
            setLoading(true);
            const {data} = await configurationService().getAll();
          
            setCommonBank(data.isEmployeeBankCommonInPayrolls);
            setNegativeSalaryAutomatic(data.isNegativeSalaryAutomatic);
            setEmployeePara(data.dashboardEmployeeParameter);
            data && setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    }

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("isEmployeeBankCommonInPayrolls", isCommonBank.toString());
            formData.append("isNegativeSalaryAutomatic", isNegativeSalaryAutomatic.toString());
            formData.append("dashboardEmployeeParameter", employeePara);
            formData.append("appTitle", title);
            signInImgSrc !== signInLogoPath && signInFile && formData.append("signInFile", signInFile);
            signInBackgroundImgSrc !== backgroundImagePath && signInBackgroundFile && formData.append("signInBackgroundFile", signInBackgroundFile);
            appTopImgSrc !== appTopLogoPath && appTopFile && formData.append("appTopFile", appTopFile);

            const {data} = await configurationService().update(formData);

            const user = localStorageService.getItem("auth_user");
            localStorageService.setItem("auth_user", {
                ...user,
                isEmployeeBankCommonInPayrolls: data.isEmployeeBankCommonInPayrolls,
                isNegativeSalaryAutomatic: data.isNegativeSalaryAutomatic,
            });

            if (data) {
                setLoading(false);
                document.title = title;
                NotificationManager.success(
                    "The configurations Changed Successfully",
                    "Success"
                );
            }
        } catch (e) {
            console.error(e);
            NotificationManager.error(
                "Failed to save configurations",
                "Error"
            );
        }
    }

    const handleSignInFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            signInFileReader.readAsDataURL(file);
            setSignInFile(file);
        }
    }

    const handleSignInBackgroundFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            signInBackgroundFileReader.readAsDataURL(file);
            setSignInBackgroundFile(file);
        }
    }

    const handleAppTopFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            appTopFileReader.readAsDataURL(file);
            setAppTopFile(file);
        }
    }
    const [showBgColorPicker, setShowBgColorPicker] = useState(false);
    const [showHeaderColorPicker, setShowHeaderColorPicker] = useState(false);
    const [showSideNavColorPicker, setShowSideNavColorPicker] = useState(false);
    

    const [showColorPicker, setShowColorPicker] = useState(false);
    const {color, setColor} = useContext(AppContext)
    const {headerColor, setHeaderColor} = useContext(AppContext)
    const {navColor, setNavColor} = useContext(AppContext)
    
    const handleToggleColorPicker = () => {
        setShowColorPicker((prevShowColorPicker) => !prevShowColorPicker);
      };

    const handleOnChangeBgColor = (color) => {
        console.log(color.hex)
        localStorageService.setItem("bgColor", color.hex); 
        setColor(color.hex);
      };

      const handleOnChangeHeaderColor = (color) => {
        console.log(color.hex)
        localStorageService.setItem("headerColor", color.hex); 
        setHeaderColor(color.hex);
      };

      const handleOnChangeNavColor = (color) => {
        console.log(color.hex)
        localStorageService.setItem("navColor", color.hex); 
        setNavColor(color.hex);
      };


    return (
        <>
            <Breadcrumb
                routeSegments={[
                    {name: "Home", path: "/dashboard/v1/"},
                    {name: "Configurations"},
                ]}
            ></Breadcrumb>
            {isLoading ? (<GullLoadable/>) : (
                <>
                    <div className="row row-xs" >
                        <div className="col d-flex justify-content-end align-items-end">
                            <Button
                                style={{width: "60px", marginLeft: "15px"}}
                                variant="primary"
                                type="submit"
                                onClick={handleSubmit}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                    <div className="row d-flex justify-content-center mb-3">
                        <FormLabel className="col-4">
                            Use Employee Common Bank
                        </FormLabel>
                        <FormCheck
                            className="col-4"
                            onChange={(e) => setCommonBank(e.target.checked)}
                            defaultChecked={isCommonBank}
                            type="switch"
                        />
                    </div>
                    {/* <div className="row d-flex justify-content-center mb-3">
                        <FormLabel className="col-4">
                            Use Negative Salary Automatic Controller
                        </FormLabel>
                        <FormCheck
                            className="col-4"
                            onChange={(e) => setNegativeSalaryAutomatic(e.target.checked)}
                            defaultChecked={isNegativeSalaryAutomatic}
                            type="switch"
                        />
                    </div> */}
                    <div className="row d-flex justify-content-center mb-3">
                        <FormLabel className="col-4">
                            Title
                        </FormLabel>
                        <input
                            type="text"
                            className="col-4"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="App Title"
                        />
                    </div>
                    <div className="custom-separator"></div>
                    <div className="row d-flex justify-content-center mb-3">
                        <FormLabel className="col-4">
                            Dashboard Employee Parameter
                        </FormLabel>
                        <input
                            type="text"
                            className="col-4"
                            value={employeePara}
                            onChange={(e) => setEmployeePara(e.target.value)}
                            placeholder="Separate by ;"
                        />
                    </div>
                    <div className="custom-separator"></div>
                    <div className="row d-flex justify-content-center mb-3">
                        <FormLabel className="col-4">
                            Sign In Logo & Favicon
                        </FormLabel>
                        <ImageUpload setImgSrc={setSignInImgSrc} imgSrc={signInImgSrc} defaultImagePath={signInLogoPath}
                                     imageOnChange={handleSignInFileSelect} className="col-4"/>
                    </div>
                    <div className="row d-flex justify-content-center mb-3">
                        <FormLabel className="col-4">
                            Sign-in Background Image
                        </FormLabel>
                        <ImageUpload setImgSrc={setSignInBackgroundImgSrc} imgSrc={signInBackgroundImgSrc}
                                     defaultImagePath={backgroundImagePath}
                                     imageOnChange={handleSignInBackgroundFileSelect} className="col-4"/>
                    </div>
                    <div className="row d-flex justify-content-center mb-3">
                        <FormLabel className="col-4">
                            App Top Logo
                        </FormLabel>
                        <ImageUpload setImgSrc={setAppTopImgSrc} imgSrc={appTopImgSrc} defaultImagePath={appTopLogoPath}
                                     imageOnChange={handleAppTopFileSelect} className="col-4"/>
                    </div>

                   
                    <div className="row d-flex justify-content-center mb-3">
                    <FormLabel className="col-4">Background Color</FormLabel>
                    <div className="col-4">
                        <button onClick={() => setShowBgColorPicker(!showBgColorPicker)}>
                        {showBgColorPicker ? "Close Color Picker" : "Open Color Picker"}
                        </button>

                        {showBgColorPicker && (
                        <div>
                            <SketchPicker
                            color="#FFF"
                            onChangeComplete={handleOnChangeBgColor}
                            />
                        </div>
                        )}
                    </div>
                    </div>

                    <div className="row d-flex justify-content-center mb-3">
                    <FormLabel className="col-4">Header Color</FormLabel>
                    <div className="col-4">
                        <button onClick={() => setShowHeaderColorPicker(!showHeaderColorPicker)}>
                        {showHeaderColorPicker ? "Close Color Picker" : "Open Color Picker"}
                        </button>

                        {showHeaderColorPicker && (
                        <div>
                            <SketchPicker
                            color="#FFF"
                            onChangeComplete={handleOnChangeHeaderColor}
                            />
                        </div>
                        )}
                    </div>
                    </div>

                    <div className="row d-flex justify-content-center mb-3">
                    <FormLabel className="col-4">Side Navigation Color</FormLabel>
                    <div className="col-4">
                        <button onClick={() => setShowSideNavColorPicker(!showSideNavColorPicker)}>
                        {showSideNavColorPicker ? "Close Color Picker" : "Open Color Picker"}
                        </button>

                        {showSideNavColorPicker && (
                        <div>
                            <SketchPicker
                            color="#FFF"
                            onChangeComplete={handleOnChangeNavColor} 
                            />
                        </div>
                        )}
                    </div>
                    </div>



                    




    
                </>
            )}
            <NotificationContainer/>
        </>
    );
}

export const getCurrentColor = Configuration.getCurrentColor;

export default withRouter(Configuration);