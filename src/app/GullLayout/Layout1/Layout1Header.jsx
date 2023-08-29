import React, {Component} from "react";
import {Dropdown} from "react-bootstrap";
import {Link, withRouter} from "react-router-dom";

import PropTypes from "prop-types";
import {connect} from "react-redux";
import {setDefaultSettings, setLayoutSettings,} from "app/redux/actions/LayoutActions";
import {logoutUser} from "app/redux/actions/UserActions";

import {merge} from "lodash";
// import MegaMenu from "@gull/components/MegaMenu";
import localStorageService from "../../services/localStorageService";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

class Layout1Header extends Component {
    state = {
        shorcutMenuList: [
            {
                icon: "i-Shop-4",
                link: "#",
                text: "Home",
            },
            {
                icon: "i-Library",
                link: "#",
                text: "Ui Kits",
            },
            {
                icon: "i-Drop",
                link: "#",
                text: "Apps",
            },
            {
                icon: "i-File-Clipboard-File--Text",
                link: "#",
                text: "Form",
            },
            {
                icon: "i-Checked-User",
                link: "#",
                text: "Sessions",
            },
            {
                icon: "i-Ambulance",
                link: "#",
                text: "Support",
            },
        ],
        notificationList: [
            {
                icon: "i-Speach-Bubble-6",
                title: "New message",
                description: "James: Hey! are you busy?",
                time: "2019-10-30T02:10:18.931Z",
                color: "primary",
                status: "New",
            },
            {
                icon: "i-Receipt-3",
                title: "New order received",
                description: "1 Headphone, 3 iPhone",
                time: "2019-03-10T02:10:18.931Z",
                color: "success",
                status: "New",
            },
            {
                icon: "i-Empty-Box",
                title: "Product out of stock",
                description: "1 Headphone, 3 iPhone",
                time: "2019-05-10T02:10:18.931Z",
                color: "danger",
                status: "3",
            },
            {
                icon: "i-Data-Power",
                title: "Server up!",
                description: "Server rebooted successfully",
                time: "2019-03-10T02:10:18.931Z",
                color: "success",
                status: "3",
            },
        ],
        showSearchBox: false,
    };

    handleMenuClick = () => {
        let {setLayoutSettings, settings} = this.props;
        setLayoutSettings(
            merge({}, settings, {
                layout1Settings: {
                    leftSidebar: {
                        open: settings.layout1Settings.leftSidebar.secondaryNavOpen
                            ? true
                            : !settings.layout1Settings.leftSidebar.open,
                        secondaryNavOpen: false,
                    },
                },
            })
        );
    };

    toggleFullScreen = () => {
        if (document.fullscreenEnabled) {
            if (!document.fullscreen) document.documentElement.requestFullscreen();
            else document.exitFullscreen();
        }
    };

    handleSearchBoxOpen = () => {
        let {setLayoutSettings, settings} = this.props;
        setLayoutSettings(
            merge({}, settings, {
                layout1Settings: {
                    searchBox: {
                        open: true,
                    },
                },
            })
        );
    };

    render() {
        let {shorcutMenuList, notificationList} = this.state;

        return (
            <div className="main-header">
                <div style={{marginLeft: "20px"}} className="cursor-pointer">
                    <MenuOutlinedIcon fontSize="medium" onClick={this.handleMenuClick}/>
                </div>
                <div style={{marginLeft: "20px"}}>
                    <Link to="/dashboard/v1/" className="cursor-pointer">
                        <HomeOutlinedIcon fontSize="medium"/>
                    </Link>
                </div>

                <div style={{margin: "auto"}}></div>

                <div className="header-part-right" style={{marginRight: "20px"}}>
                    {/* <div>
            <NotificationsNoneOutlinedIcon fontSize="large" />
          </div> */}

                    <div className="user col px-3" style={{marginRight: "0px"}}>
                        <Dropdown>
                            <Dropdown.Toggle
                                as="span"
                                className="toggle-hidden cursor-pointer"
                            >
                                <img
                                    src="/assets/images/2-image.png"
                                    id="userDropdown"
                                    alt=""
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                    sizes="small"
                                />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Link
                                    to={window.location.pathname}
                                    className="dropdown-item cursor-pointer"
                                >
                                    Account settings
                                </Link>
                                {/*<Link to="/" className="dropdown-item cursor-pointer">
                  Billing history
                </Link>*/}
                                <Link
                                    to="/session/signin"
                                    className="dropdown-item cursor-pointer"
                                    onClick={this.props.logoutUser}
                                >
                                    Sign out
                                </Link>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    <div>{localStorageService.getItem("auth_user")?.userName}</div>
                    <div className="logo" style={{width: "100px", marginLeft: "30px"}}>
                        <Link to="/dashboard/v1/" className="cursor-pointer">
                            <img src="/assets/images/e-analytics.png" alt=""/>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

Layout1Header.propTypes = {
    setLayoutSettings: PropTypes.func.isRequired,
    setDefaultSettings: PropTypes.func.isRequired,
    logoutUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    setDefaultSettings: PropTypes.func.isRequired,
    setLayoutSettings: PropTypes.func.isRequired,
    logoutUser: PropTypes.func.isRequired,
    user: state.user,
    settings: state.layout.settings,
});

export default withRouter(
    connect(mapStateToProps, {
        setLayoutSettings,
        setDefaultSettings,
        logoutUser,
    })(Layout1Header)
);
