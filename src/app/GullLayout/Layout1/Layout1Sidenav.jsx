import React, {Component, Fragment} from "react";
import {NavLink, withRouter} from "react-router-dom";
// import { navigations } from "../../navigations";
import {merge} from "lodash";
import {classList, isMobile} from "@utils";
import Srcollbar from "react-perfect-scrollbar";
import ScrollBar from "react-perfect-scrollbar";
import {DropDownMenu} from "@gull";

import PropTypes from "prop-types";
import {connect} from "react-redux";
import {setDefaultSettings, setLayoutSettings,} from "app/redux/actions/LayoutActions";
import {logoutUser} from "app/redux/actions/UserActions";
import localStorageService from "../../services/localStorageService";
import {Level1} from "./constant";

class Layout1Sidenav extends Component {
    windowListener = null;

    state = {
        selectedItem: null,
        navOpen: true,
        secondaryNavOpen: false,
        navigations: []
    };

    userNavigations = () => {
        const navigations = [];

        const userDetails = localStorageService.getItem("auth_user");

        const employee = {
            name: Level1.EMPLOYEE,
            description: "Lorem ipsum dolor sit.",
            type: "dropDown",
            icon: "i-Administrator",
            sub: []
        };

        const payrollPeriods = {
            name: Level1.PAYROLL_PERIODS,
            description: "Lorem ipsum dolor sit.",
            type: "dropDown",
            icon: "i-Stopwatch",
            sub: []
        }

        const bankDetails = {
            name: Level1.BANK_DETAILS,
            description: "Lorem ipsum dolor sit.",
            type: "dropDown",
            icon: "i-Money-2",
            sub: []
        }

        const payItems = {
            name: Level1.PAY_ITEMS,
            description: "Lorem ipsum dolor sit.",
            type: "dropDown",
            icon: "i-Financial",
            sub: []
        }

        const loanTypes = {
            name: Level1.LOAN_TYPES,
            description: "Lorem ipsum dolor sit.",
            type: "dropDown",
            icon: "i-Book",
            sub: []
        }

        const payroll = {
            name: Level1.PAYROLL,
            description: "Lorem ipsum dolor sit.",
            type: "dropDown",
            icon: "i-Billing",
            sub: []
        }

        const reports = {
            name: Level1.REPORTS,
            description: "Lorem ipsum dolor sit.",
            type: "dropDown",
            icon: "i-Windows-2",
            sub: []
        }

        const bankFileConfiguration = {
            name: Level1.BANK_FILE_CONFIGURATION,
            description: "Lorem ipsum dolor sit.",
            type: "dropDown",
            icon: "i-Library",
            sub: [],
        };

        const settings = {
            name: Level1.SETTINGS,
            description: "Lorem ipsum dolor sit.",
            type: "dropDown",
            icon: "i-Gear",
            sub: []
        }

        if (userDetails) {
            userDetails.role.pages.forEach(list => {
                const levels = list.page.navLevelPath?.split("/");
                if (levels) {
                    switch (levels[0]) {
                        case Level1.PAY_ITEMS: {
                            if (levels[1]) {
                                if (payItems.sub.length === 0) {
                                    payItems.sub.push({
                                        icon: "i-Align-Justify-Center",
                                        name: levels[1],
                                        type: "dropDown",
                                        sub: [
                                            {
                                                icon: "i-Receipt-4",
                                                name: list.page.name,
                                                path: list.page.path,
                                                type: "link",
                                            },
                                        ],
                                    });
                                } else {
                                    const find = payItems.sub.find(
                                        (s) => s.name === levels[1]
                                    );
                                    if (find) {
                                        find.sub.push({
                                            icon: "i-Receipt-4",
                                            name: list.page.name,
                                            path: list.page.path,
                                            type: "link",
                                        });
                                    } else {
                                        payItems.sub.push({
                                            icon: "i-Align-Justify-Center",
                                            name: levels[1],
                                            type: "dropDown",
                                            sub: [
                                                {
                                                    icon: "i-Receipt-4",
                                                    name: list.page.name,
                                                    path: list.page.path,
                                                    type: "link",
                                                },
                                            ],
                                        });
                                    }
                                }
                            } else {
                                payItems.sub.push({
                                    icon: "i-Receipt-4",
                                    name: list.page.name,
                                    path: list.page.path,
                                    type: "link",
                                });
                            }
                        }
                            break;
                        case Level1.EMPLOYEE: {
                            if (levels[1]) {
                                if (employee.sub.length === 0) {
                                    employee.sub.push({
                                        icon: "i-Align-Justify-Center",
                                        name: levels[1],
                                        type: "dropDown",
                                        sub: [
                                            {
                                                icon: "i-Receipt-4",
                                                name: list.page.name,
                                                path: list.page.path,
                                                type: "link",
                                            },
                                        ],
                                    });
                                } else {
                                    const find = employee.sub.find(
                                        (s) => s.name === levels[1]
                                    );
                                    if (find) {
                                        find.sub.push({
                                            icon: "i-Receipt-4",
                                            name: list.page.name,
                                            path: list.page.path,
                                            type: "link",
                                        });
                                    } else {
                                        employee.sub.push({
                                            icon: "i-Align-Justify-Center",
                                            name: levels[1],
                                            type: "dropDown",
                                            sub: [
                                                {
                                                    icon: "i-Receipt-4",
                                                    name: list.page.name,
                                                    path: list.page.path,
                                                    type: "link",
                                                },
                                            ],
                                        });
                                    }
                                }
                            } else {
                                employee.sub.push({
                                    icon: "i-Receipt-4",
                                    name: list.page.name,
                                    path: list.page.path,
                                    type: "link",
                                });
                            }
                        }
                            break;
                        case Level1.BANK_DETAILS: {
                            if (levels[1]) {
                                if (bankDetails.sub.length === 0) {
                                    bankDetails.sub.push({
                                        icon: "i-Align-Justify-Center",
                                        name: levels[1],
                                        type: "dropDown",
                                        sub: [
                                            {
                                                icon: "i-Receipt-4",
                                                name: list.page.name,
                                                path: list.page.path,
                                                type: "link",
                                            },
                                        ],
                                    });
                                } else {
                                    const find = bankDetails.sub.find(
                                        (s) => s.name === levels[1]
                                    );
                                    if (find) {
                                        find.sub.push({
                                            icon: "i-Receipt-4",
                                            name: list.page.name,
                                            path: list.page.path,
                                            type: "link",
                                        });
                                    } else {
                                        bankDetails.sub.push({
                                            icon: "i-Align-Justify-Center",
                                            name: levels[1],
                                            type: "dropDown",
                                            sub: [
                                                {
                                                    icon: "i-Receipt-4",
                                                    name: list.page.name,
                                                    path: list.page.path,
                                                    type: "link",
                                                },
                                            ],
                                        });
                                    }
                                }
                            } else {
                                bankDetails.sub.push({
                                    icon: "i-Receipt-4",
                                    name: list.page.name,
                                    path: list.page.path,
                                    type: "link",
                                });
                            }
                        }
                            break;
                        case Level1.PAYROLL_PERIODS: {
                            if (levels[1]) {
                                if (payrollPeriods.sub.length === 0) {
                                    payrollPeriods.sub.push({
                                        icon: "i-Align-Justify-Center",
                                        name: levels[1],
                                        type: "dropDown",
                                        sub: [
                                            {
                                                icon: "i-Receipt-4",
                                                name: list.page.name,
                                                path: list.page.path,
                                                type: "link",
                                            },
                                        ],
                                    });
                                } else {
                                    const find = payrollPeriods.sub.find(
                                        (s) => s.name === levels[1]
                                    );
                                    if (find) {
                                        find.sub.push({
                                            icon: "i-Receipt-4",
                                            name: list.page.name,
                                            path: list.page.path,
                                            type: "link",
                                        });
                                    } else {
                                        payrollPeriods.sub.push({
                                            icon: "i-Align-Justify-Center",
                                            name: levels[1],
                                            type: "dropDown",
                                            sub: [
                                                {
                                                    icon: "i-Receipt-4",
                                                    name: list.page.name,
                                                    path: list.page.path,
                                                    type: "link",
                                                },
                                            ],
                                        });
                                    }
                                }
                            } else {
                                payrollPeriods.sub.push({
                                    icon: "i-Receipt-4",
                                    name: list.page.name,
                                    path: list.page.path,
                                    type: "link",
                                });
                            }
                        }
                            break;
                        case Level1.LOAN_TYPES: {
                            if (levels[1]) {
                                if (loanTypes.sub.length === 0) {
                                    loanTypes.sub.push({
                                        icon: "i-Align-Justify-Center",
                                        name: levels[1],
                                        type: "dropDown",
                                        sub: [
                                            {
                                                icon: "i-Receipt-4",
                                                name: list.page.name,
                                                path: list.page.path,
                                                type: "link",
                                            },
                                        ],
                                    });
                                } else {
                                    const find = loanTypes.sub.find(
                                        (s) => s.name === levels[1]
                                    );
                                    if (find) {
                                        find.sub.push({
                                            icon: "i-Receipt-4",
                                            name: list.page.name,
                                            path: list.page.path,
                                            type: "link",
                                        });
                                    } else {
                                        loanTypes.sub.push({
                                            icon: "i-Align-Justify-Center",
                                            name: levels[1],
                                            type: "dropDown",
                                            sub: [
                                                {
                                                    icon: "i-Receipt-4",
                                                    name: list.page.name,
                                                    path: list.page.path,
                                                    type: "link",
                                                },
                                            ],
                                        });
                                    }
                                }
                            } else {
                                loanTypes.sub.push({
                                    icon: "i-Receipt-4",
                                    name: list.page.name,
                                    path: list.page.path,
                                    type: "link",
                                });
                            }
                        }
                            break;
                        case Level1.PAYROLL: {
                            if (levels[1]) {
                                if (payroll.sub.length === 0) {
                                    payroll.sub.push({
                                        icon: "i-Align-Justify-Center",
                                        name: levels[1],
                                        type: "dropDown",
                                        sub: [
                                            {
                                                icon: "i-Receipt-4",
                                                name: list.page.name,
                                                path: list.page.path,
                                                type: "link",
                                            },
                                        ],
                                    });
                                } else {
                                    const find = payroll.sub.find(
                                        (s) => s.name === levels[1]
                                    );
                                    if (find) {
                                        find.sub.push({
                                            icon: "i-Receipt-4",
                                            name: list.page.name,
                                            path: list.page.path,
                                            type: "link",
                                        });
                                    } else {
                                        payroll.sub.push({
                                            icon: "i-Align-Justify-Center",
                                            name: levels[1],
                                            type: "dropDown",
                                            sub: [
                                                {
                                                    icon: "i-Receipt-4",
                                                    name: list.page.name,
                                                    path: list.page.path,
                                                    type: "link",
                                                },
                                            ],
                                        });
                                    }
                                }
                            } else {
                                payroll.sub.push({
                                    icon: "i-Receipt-4",
                                    name: list.page.name,
                                    path: list.page.path,
                                    type: "link",
                                });
                            }
                        }
                            break;
                        case Level1.REPORTS: {
                            if (levels[1]) {
                                if (reports.sub.length === 0) {
                                    reports.sub.push({
                                        icon: "i-Align-Justify-Center",
                                        name: levels[1],
                                        type: "dropDown",
                                        sub: [
                                            {
                                                icon: "i-Receipt-4",
                                                name: list.page.name,
                                                path: list.page.path,
                                                type: "link",
                                            },
                                        ],
                                    });
                                } else {
                                    const find = reports.sub.find(
                                        (s) => s.name === levels[1]
                                    );
                                    if (find) {
                                        find.sub.push({
                                            icon: "i-Receipt-4",
                                            name: list.page.name,
                                            path: list.page.path,
                                            type: "link",
                                        });
                                    } else {
                                        reports.sub.push({
                                            icon: "i-Align-Justify-Center",
                                            name: levels[1],
                                            type: "dropDown",
                                            sub: [
                                                {
                                                    icon: "i-Receipt-4",
                                                    name: list.page.name,
                                                    path: list.page.path,
                                                    type: "link",
                                                },
                                            ],
                                        });
                                    }
                                }
                            } else {
                                reports.sub.push({
                                    icon: "i-Receipt-4",
                                    name: list.page.name,
                                    path: list.page.path,
                                    type: "link",
                                });
                            }
                        }
                            break;
                        case Level1.BANK_FILE_CONFIGURATION: {
                            if (levels[1]) {
                                if (bankFileConfiguration.sub.length === 0) {
                                    bankFileConfiguration.sub.push({
                                        icon: "i-Align-Justify-Center",
                                        name: levels[1],
                                        type: "dropDown",
                                        sub: [
                                            {
                                                icon: "i-Receipt-4",
                                                name: list.page.name,
                                                path: list.page.path,
                                                type: "link",
                                            },
                                        ],
                                    });
                                } else {
                                    const find = bankFileConfiguration.sub.find(
                                        (s) => s.name === levels[1]
                                    );
                                    if (find) {
                                        find.sub.push({
                                            icon: "i-Receipt-4",
                                            name: list.page.name,
                                            path: list.page.path,
                                            type: "link",
                                        });
                                    } else {
                                        bankFileConfiguration.sub.push({
                                            icon: "i-Align-Justify-Center",
                                            name: levels[1],
                                            type: "dropDown",
                                            sub: [
                                                {
                                                    icon: "i-Receipt-4",
                                                    name: list.page.name,
                                                    path: list.page.path,
                                                    type: "link",
                                                },
                                            ],
                                        });
                                    }
                                }
                            } else {
                                bankFileConfiguration.sub.push({
                                    icon: "i-Receipt-4",
                                    name: list.page.name,
                                    path: list.page.path,
                                    type: "link",
                                });
                            }
                        }
                            break;
                        case Level1.SETTINGS: {
                            if (levels[1]) {
                                if (settings.sub.length === 0) {
                                    settings.sub.push({
                                        icon: "i-Align-Justify-Center",
                                        name: levels[1],
                                        type: "dropDown",
                                        sub: [
                                            {
                                                icon: "i-Receipt-4",
                                                name: list.page.name,
                                                path: list.page.path,
                                                type: "link",
                                            },
                                        ],
                                    });
                                } else {
                                    const find = settings.sub.find(
                                        (s) => s.name === levels[1]
                                    );
                                    if (find) {
                                        find.sub.push({
                                            icon: "i-Receipt-4",
                                            name: list.page.name,
                                            path: list.page.path,
                                            type: "link",
                                        });
                                    } else {
                                        settings.sub.push({
                                            icon: "i-Align-Justify-Center",
                                            name: levels[1],
                                            type: "dropDown",
                                            sub: [
                                                {
                                                    icon: "i-Receipt-4",
                                                    name: list.page.name,
                                                    path: list.page.path,
                                                    type: "link",
                                                },
                                            ],
                                        });
                                    }
                                }
                            } else {
                                settings.sub.push({
                                    icon: "i-Receipt-4",
                                    name: list.page.name,
                                    path: list.page.path,
                                    type: "link",
                                });
                            }
                        }
                            break;
                    }
                }
            });
        }

        navigations.push(employee);
        navigations.push(payrollPeriods);
        navigations.push(bankDetails);
        navigations.push(payItems);
        navigations.push(loanTypes);
        navigations.push(payroll);
        navigations.push(reports);
        navigations.push(bankFileConfiguration);
        navigations.push(settings);

        this.setState({navigations})
    }

