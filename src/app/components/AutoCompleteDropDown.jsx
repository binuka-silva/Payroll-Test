import React, {useEffect, useState} from "react";
import Select from "react-select";
import {Autocomplete, TextField} from "@mui/material";

const AutoCompleteDropDown = ({
                                  dropDownData,
                                  disabled,
                                  label = " ",
                                  isFreeDropDown = false,
                                  size = "small",
                                  defaultValue,
                                  isGroup,
                                  onChange,
                                  sx,
                                  isLabelVisible = false,
                                  variant = "outlined"
                              }) => {
    const [groupedData, setGroupedData] = useState([]);

    useEffect(() => {
        if (isGroup) {
            const groupedData = groupBy(dropDownData, "title");
            const groupNames = Object.keys(groupedData);
            setGroupedData(groupNames.map(group => ({
                label: group,
                options: groupedData[group]
            })));
        }
    }, []);

    const commonStyles = {
        "& .MuiAutocomplete-input": {
            fontSize: "var(--bs-body-font-size)",
        },
        "& .css-1q60rmi-MuiAutocomplete-endAdornment": {
            top: "calc(50% - 17px)",
        },
        "& .MuiButtonBase-root, & .MuiIconButton-root": {
            padding: "4px 0",
        },
    }

    const groupBy = function (xs, key) {
        return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

    let allStyles;
    if (!isLabelVisible) {
        const removeLabel = {
            "& .MuiInputLabel-root": { // label
                fontSize: "var(--bs-body-font-size)",
            },
            "& .MuiInputLabel-shrink, & .css-1in441m": { // shrinked label
                display: "none"
            },
        }
        allStyles = Object.assign(commonStyles, sx, removeLabel);
    } else {
        allStyles = Object.assign(commonStyles, sx);
    }

    return (
        isGroup ? (
            (defaultValue ? (<Select
                    isDisabled={disabled}
                    disablePortal
                    id="combo-box-demo"
                    options={groupedData}
                    size={size}
                    sx={allStyles}
                    value={defaultValue}
                    defaultValue={defaultValue}
                    onChange={(select, e) => onChange(e, select)}
                    menuPortalTarget={document.body}
                    ListboxProps={{
                        sx: {
                            "& li": {fontSize: "var(--bs-body-font-size)"},
                        }
                    }}
                />)
                : (<Select
                    isDisabled={disabled}
                    disablePortal
                    id="combo-box-demo"
                    options={groupedData}
                    menuPortalTarget={document.body}
                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                    size={size}
                    sx={allStyles}
                    onChange={(select, e) => onChange(e, select)}
                    ListboxProps={{
                        sx: {
                            "& li": {fontSize: "var(--bs-body-font-size)"},
                        }
                    }}
                />))
        ) : isFreeDropDown ? ((<Autocomplete
                disabled={disabled}
                disablePortal
                id="combo-box-demo"
                options={dropDownData.sort((a, b) => a.label?.localeCompare(b.label))}
                size={size}
                sx={allStyles}
                onChange={onChange}
                value={defaultValue ?? ""}
                renderInput={(params) => <TextField {...params} label={label} variant={variant}/>}
                ListboxProps={{
                    sx: {
                        "& li": {fontSize: "var(--bs-body-font-size)"},
                    }
                }}
            />)) :
            (<Select
                isDisabled={disabled}
                disablePortal
                id="combo-box-demo"
                options={dropDownData.sort((a, b) => a.label?.localeCompare(b.label))}
                menuPortalTarget={document.body}
                size={size}
                sx={allStyles}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                onChange={(select, e) => onChange(e, select)}
                value={defaultValue}
                defaultValue={defaultValue}
                ListboxProps={{
                    sx: {
                        "& li": {fontSize: "var(--bs-body-font-size)"},
                    }
                }}
            />)
    )
}

export default AutoCompleteDropDown;
