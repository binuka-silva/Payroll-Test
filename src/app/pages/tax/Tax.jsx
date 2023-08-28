import React, {Component} from "react";
import {Breadcrumb} from "@gull";
import {withRouter} from "react-router-dom";
import TaxList from "./TaxList";

class Tax extends Component {
    state = {};

    componentDidMount = () => window.scrollTo(0, 0);

    componentDidUpdate = (prevProps) => {
        if (this.props.location !== prevProps.location) window.scrollTo(0, 0);
    };

    render() {
        return (
            <>
                <Breadcrumb
                    routeSegments={[
                        {name: "Master", path: "/tax"},
                        {name: "Taxes"},
                    ]}
                ></Breadcrumb>
                <div className="mb-4">
                    <TaxList/>
                </div>
            </>
        );
    }
}

export default withRouter(Tax);
