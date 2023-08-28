/*
import localStorageService from "./services/localStorageService";

const navigations = [];

const userDetails = localStorageService.getItem("auth_user");

const master = {
    name: "Master",
    description: "Lorem ipsum dolor sit.",
    type: "dropDown",
    icon: "i-University",
    sub: []
};

const employee = {
    name: "Employee",
    description: "Lorem ipsum dolor sit.",
    type: "dropDown",
    icon: "i-Administrator",
    sub: [{
            icon: "i-Align-Justify-Center",
            name: "Employees",
            path: "/employees",
            type: "link"
        },
        {
            icon: "i-Align-Justify-Center",
            name: "Employee Template",
            type: "dropDown",
            sub: [{
                    icon: "i-Receipt-4",
                    name: "Employee Templates",
                    path: "/employee-template"
                },
                {
                    icon: "i-Receipt-4",
                    name: "Employee Template Details",
                    path: "/employee-template-details"
                }
            ]
        }
    ]
}

const payroll = {
    name: "Payroll",
    description: "Lorem ipsum dolor sit.",
    type: "dropDown",
    icon: "i-Billing",
    sub: [{
            icon: "i-Align-Justify-Center",
            name: "Payroll Process",
            path: "/dashboard/v1",
            type: "link"
        }, {
            icon: "i-Align-Justify-Center",
            name: "Payroll Period",
            type: "dropDown",
            sub: [{
                    icon: "i-Receipt-4",
                    name: "Payroll Periods",
                    path: "/payroll-periods"
                },
                {
                    icon: "i-Receipt-4",
                    name: "Payroll Period Details",
                    path: "/payroll-period"
                }
            ]
        }, {
            icon: "i-Align-Justify-Center",
            name: "Pay Item Parameters",
            path: "/pay-item-parameter",
            type: "link"
        },
        {
            icon: "i-Align-Justify-Center",
            name: "Pay Item Advance Parameter",
            type: "dropDown",
            sub: [{
                    icon: "i-Receipt-4",
                    name: "Pay Item Advance Parameters",
                    path: "/pay-item-advance-parameter"
                },
                {
                    icon: "i-Receipt-4",
                    name: "Pay Item Advance Parameter Details",
                    path: "/pay-item-advance-parameter-details"
                }
            ]
        },
        {
            icon: "i-Folders",
            name: "Settings",
            path: "/dashboard/v2",
            type: "dropDown",
            sub: [{
                    icon: "i-Receipt-4",
                    name: "Invoice List",
                    path: "/invoice/list"
                },
                {
                    icon: "i-Receipt-4",
                    name: "Create Invoice",
                    path: "/invoice/create"
                }
            ]
        }
    ]
}

if (userDetails) {
    userDetails.role.pages.forEach(page => {
        if (page.name !== "Employees") {
            master.sub.push({
                icon: "i-Receipt-4",
                name: page.name,
                path: page.path,
                type: "link"
            });
        }
    })
}

master.sub.length > 0 && navigations.push(master);
navigations.push(employee);
navigations.push(payroll);

export {
    navigations
};*/
