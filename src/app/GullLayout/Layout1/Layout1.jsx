import React, {Component, Suspense} from "react";
import {renderRoutes} from "react-router-config";

import Layout1Sidenav from "./Layout1Sidenav";
import Footer from "../SharedComponents/Footer";
import Layout1Header from "./Layout1Header";

import {connect} from "react-redux";
import PropTypes from "prop-types";
import {classList} from "@utils";
import GullSearch from "@gull/components/GullSearch";
import {setLayoutSettings} from "app/redux/actions/LayoutActions";
import {merge} from "lodash";
import Loading from "@gull/components/GullLoadable/Loading";
import {withRouter} from "react-router-dom";

import "./dashboard.scss";
import AppContext from "app/appContext";
import { useContext } from "react";

const Layout1 = (props)=> {
    // state = {};

    // componentDidUpdate(prevProps) {
    //     if (this.props.location !== prevProps.location) {
    //         window.scrollTo(0, 0);
    //     }
    // }
    const {color, setColor} = useContext(AppContext)


    const handleSearchBoxClose = () => {
        let {setLayoutSettings, settings} = props;
        setLayoutSettings(
            merge({}, settings, {
                layout1Settings: {
                    searchBox: {
                        open: false,
                    },
                },
            })
        );
    };
    

// const contextType = AppContext;

    // const {bgColor, setBgColor} = this.context

    
        let {settings, routes} = props;

        return (
            <div style={{ marginLeft:'-1rem'}}>
                <div className={`app-admin-wrap layout-sidebar-large`} style={{padding:'0'}}>
                    <Layout1Header></Layout1Header>
                    <Layout1Sidenav/>
                    {/* sidebar */}

                    <div style={{ backgroundColor: color, paddingLeft:'3rem', marginBottom:'0' }}
                        className={classList({
                            "main-content-wrap d-flex flex-column": true,
                            "sidenav-open": settings.layout1Settings.leftSidebar.open,
                        })}
                    >
                        <Suspense fallback={<Loading/>}>
                            <div className="main-content">{renderRoutes(routes)}</div>
                        </Suspense>
                        {settings.footer.show && <Footer></Footer>}
                    </div>
                </div>
                <GullSearch
                    open={settings.layout1Settings.searchBox.open}
                    handleClose={handleSearchBoxClose}
                ></GullSearch>
            </div>
        ); 
    }

const mapStateToProps = (state) => ({
    setLayoutSettings: PropTypes.func.isRequired,
    settings: state.layout.settings,
});

export default withRouter(
    connect(mapStateToProps, {setLayoutSettings})(Layout1)
);

// export default withRouter(Layout1)