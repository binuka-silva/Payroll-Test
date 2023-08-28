import React, {Fragment, useEffect, useState} from "react";
import {withRouter} from "react-router-dom";
// import { navigations } from "../../navigations";
import {merge} from "lodash";
import {classList, isMobile} from "@utils";
import ScrollBar from "react-perfect-scrollbar";
import {DropDownMenu} from "@gull";
import MenuIcon from '@mui/icons-material/Menu';

import PropTypes from "prop-types";
import {connect, useSelector} from "react-redux";
import {setDefaultSideNav, setSideNav} from "app/redux/actions/SideNavActions";
import {IconButton} from "@mui/material";

const SideNav = ({setSideNav, navigationList}) => {
    const [selectedItem, setSelectedItem] = useState({});
    const [open, setOpen] = useState(false);

    const sideNav = useSelector((state) => state.sideNav);

    let windowListener = null;

    useEffect(() => {
        openSecSidenav()

        if (selectedItem === null) closeSecSidenav();

        if (window)
            if (window.innerWidth < 1200) {
                closeSidenav();
            } else {
                openSidenav();
            }

        windowListener = window.addEventListener("resize", ({target}) => {
            if (window.innerWidth < 1200) {
                closeSidenav();
            } else {
                openSidenav();
            }
        });

        return () => {
            if (windowListener) {
                window.removeEventListener("resize", windowListener);
            }
        }
    }, [])

    const setSelected = (selectedItem) => {
        setSelectedItem(selectedItem)
        // console.log(selectedItem);
    };

    const removeSelected = () => {
        setSelectedItem(null)
        // console.log('removed');
    };

    const openSecSidenav = () => {
        setOpen(true)
        setSideNav(
            merge({}, sideNav.sideNavSettings, {
                leftSidebar: {
                    secondaryNavOpen: true,
                },
            })
        );
    };

    const closeSecSidenav = () => {
        setOpen(false)

        let other = {};
        if (isMobile()) {
            other.open = false;
        }

        setSideNav(
            merge({}, sideNav.sideNavSettings, {
                leftSidebar: {
                    ...other,
                    secondaryNavOpen: false,
                },
            })
        );
    };

    const closeSidenav = () => {
        // let {setLayoutSettings, settings} = props;
        /*setLayoutSettings(
            merge({}, settings, {
                layout1Settings: {
                    leftSidebar: {
                        open: false,
                        secondaryNavOpen: false,
                    },
                },
            })
        );*/
    };

    const openSidenav = () => {
        // let {setLayoutSettings, settings} = props;
        /* setLayoutSettings(
             merge({}, settings, {
                 layout1Settings: {
                     leftSidebar: {
                         open: true,
                     },
                 },
             })
         );*/
    };

    let sideNavSettings = sideNav.sideNavSettings;

    return (
        <Fragment>
            <div className="side-content-wrap" style={{
                width: "fit-content",
            }}>
                <IconButton aria-label="add" size="medium" style={{padding: "7px"}}
                            onClick={() => open ? closeSecSidenav() : openSecSidenav()}>
                    <MenuIcon fontSize="medium"/>
                </IconButton>

                <ScrollBar
                    className={classList({
                        "sidebar-left-secondary rtl-ps-none": true,
                        open: sideNavSettings.leftSidebar.secondaryNavOpen,
                    })}

                    style={{
                        zIndex: 1,
                        top: "190px"
                    }}
                >
                    {navigationList && (
                        <DropDownMenu
                            menu={navigationList}
                            closeSecSidenav={closeSecSidenav}
                        ></DropDownMenu>
                    )}
                    <span></span>
                </ScrollBar>
                <div
                    onMouseEnter={closeSecSidenav}
                    className={classList({
                        "sidebar-overlay": true,
                        open: sideNavSettings.leftSidebar.secondaryNavOpen,
                    })}
                ></div>
            </div>
        </Fragment>
    );
}

SideNav.propTypes = {
    setSideNav: PropTypes.func.isRequired,
    setDefaultSideNav: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    setDefaultSideNav: PropTypes.func.isRequired,
    setSideNav: PropTypes.func.isRequired,
});

export default withRouter(
    connect(mapStateToProps, {
        setSideNav,
        setDefaultSideNav,
    })(SideNav)
);
