import React, {useEffect, useState} from "react";
import SimpleCard from "@gull/components/cards/SimpleCard";
import AutoCompleteDropDown from "../../../components/AutoCompleteDropDown";
import Chart from "react-apexcharts";
import "./dashboard.scss";
import dashboardService from "../../../api/dashboardServices/dashboardService";
import {NotificationManager} from "react-notifications";
import payrollProcessService from "../../../api/payrollProcessServices/payrollProcessService";
import localStorageService from "../../../services/localStorageService";

const Dashboard1 = () => {
    const [cardList1, setCardList1] = useState([
        {
            icon: "i-Business-Mens",
            title: <div className="loader-bubble loader-bubble-success text-center"></div>,
            subtitle: <div className="cardSubtitle">Total Employees</div>,
        },
        {
            icon: "i-Business-Man",
            title: <div className="loader-bubble loader-bubble-success"></div>,
            subtitle: "New Employees",
        },
        {
            icon: "i-Checked-User",
            title: <div className="loader-bubble loader-bubble-success"></div>,
            subtitle: "Active Employees",
        },
        {
            icon: "i-Business-ManWoman",
            title: <div className="loader-bubble loader-bubble-success"></div>,
            subtitle: "Inactive Employees",
        },
    ]);
    const [cardList2, setCardList2] = useState([
        {
            icon: "i-Checked-User",
            title: <div className="loader-bubble loader-bubble-primary"></div>,
            subtitle: "Active Employees",
        },
        {
            icon: "i-Business-ManWoman",
            title: <div className="loader-bubble loader-bubble-primary"></div>,
            subtitle: "Resigned Employees",
        },
        {
            icon: "i-Business-Man",
            title: <div className="loader-bubble loader-bubble-primary"></div>,
            subtitle: "New Employees",
        },
    ]);
    const [lastMonthSummary, setLastMonthSummary] = useState([]);
    const [currentMonthSummary, setCurrentMonthSummary] = useState([]);
    const [variancesSummary, setVariancesSummary] = useState([]);
    const [basicReconciliationSummary, setBasicReconciliationSummary] = useState(
        []
    );
    const [payrollProcessList, setPayrollProcessList] = useState([]);
    const [payItemList, setPayItemList] = useState([]);

    const [payroll, setPayroll] = useState(null);
    const [payItem, setPayItem] = useState({});
    const [apexDoughnutChartOptions, setApexDoughnutChartOptions] = useState({});
    const [apexLineChartOptions, setApexLineChartOptions] = useState({});

    useEffect(() => {
        fetchEmpDetails();
        fetchPayrollProcessData();
    }, []);

    useEffect(() => {
        if (payrollProcessList.length > 0 && !payroll) {
            dashboardService()
                .getPayrollDetails(
                    localStorageService.getItem("selected_payroll")?.value ??
                    payrollProcessList.find(
                        (payrollProcess) =>
                            payrollProcess.value ===
                            localStorageService.getItem("auth_user")?.payrollDefinitionId
                    )?.value ??
                    payrollProcessList[0].value
                )
                .then(({data}) => {
                    setPayrollDetails(data);
                })
                .catch((error) => {
                    NotificationManager.error("Failed tp Fetch Payroll Details", "Error");
                    console.error(error);
                });
        }
    }, [payrollProcessList]);

    const setPayrollDetails = (data) => {
        const {
            activeEmployees,
            basicReconciliation,
            currentPeriodTopPayItems,
            newJoins,
            previousPeriodTopPayItems,
            resignedEmployees,
            topVariances,
        } = data;
        setCardList2([
            {
                icon: "i-Checked-User",
                title: activeEmployees,
                subtitle: "Active Employees",
            },
            {
                icon: "i-Business-ManWoman",
                title: resignedEmployees,
                subtitle: "Resigned Employees",
            },
            {
                icon: "i-Business-Man",
                title: newJoins,
                subtitle: "New Employees",
            },
        ]);
        setLastMonthSummary(
            previousPeriodTopPayItems
                .map((item) => ({
                    code: item.code,
                    name: item.name,
                    amount: item.amount,
                    count: item.count,
                }))
                .sort((a, b) => b.amount - a.amount)
        );
        setCurrentMonthSummary(
            currentPeriodTopPayItems
                .map((item) => ({
                    code: item.code,
                    name: item.name,
                    amount: item.amount,
                    count: item.count,
                }))
                .sort((a, b) => b.amount - a.amount)
        );
        setVariancesSummary(
            topVariances.map((item) => ({
                code: item.code,
                name: item.name,
                amount: item.amount.toFixed(2),
                status: item.amount > 0 ? "In Stock" : "Out of Stock",
            }))
        );
        setBasicReconciliationSummary(
            Object.keys(basicReconciliation).map((key) => ({
                code: basicReconciliation[key]?.code,
                amount: basicReconciliation[key]?.amount,
                count: basicReconciliation[key]?.count,
            }))
        );
        const total = currentPeriodTopPayItems
            .map((x) => x.amount)
            .reduce((prev, current) => prev + current, 0);
        const percentageValues = currentPeriodTopPayItems.map((x) =>
            parseFloat((Math.round((x.amount / total) * 100 * 100) / 100).toFixed(2))
        );
        const labels = currentPeriodTopPayItems.map((x) => x.name);

        setApexDoughnutChartOptions({
            series: percentageValues,
            chart: {
                width: "100%",
                type: "donut",
            },
            labels,
            fill: {
                type: "gradient",
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        offset: -5,
                    },
                },
            },
            dataLabels: {
                enabled: false,
            },
            legend: {
                formatter(val, opts) {
                    const name = opts.w.globals.labels[opts.seriesIndex];
                    return [name];
                },
            },

            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 310,
                        },
                        legend: {
                            position: "bottom",
                        },
                    },
                },
            ],
        });
    };

    const fetchEmpDetails = () => {
        dashboardService()
            .getEmpDetails()
            .then(({data}) => {
                const {empCount, activeEmpCount, syncData} = data;
                setCardList1([
                    {
                        icon: "i-Business-Mens",
                        title: empCount,
                        subtitle: "Total Employees",
                    },
                    {
                        icon: "i-Business-Man",
                        title: syncData.addedCount,
                        subtitle: "New Employees",
                    },
                    {
                        icon: "i-Checked-User",
                        title: activeEmpCount,
                        subtitle: "Active Employees",
                    },
                    {
                        icon: "i-Business-ManWoman",
                        title: empCount - activeEmpCount,
                        subtitle: "Inactive Employees",
                    },
                ]);
            })
            .catch((error) => {
                NotificationManager.error("Failed tp Fetch Employee Details", "Error");
                console.error(error);
            });
    };

    const fetchPayrollProcessData = async () => {
        await payrollProcessService()
            .getNames()
            .then(({data: payrollList}) => {
                payrollList = payrollList.map((payrollProcess) => ({
                    value: payrollProcess.id,
                    //label: `${payrollProcess.code} - ${payrollProcess.name}`,
                    label: payrollProcess.name,
                }));
                setPayrollProcessList(payrollList);
                fetchPayItems(payrollList);
            });
    };

    const fetchPayItems = async (payrollList) => {
        try {
            const {data} = await dashboardService().getPayItems(
                localStorageService.getItem("selected_payroll")?.value ??
                payrollList.find(
                    (payrollProcess) =>
                        payrollProcess.value ===
                        localStorageService.getItem("auth_user")?.payrollDefinitionId
                )?.value ??
                payrollList[0].value
            );

            if (data) {
                let payData = data.map((d) => ({value: d.id, label: d.name}));
                setPayItemList(payData);

                payItemData({value: data[0].id}, payrollList);

                setPayItem(payData[0]);
            }
        } catch (e) {
            NotificationManager.error("Failed tp Fetch PayItems", "Error");
            console.error(e);
        }
    };

    const payrollOnChange = async (e, selected) => {
        if (selected) {
            const {data} = await dashboardService().getPayrollDetails(
                selected.value
            );
            setPayrollDetails(data);
            localStorageService.setItem("selected_payroll", selected);
            fetchPayItems(payrollProcessList);
            setPayroll(selected);
        }
    };

    const payItemData = (selected, payrollList = null) => {
        let pay;
        if (payrollList) {
            pay =
                localStorageService.getItem("selected_payroll")?.value ??
                payrollList.find(
                    (payrollProcess) =>
                        payrollProcess.value ===
                        localStorageService.getItem("auth_user")?.payrollDefinitionId
                )?.value ??
                payrollList[0].value;
        } else {
            pay =
                localStorageService.getItem("selected_payroll")?.value ??
                payrollProcessList.find(
                    (payrollProcess) =>
                        payrollProcess.value ===
                        localStorageService.getItem("auth_user")?.payrollDefinitionId
                )?.value ??
                payrollProcessList[0].value;
        }
        dashboardService()
            .getLastMonthSummaryByPayItem(pay, selected.value)
            .then(({data}) => {
                data.sort((a, b) => new Date(b.date) - new Date(a.date));
                const categories = data.map((d) => d.period.dateFrom.split("T")[0]);
                const payItemAmounts = data.map((d) => d.payItemAmount);
                setApexLineChartOptions({
                    chart: {
                        height: 350,
                        type: "line",
                        zoom: {
                            enabled: false,
                        },
                        toolbar: {
                            show: true,
                        },
                    },
                    tooltip: {
                        enabled: true,
                        shared: true,
                        followCursor: false,
                        intersect: false,
                        inverseOrder: false,
                        custom: undefined,
                        fillSeriesColor: false,
                        theme: false,
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    stroke: {
                        curve: "smooth",
                    },
                    series: [
                        {
                            name: "Amounts",
                            data: payItemAmounts,
                        },
                    ],

                    grid: {
                        row: {
                            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                            opacity: 0.5,
                        },
                    },
                    xaxis: {
                        categories,
                    },
                    colors: ["#0A7373"],
                });
                setPayItem(selected);
            })
            .catch((e) => {
                console.error(e);
                NotificationManager.error("Failed tp Fetch PayItem Details", "Error");
            });
    };

    const payItemOnChange = (e, selected) => {
        if (selected) {
            payItemData(selected);
        }
    };

    const getStatusTextColor = (status) => {
        switch (status) {
            case "In Stock":
                return "text-success";
            case "Low Stock":
                return "text-warning";
            case "Out of Stock":
                return "text-danger";
            default:
                return "text-primary";
        }
    };

    return (
        <>
        
        <div>
            
            <div className="div1">
                <h1 className="topic1">Employee Details</h1>
                {/* <hr className="line1"/> */}
                <div className="row1">
                    {cardList1.map((card, index) => (
                        <div key={index} className="">
                            <div className="card card-icon-bg card-icon-bg-success o-hidden m-2 text-center">
                                <div className="top-card-body text-center ">
                                    <i className={card.icon}></i>
                                    <div className="content text-center">
                                        <p className="text-muted  mb-0 text-capitalize text-center">
                                            {card.subtitle}
                                        </p>
                                        <p className="lead text-success text-24 mb-2 text-capitalize">
                                            {card.title}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                
                     
                </div>
                
            </div>
            <div className="card bg-custom-1 payroll text-center inner_div">
           
                {/* <hr className="line1"/> */}
                <div className="row2">
                    
                    <div className="col-lg-4 col-md-4 col-sm-4 ">

                        <div className="card  mb-4 ">
                        <h2 className="topic2">Payroll Statistics</h2>

                            <div className="divDropdown">
                                {/* <div className="col-lg-3 col-md-2 col-sm-2">
                                    <i className="i-Financial"></i>
                                </div> */}
                                <div className="col-md-9 mt-3 mb-3 justify-content-center dropdown">
                                    <AutoCompleteDropDown
                                        dropDownData={payrollProcessList}
                                        size="small"
                                        defaultValue={
                                            localStorageService.getItem("selected_payroll") ??
                                            payrollProcessList.find(
                                                (p) =>
                                                    p.value ===
                                                    localStorageService.getItem("auth_user")
                                                        ?.payrollDefinitionId
                                            ) ??
                                            payrollProcessList[0]
                                        }
                                        onChange={payrollOnChange}
                                        label="Payrolls"
                                        className="listbox"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                   
                </div>

                    <div className="row1">
                {cardList2.map((card, index) => (
                        <div key={index} className="">
                            <div className="card card-icon-bg card-icon-bg-primary o-hidden m-2">
                                <div className="top-card-body text-center">
                                    <i className={card.icon}></i>
                                    <div className="content">
                                        <p className="text-muted mt-2 mb-0 text-capitalize text-center">
                                            {card.subtitle}
                                        </p>
                                        <p className="lead text-primary text-24 mb-2 text-capitalize">
                                            {card.title}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="row3 ">
                    <div className="row3_inner">
                        <SimpleCard title="Last Month Summary" className="mb-4">
                            <div className="row">
                                <div>
                                    <table className="table">
                                        <thead className="thead-light">
                                        <tr>
                                            <th scope="col">PayItem Code</th>
                                            <th scope="col">PayItem Name</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col">Count</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {lastMonthSummary.map((item, index) => (
                                            <tr key={index}>
                                                <td> {item.code}</td>
                                                <td> {item.name}</td>
                                                <td className={getStatusTextColor(item.amount)}>
                                                    {item.amount}
                                                </td>
                                                <td>{item.count}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </SimpleCard>
                    </div>
                    <div className=" row3_inner">
                        <SimpleCard title="Current Month Summary" className="mb-4">
                            <div className="row">
                                <div>
                                    <table className="table">
                                        <thead className="thead-light">
                                        <tr>
                                            <th scope="col">PayItem Code</th>
                                            <th scope="col">PayItem Name</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col">Count</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {currentMonthSummary.map((item, index) => (
                                            <tr key={index}>
                                                <td> {item.code}</td>
                                                <td> {item.name}</td>
                                                <td className={getStatusTextColor(item.amount)}>
                                                    {item.amount}
                                                </td>
                                                <td>{item.count}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </SimpleCard>
                    </div>
                    <div className="col-lg-4 col-md-4 row4">
                        <div className="col-lg-12 col-md-12 row3_inner">
                            <SimpleCard title="Current Month" className="donut">
                                <Chart
                                    options={apexDoughnutChartOptions ?? {}}
                                    series={apexDoughnutChartOptions.series ?? []}
                                    type={apexDoughnutChartOptions.chart?.type ?? "donut"}
                                />
                            </SimpleCard>
                        </div>
                    </div>
                </div>
                <div className="row3 ">
                    
                    <div className=" col-md-3 row3_inner">
                        <SimpleCard title="Top Ten Variances" className="mb-4">
                            <div className="row">
                                <div>
                                    <table className="table">
                                        <thead className="thead-light">
                                        <tr>
                                            <th scope="col"></th>
                                            <th scope="col">Amount</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {variancesSummary.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.name}</td>
                                                <td className={getStatusTextColor(item.status)}>
                                                    {item.amount}%
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </SimpleCard>
                    </div>
                    <div className="col-md-3 row3_inner">
                        <SimpleCard title="Basic Reconciliation" className="mb-4">
                            <div className="row">
                                <div>
                                    <table className="table">
                                        <thead className="thead-light">
                                        <tr>
                                            <th scope="col"></th>
                                            <th scope="col">Amount</th>
                                            <th scope="col">Count</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {basicReconciliationSummary.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.code}</td>
                                                <td className={getStatusTextColor(item.status)}>
                                                    {item.amount}
                                                </td>
                                                <td>{item.count}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </SimpleCard>
                    </div>
                    <div className=" col-md-5 row3_inner">
                        <SimpleCard title="Last 6 Month Summary">
                            <div className="row">
                                <div className=" col-md-4"></div>
                                <div className=" col-md-4"></div>
                                <div className=" col-md-4 justify-content-end">
                                    <AutoCompleteDropDown
                                        dropDownData={payItemList}
                                        onChange={payItemOnChange}
                                        size={"small"}
                                        label="Search"
                                        defaultValue={
                                            payItemList?.find((v) => v.value === payItem.value) ??
                                            payItemList[0]
                                        }
                                        className="listbox"
                                    />
                                </div>
                            </div>
                            <Chart
                                options={apexLineChartOptions ?? {}}
                                series={apexLineChartOptions.series ?? []}
                                type={apexLineChartOptions.chart?.type ?? "line"}
                            />
                        </SimpleCard>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Dashboard1;
