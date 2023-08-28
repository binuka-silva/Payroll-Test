import React from "react";
import {Link, withRouter} from "react-router-dom";
import {IconButton} from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

const PayrollNavBar = ({addDataPath, returnPath}) => {

    return (
        <div className="row">
            {addDataPath && <Link to={addDataPath}>
                <IconButton aria-label="add" size="medium">
                    <AddBoxIcon fontSize="medium"/>
                </IconButton>
            </Link>}
            {returnPath && <Link to={returnPath}>
                <IconButton aria-label="return" size="medium">
                    <RemoveRedEyeIcon fontSize="medium"/>
                </IconButton>
            </Link>}
        </div>
    );
};

export default withRouter(PayrollNavBar);
