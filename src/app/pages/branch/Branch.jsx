import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import {useHistory} from "react-router-dom";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import branchService from "../../api/branchServices/branchService";
import BranchList from "./BranchList";
import {connect, useSelector} from "react-redux";

import {setBankDetails} from "../../redux/actions/BankDetailsAction";

const Branch = ({setBankDetails}) => {
    const [branchList, setBranchList] = useState([]);
    const [branches, setBranches] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [size, setSize] = useState(0);

    const bank = useSelector((state) => state.bankDetails);

    let history = useHistory();

    history.listen(nextLocation => {
        if (nextLocation.pathname != '/branch') {
            setBankDetails({id: null});
        }
    });

    useEffect(() => {
        window.scrollTo(0, 0);
       
    }, []);

    const fetchBranchData = async () => {
        setLoading(true);
        await branchService()
            .getAll()
            .then(({data}) => {
                data = data.map(branch => ({
                    id: branch.id,
                    bankId: branch.bank?.name,
                    code: branch.code,
                    name: branch.name,
                    referenceCode: branch.referenceCode,
                    address: branch.address,
                    createdBy: branch.createdBy,
                }));
                if (bank.id == null) {
                    setBranchList(data);
                    setLoading(false);
                    return;
                }
                setBranchList(data.filter(data => data.bankId == bank.name));
                setLoading(false);
            })
    };


    return (
        <>
            <div className="row">
                <div className="col-md-12 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Home", path: "/dashboard/v1/"},
                            {name: "Bank", path: "/bank"},
                            {name: "Branch"},
                        ]}
                    ></Breadcrumb>
                </div>
              
            </div>

            <div className="row">
                <BranchList
                    fetchBranchDataFunc={fetchBranchData}
                    branchList={branchList}
                    isLoading={isLoading}
                />
            </div>
            <NotificationContainer/>
        </>
    );
};

const mapStateToProps = (state) => ({setBankDetails: state.setBankDetails,});

export default connect(mapStateToProps, {setBankDetails,})(Branch);






// import axios from "axios";
// import { SimpleCard } from "@gull";
// import { Breadcrumb } from "@gull";
// import React, {useEffect, useState} from "react";
// import BootstrapTable from "react-bootstrap-table-next";
// import paginationFactory from "react-bootstrap-table2-paginator";
// import ToolkitProvider, {
//   Search,
// } from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

// const Branch = () => {
//   const [state, setState] = useState({
//     userList: [],
//   });

//   const sortableColumn = [
//     {
//       dataField: "index",
//       text: "No",
//       sort: true,
//     },
//     {
//       dataField: "name",
//       text: "User Name",
//       sort: true,
//     },
//     {
//       dataField: "email",
//       text: "User Email",
//       sort: true,
//     },
//     {
//       dataField: "company",
//       text: "Company",
//       sort: true,
//     },
//     {
//       dataField: "balance",
//       text: "Balance",
//       sort: true,
//       align: "center",
//       headerAlign: "center",
//     },
//     {
//       dataField: "age",
//       text: "Age",
//       sort: true,
//       align: "center",
//       headerAlign: "center",
//     },
//   ];

//   const paginationOptions = {
//     // custom: true,
//     paginationSize: 5,
//     pageStartIndex: 1,
//     firstPageText: "First",
//     prePageText: "Back",
//     nextPageText: "Next",
//     lastPageText: "Last",
//     nextPageTitle: "First page",
//     prePageTitle: "Pre page",
//     firstPageTitle: "Next page",
//     lastPageTitle: "Last page",
//     showTotal: true,
//     totalSize: state.userList.length,
//   };

//   useEffect(() => {
//     axios.get("/api/user/all").then(({ data }) => {
//       let userList = data.map(
//         ({ id, name, email, age, company, balance }, ind) => ({
//           id,
//           name,
//           email,
//           age,
//           balance,
//           company,
//           index: ind + 1,
//         })
//       );
//       setState({ userList });
//     });
//   }, []);

//   let { userList } = state;
//   let { SearchBar } = Search;

//   return (
//     <div>
//       <Breadcrumb
//         routeSegments={[
//           { name: "Dashboard", path: "/" },
//           { name: "Data Table", path: "data-table" },
//           { name: "Searchable Data Table" },
//         ]}
//       />
//       <SimpleCard title="Searchable Data Table">
//         <ToolkitProvider
//           striped
//           keyField="id"
//           data={userList}
//           columns={sortableColumn}
//           search
//         >
//           {(props) => (
//             <>
//               <div className="d-flex justify-content-end align-items-center">
//                 <span className="mb-2 me-1">Search:</span>
//                 <SearchBar {...props.searchProps} className="mb-2" />
//               </div>
//               <BootstrapTable
//                 {...props.baseProps}
//                 bootstrap4
//                 pagination={paginationFactory(paginationOptions)}
//                 noDataIndication={"Table is empty"}
//               />
//             </>
//           )}
//         </ToolkitProvider>
//       </SimpleCard>
//     </div>
//   );
// };

// export default Branch;
