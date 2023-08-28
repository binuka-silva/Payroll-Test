import React, {Fragment, useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import bankFileConfiguratorService from "app/api/bankDisketteServices/bankFileConfiguratorService";
import {NotificationManager} from "react-notifications";
import AutoCompleteDropDown from "../../components/AutoCompleteDropDown";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import {useSelector} from "react-redux";

const PayrollBankDisketteModal = ({
                                      show,
                                      setShow,
                                      fixedpayrollPayItemData,
                                      payrollProcessData,
                                      ...props
                                  }) => {

    const [bankFileLineTypeData, setBankFileLineTypeData] = useState([]);
    const [selectedValues, setSelectedValues] = useState([]);
    //const [defaultSalaryItem, setDefaultSalaryItem] = useState(false);
    const [payItem, setPayItem] = useState("");
    const [configuratorId, setConfiguratorId] = useState("");

    const bankFile = useSelector((state) => state.bankFile);

    //Component did mount only
    useEffect(() => {
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        fetchBankConfLineData();
    }, []);

    //Load data
    function fetchBankConfLineData() {
        const bankFileLineTypeDataArray = bankFile.bankFileConfigurator.filter((v) => v.lineType.multiLines === true);
        const confLineTypeDataArray = bankFileLineTypeDataArray.map((lType) => ({
            confId: lType.id,
            lineTypeId: lType.lineType.id,
            label: lType.lineType.lineName,
            sequence: lType.sequence,
            labelWithSequence: `${lType.sequence} - ${lType.lineType.lineName}`,
            payItemLabel: fixedpayrollPayItemData.find((v) => v.value === lType.payrollPayItemForLineTypeId)?.label ?? "",
            payItemValue: fixedpayrollPayItemData.find((v) => v.value === lType.payrollPayItemForLineTypeId)?.value ?? "",
            defaultSalaryItem: (lType.payrollPayItemForLineTypeId === (fixedpayrollPayItemData.find((v) => v.value === payrollProcessData.find((p) => p.payrollPayItemForNetSalaryId === v.value)?.payrollPayItemForNetSalaryId)?.value)) ? true : false
        }));
        setBankFileLineTypeData(confLineTypeDataArray);
        setSelectedValues([...selectedValues, ...confLineTypeDataArray]);
    }

    const handleClose = () => {
        setShow(false);
    };

    const addPayrollPayItem = () => {
        new Promise((resolve, reject) => {

            // let lineId = fixedpayrollPayItemData.find((v) => v.value === selectedValues.find((p)=>p.payItemValue === v.value)?.payItemValue)?.value;
            // let confId = selectedValues.find((v) => v.payItemValue === fixedpayrollPayItemData.find((p)=>p.value === v.payItemValue)?.value)?.confId;

            //  //Obj Create
            // const payItemId = {
            //   id: confId,
            //   payrollPayItemForLineTypeId: lineId,
            // };

            const payItemId = selectedValues.map((bf) => ({
                id: bf.confId,
                payrollPayItemForLineTypeId: bf.payItemValue,
                //payrollPayItemForLineTypeId: bf.payItemValue !== "" ? bf.payItemValue : (fixedpayrollPayItemData.find((v) => v.value === (payrollProcessData.find((p) =>p.payrollPayItemForNetSalaryId === v.value)?.payrollPayItemForNetSalaryId))?.value),

            }));

            bankFileConfiguratorService().updatePayrollPayItem(payItemId, configuratorId).then((response) => {
                handleClose();
                NotificationManager.success("A record was successfully created.", "Success");

                //Reload list
                resolve();


            })
                .catch((error) => {
                    console.error(error);
                    NotificationManager.error("An existing record already found", "Error");
                    reject();
                });
        });
    };

    return (
        <Fragment>
            <Modal
                //size="sm"
                style={{width: "450px", marginLeft: "550px", marginTop: "100px"}}
                show={show}
                onHide={handleClose}
                {...props}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Bank Diskette Line Types</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">
                            Salary Transfer Item
                        </FormLabel>
                        <br/>
                        <RadioGroup
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                        >
                            {bankFileLineTypeData.map((type) => (
                                <Fragment key={type.confId}>
                                    <div className="row">
                                        <div className="col-md-5">
                                            <FormControlLabel
                                                checked={selectedValues.find(v => v.confId === type.confId)?.defaultSalaryItem}
                                                label={type.labelWithSequence}
                                                key={type.confId}
                                                id={type.confId}
                                                control={<Radio/>}
                                                labelPlacement="start"
                                                onChange={(e) => {
                                                    let a = selectedValues.find((v) => v.confId === type.confId);
                                                    let b = selectedValues.filter((v) => v.confId !== type.confId);
                                                    a.payItemLabel = (fixedpayrollPayItemData.find((v) => v.value === (payrollProcessData.find((p) => p.payrollPayItemForNetSalaryId === v.value)?.payrollPayItemForNetSalaryId))?.label);
                                                    a.payItemValue = (fixedpayrollPayItemData.find((v) => v.value === (payrollProcessData.find((p) => p.payrollPayItemForNetSalaryId === v.value)?.payrollPayItemForNetSalaryId))?.value);

                                                    if (e.target.checked) {
                                                        a.defaultSalaryItem = true;
                                                        let c = b.map((radio) => ({
                                                            ...radio,
                                                            defaultSalaryItem: false
                                                        }))
                                                        c.push(a)
                                                        setSelectedValues(c)
                                                    } else {
                                                        a.defaultSalaryItem = false;
                                                    }

                                                    //setDefaultSalaryItem(true);
                                                    setConfiguratorId(type.confId);
                                                }}
                                            />
                                        </div>

                                        <div className="col-md-6" id={type.confId}>
                                            <AutoCompleteDropDown
                                                dropDownData={fixedpayrollPayItemData}
                                                isFreeDropDown={true}
                                                onChange={(e, selected) => {

                                                    let a = selectedValues.find((v) => v.confId === type.confId);
                                                    a.payItemLabel = selected?.label;
                                                    a.payItemValue = selected?.value;
                                                    //setPayItem(selected?.value);
                                                    setConfiguratorId(type.confId);
                                                }}
                                                sx={{
                                                    width: 200,
                                                    "& .css-1q60rmi-MuiAutocomplete-endAdornment": {
                                                        top: "calc(50% - 17px)",
                                                    },
                                                    "& .MuiButtonBase-root, & .MuiIconButton-root": {
                                                        padding: "4px",
                                                    },
                                                }}
                                                size={"small"}
                                                label="Search"
                                                defaultValue={(Object.keys(selectedValues.find(v => v.confId === type.confId)?.payItemLabel).length === 0) && (selectedValues.find(v => v.confId === type.confId)?.defaultSalaryItem) === true ? (fixedpayrollPayItemData.find((v) => v.value === (payrollProcessData.find((p) => p.payrollPayItemForNetSalaryId === v.value)?.payrollPayItemForNetSalaryId))?.label) : (selectedValues.find(v => v.confId === type.confId)?.payItemLabel) ?? ""}
                                            />
                                        </div>
                                        <br/>
                                    </div>
                                    <br/>
                                </Fragment>
                            ))}
                        </RadioGroup>
                    </FormControl>
                </Modal.Body>
                <Modal.Footer className="justify-content-end">
                    <Button className="px-3" variant="secondary" onClick={handleClose}>
                        Close
                    </Button>

                    <Button
                        className="px-3"
                        variant="primary"
                        type="submit"
                        onClick={addPayrollPayItem}
                    >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default PayrollBankDisketteModal;
