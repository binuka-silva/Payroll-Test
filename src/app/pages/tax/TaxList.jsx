import React, {Component} from "react";
import axios from "axios";


class TaxList extends Component {
    state = {
        userList: []
    };

    componentDidMount() {
        axios.get("/api/user/all").then(({data}) => {
            let userList = data.map(
                ({id, name, email, age, company, balance}, ind) => ({
                    id,
                    name,
                    email,
                    age,
                    balance,
                    company,
                    index: ind + 1
                })
            );
            this.setState({userList});
        });
    }


    render() {
        return (
            <>
            </>
        );
    }
}

export default TaxList;