    onMainItemMouseEnter = (item) => {
        if (item.type === "dropDown") {
            this.setSelected(item);
            this.openSecSidenav();
        } else {
            this.setSelected(item);
            this.closeSecSidenav();
        }
    };

    onMainItemMouseLeave = () => {
        // this.closeSecSidenav();
    };

    setSelected = (selectedItem) => {
        this.setState({selectedItem});
        // console.log(selectedItem);
    };

    removeSelected = () => {
        this.setState({selectedItem: null});
        // console.log('removed');
    };

    openSecSidenav = () => {
        let {setLayoutSettings, settings} = this.props;

        setLayoutSettings(
            merge({}, settings, {
                layout1Settings: {
                    leftSidebar: {
                        secondaryNavOpen: true,
                    },
                },
            })
        );
    };

    closeSecSidenav = () => {
        let {setLayoutSettings, settings} = this.props;
        let other = {};

        if (isMobile()) {
            other.open = false;
        }

        setLayoutSettings(
            merge({}, settings, {
                layout1Settings: {
                    leftSidebar: {
                        ...other,
                        secondaryNavOpen: false,
                    },
                },
            })
        );
    };

    closeSidenav = () => {
        let {setLayoutSettings, settings} = this.props;
        setLayoutSettings(
            merge({}, settings, {
                layout1Settings: {
                    leftSidebar: {
                        open: false,
                        secondaryNavOpen: false,
                    },
                },
            })
        );
    };

