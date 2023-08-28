import React from "react";
import {Link, withRouter} from "react-router-dom";
//import "./styles/payrollButton.css";
import {ButtonGroup, IconButton} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SaveIcon from '@mui/icons-material/Save';
import {FindInPage} from "@material-ui/icons";

const STYLES = [
    "btn--primary--solid",
    "btn--warning--solid",
    "btn--danger--solid",
    "btn--success--solid",
    "btn--primary--outline",
    "btn--warning--outline",
    "btn--danger--outline",
    "btn--success--outline",
];

const SIZES = ["btn--medium", "btn--large"];

const PayrollButton = ({
                           children,
                           type,
                           onClick,
                           onClickUpdate,
                           onClickSave,
                           onClickAdd,
                           onClickSearch,
                           buttonStyle,
                           buttonSize,
                           Add,
                           Save,
                           Update,
                           toCreate,
                           toList,
                           disabled,
                       }) => {
    const checkButtonStyle = STYLES.includes(buttonStyle)
        ? buttonStyle
        : STYLES[0];

    const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];
    return (
        <>
            {/* <button
        className={`btn ${checkButtonStyle} ${checkButtonSize}`}
        onClick={onClick}
        type={type}
      >
        {children}
      </button> */}

            <div className="row">
                <ButtonGroup
                    color="secondary"
                    aria-label="medium button group"
                    variant="contained"
                >
                    {Add && (
                        <IconButton
                            aria-label="add"
                            size="medium"
                            color="primary"
                            onClick={onClickAdd}
                            type={type}
                            disabled={disabled}
                        >
                            <AddIcon fontSize="medium" style={{color: "purple"}}/>
                            {children}
                        </IconButton>
                    )}
                    {Update && (
                        <IconButton
                            aria-label="update"
                            size="medium"
                            color="primary"
                            onClick={onClickUpdate}
                            type={type}
                            disabled={disabled}
                        >
                            <EditIcon fontSize="medium" style={{color: "purple"}}/>
                            {children}
                        </IconButton>
                    )}
                    {Save && (
                        <IconButton
                            aria-label="update"
                            size="medium"
                            color="primary"
                            onClick={onClickSave}
                            type={type}
                            disabled={disabled}
                        >
                            <SaveIcon fontSize="medium" style={{color: "purple"}}/>
                            {children}
                        </IconButton>
                    )}
                    {onClickSearch && (
                        <IconButton
                            aria-label="search"
                            size="medium"
                            color="primary"
                            onClick={onClick}
                            type={type}
                            disabled={disabled}
                        >
                            <FindInPage fontSize="medium" style={{color: "purple"}}/>
                            {children}
                        </IconButton>
                    )}

                    {toCreate && (
                        <Link to={toCreate}>
                            <IconButton
                                aria-label="create"
                                size="medium"
                                color="primary"
                                onClick={onClick}
                                type={type}
                            >
                                <AddBoxIcon fontSize="medium" style={{color: "purple"}}/>
                                {children}
                            </IconButton>
                        </Link>
                    )}
                    {toList && (
                        <Link to={toList}>
                            <IconButton
                                aria-label="list"
                                size="medium"
                                color="primary"
                                onClick={onClick}
                                type={type}
                            >
                                <ArrowBackIcon fontSize="medium" style={{color: "purple"}}/>
                                {children}
                            </IconButton>
                        </Link>
                    )}
                </ButtonGroup>
            </div>
        </>
    );
};

export default withRouter(PayrollButton);