    openSidenav = () => {
        let {setLayoutSettings, settings} = this.props;
        setLayoutSettings(
            merge({}, settings, {
                layout1Settings: {
                    leftSidebar: {
                        open: true,
                    },
                },
            })
        );
    };

    componentDidMount() {
        if (this.state.selectedItem === null) this.closeSecSidenav();

        this.userNavigations();
        if (window)
            if (window.innerWidth < 1200) {
                this.closeSidenav();
            } else {
                this.openSidenav();
            }

        this.windowListener = window.addEventListener("resize", ({target}) => {
            if (window.innerWidth < 1200) {
                this.closeSidenav();
            } else {
                this.openSidenav();
            }
        });
    }

    componentWillUnmount() {
        if (this.windowListener) {
            window.removeEventListener("resize", this.windowListener);
        }
    }

    render() {
        let {settings} = this.props;

        return (
            <Fragment>
                <div className="side-content-wrap">
                    <Srcollbar
                        className={classList({
                            "sidebar-left o-hidden rtl-ps-none": true,
                            open: settings.layout1Settings.leftSidebar.open,
                        })}
                        // id="mainsidenav"
                    >
                        <ul className="navigation-left">
                            {this.state.navigations.map((item, i) => (
                                <li
                                    className={classList({
                                        "nav-item": true,
                                        active: this.state.selectedItem === item,
                                    })}
                                    onMouseEnter={() => {
                                        this.onMainItemMouseEnter(item);
                                    }}
                                    onMouseLeave={this.onMainItemMouseLeave}
                                    key={i}
                                >
                                    {item.path && item.type !== "extLink" && (
                                        <NavLink className="nav-item-hold" to={item.path}>
                                            <i className={`nav-icon ${item.icon}`}></i>
                                            <span className="nav-text">{item.name}</span>
                                        </NavLink>
                                    )}
                                    {item.path && item.type === "extLink" && (
                                        <a className="nav-item-hold" href={item.path}>
                                            <i className={`nav-icon ${item.icon}`}></i>
                                            <span className="nav-text">{item.name}</span>
                                        </a>
                                    )}
                                    {!item.path && (
                                        <div className="nav-item-hold">
                                            <i className={`nav-icon ${item.icon}`}></i>
                                            <span className="nav-text">{item.name}</span>
                                        </div>
                                    )}
                                    <div className="triangle"></div>
                                </li>
                            ))}
                        </ul>
                    </Srcollbar>

                    <ScrollBar
                        className={classList({
                            "sidebar-left-secondary o-hidden rtl-ps-none": true,
                            open: settings.layout1Settings.leftSidebar.secondaryNavOpen,
                        })}
                    >
                        {this.state.selectedItem && this.state.selectedItem.sub && (
                            <DropDownMenu
                                menu={this.state.selectedItem.sub}
                                closeSecSidenav={this.closeSecSidenav}
                            ></DropDownMenu>
                        )}
                        <span></span>
                    </ScrollBar>
                    <div
                        onMouseEnter={this.closeSecSidenav}
                        className={classList({
                            "sidebar-overlay": true,
                            open: settings.layout1Settings.leftSidebar.secondaryNavOpen,
                        })}
                    ></div>
                </div>
            </Fragment>
        );
    }
}

Layout1Sidenav.propTypes = {
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
    })(Layout1Sidenav)
);
