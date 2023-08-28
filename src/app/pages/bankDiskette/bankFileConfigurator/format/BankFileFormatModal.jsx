import React, {Fragment, useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import {classList} from "@utils";
import {NotificationManager} from "react-notifications";
import AutoCompleteDropDown from "../../../../components/AutoCompleteDropDown";
import {FIELD_TYPES, FILL_DIRECTIONS, FUNCTION_CODES, TRIM_TYPES} from "./constant";
import bankFileFormatService from "../../../../api/bankDisketteServices/bankFileFormatService";
import {useSelector} from "react-redux";

const BankFileFormatModal = ({
                                 employeeParameterList,
                                 payItemGroupList,
                                 payrollParameterList,
                                 companyCategoryList,
                                 functionData,
                                 tableData,
                                 bankFileList,
                                 editData,
                                 fetchBankFileFormatData,
                                 show,
                                 setShow,
                                 ...props
                             }) => {
    const [trimData, setTrimData] = useState([]);
    const [fillDirectionData, setFillDirectionData] = useState([]);
    const [trim, setTrim] = useState(null);
    const [fillDirection, setFillDirection] = useState(null);
    const [selectedFunc, setSelectedFunc] = useState(null);
    const [selection, setSelection] = useState(null);
    const [category, setCategory] = useState(null);

    const [sequence, setSequence] = useState(0);
    const [length, setLength] = useState(0);
    const [fillWith, setFillWith] = useState("");
    const [freeText, setFreeText] = useState("");

    const bankFileConfig = useSelector((state) => state.bankFileConfig);

    const handleClose = () => {
        setShow(false);

        setTrim(null);
        setSequence(0);
        setSelection(null);
        setFillDirection(null);
        setSelectedFunc(null);
        setLength(0);
        setFillWith("");
        setCategory(null);
        setFreeText("");
    };

    useEffect(() => {
        // Clear all notifications
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));

        const tempTrimData = [
            {label: Object.keys(TRIM_TYPES)[0], value: TRIM_TYPES.LEFT_TRIM},
            {label: Object.keys(TRIM_TYPES)[1], value: TRIM_TYPES.RIGHT_TRIM},
            {label: Object.keys(TRIM_TYPES)[2], value: TRIM_TYPES.TRIM},
        ];
        const tempDirectionData = [
            {label: Object.keys(FILL_DIRECTIONS)[0], value: FILL_DIRECTIONS.LEFT},
            {label: Object.keys(FILL_DIRECTIONS)[1], value: FILL_DIRECTIONS.RIGHT},
        ]
        setTrimData(tempTrimData)
        setFillDirectionData(tempDirectionData)

        if (editData) {
            const func = functionData.find(f => f.value === editData.functionCode);
            setSelectedFunc(func);
            const selectionData = func?.value === FUNCTION_CODES.FITEMGRP ? payItemGroupList
                : func?.value === FUNCTION_CODES.FPAYPARA ? payrollParameterList : func?.value === FUNCTION_CODES.FPARAEMP ? employeeParameterList
                    : func?.value === FUNCTION_CODES.FGETCOM ? [FIELD_TYPES.bank, FIELD_TYPES.branch, FIELD_TYPES.accountNumber]
                        : func?.value === FUNCTION_CODES.FGETBANKEMPVAL ? [FIELD_TYPES.bank, FIELD_TYPES.branch, FIELD_TYPES.accountNumber, FIELD_TYPES.bankSequence, FIELD_TYPES.amount]
                            : func?.value === FUNCTION_CODES.FGETEMPVAL ? [FIELD_TYPES.employeeName, FIELD_TYPES.initials, FIELD_TYPES.nic, FIELD_TYPES.empNo] : [];

            if (func?.value === FUNCTION_CODES.FGETEMPVAL || func?.value === FUNCTION_CODES.FGETBANKEMPVAL) {
                setSelection(selectionData.find(s => s.label === editData.format.substring(editData.format.split(" ", 1)[0].length).trim()))
            } else if (func?.value === FUNCTION_CODES.FGETCOM) {
                setCategory(companyCategoryList.find(s => s.value === parseInt(editData.format.split(" ")[1].split(";")[0])));
                setSelection(selectionData.find(s => s.label === editData.format.substring(editData.format.split(" ", 1)[0].length).trim().split(";")[1]))
            } else if (func?.value === FUNCTION_CODES.FFREETEXT || func?.value === FUNCTION_CODES.FEFFECTIVEDATE) {
                setFreeText(editData.format.substring(editData.format.split(" ", 1)[0].length).trim());
            } else {
                setSelection(selectionData.find(s => s.code === editData.format.substring(editData.format.split(" ", 1)[0].length).trim()))
            }

            setFillDirection(tempDirectionData.find(fill => fill.label === editData.fillDirection));
            setTrim(tempTrimData.find(t => t.label === editData.trim));
            setSequence(editData.sequence);
            setLength(editData.length);
            setFillWith(editData.fillWith);
        }
    }, []);

    const handleSubmit = () => {
        if (tableData.find(data => data.sequence === sequence))
            return NotificationManager.error("Duplicate Sequence", "Error");

        bankFileFormatService().create({
            sequence,
            functionCode: selectedFunc.value,
            lineFormat: category ? `${category?.value};${selection?.value}` : freeText.length > 0 ? freeText : selection?.value,
            bankFileConfiguratorId: bankFileConfig.id,
            length,
            trim: trim.value,
            fillWith,
            fillDirection: fillDirection.value,
        }).then(({data}) => {
            fetchBankFileFormatData();
            handleClose();
            NotificationManager.success(
                "Format successfully Added",
                "Success"
            );
        }).catch(err => {
            console.error(err);
            NotificationManager.error(
                "Saving Failed",
                "Error"
            );
        })
    };

    const handleUpdate = () => {
        if (tableData.filter(data => data.sequence !== editData.sequence).find(data => data.sequence === sequence))
            return NotificationManager.error("Duplicate Sequence", "Error");

        bankFileFormatService().update(editData.id, {
            sequence,
            functionCode: selectedFunc.value,
            lineFormat: category ? `${category?.value};${selection?.value}` : freeText.length > 0 ? freeText : selection?.value,
            bankFileConfiguratorId: bankFileConfig.id,
            length,
            trim: trim.value,
            fillWith,
            fillDirection: fillDirection.value,
        }).then(({data}) => {
            fetchBankFileFormatData();
            handleClose();
            NotificationManager.success(
                "Format successfully Updated",
                "Success"
            );
        }).catch(err => {
            console.error(err);
            NotificationManager.error(
                "Saving Failed",
                "Error"
            );
        })
    };

    return (
        <Fragment>
            <Modal show={show} onHide={handleClose} {...props}>
                <Modal.Header closeButton>
                    {editData ? <Modal.Title>Update</Modal.Title> : <Modal.Title>Add</Modal.Title>}
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className={classList({"col-md-12 mb-2": true})}>
                            <label htmlFor="validationCustom222">Function</label>
                            <AutoCompleteDropDown
                                dropDownData={functionData?.map(func => ({
                                    ...func,
                                    label: `${func.label} - ${func.description.substring(0, 35)}`
                                })) ?? []}
                                onChange={(e, selected) => {
                                    selected && setSelectedFunc(selected);
                                }}
                                isFreeDropDown={true}
                                defaultValue={functionData?.filter(func => func.value === selectedFunc?.value)?.map(func => ({
                                    value: func.id,
                                    label: `${func.label} - ${func.description.substring(0, 35)}`
                                }))[0]}
                                label="Format Function"
                            />
                        </div>
                        <div className={classList({"col-md-12 mb-3": true})}>
                            {(selectedFunc?.value === FUNCTION_CODES.FGETCOM) && (
                                <>
                                    <label htmlFor="validationCustom222">Category</label>
                                    <AutoCompleteDropDown
                                        dropDownData={selectedFunc?.value === FUNCTION_CODES.FGETCOM ? companyCategoryList : []}
                                        onChange={(e, selected) => {
                                            setCategory(selected);
                                        }}
                                        defaultValue={category}
                                        label="Category"
                                    />
                                </>
                            )}
                            {!(selectedFunc?.value === FUNCTION_CODES.FGETBANKDVAL || selectedFunc?.value === FUNCTION_CODES.FGETBANKDROWVAL
                                || selectedFunc?.value === FUNCTION_CODES.FGETSUMEMPBANKVAL || selectedFunc?.value === FUNCTION_CODES.FFREETEXT
                                || selectedFunc?.value === FUNCTION_CODES.FEFFECTIVEDATE) && (
                                <>
                                    <label htmlFor="validationCustom222">Selection</label>
                                    <AutoCompleteDropDown
                                        dropDownData={selectedFunc?.value === FUNCTION_CODES.FITEMGRP ? payItemGroupList
                                            : selectedFunc?.value === FUNCTION_CODES.FPAYPARA ? payrollParameterList : selectedFunc?.value === FUNCTION_CODES.FPARAEMP ? employeeParameterList
                                                : selectedFunc?.value === FUNCTION_CODES.FGETBANKEMPVAL ? [FIELD_TYPES.bank, FIELD_TYPES.branch, FIELD_TYPES.accountNumber, FIELD_TYPES.bankSequence, FIELD_TYPES.amount]
                                                    : selectedFunc?.value === FUNCTION_CODES.FGETEMPVAL ? [FIELD_TYPES.employeeName, FIELD_TYPES.initials, FIELD_TYPES.nic, FIELD_TYPES.empNo]
                                                        : selectedFunc?.value === FUNCTION_CODES.FGETCOM ? [FIELD_TYPES.bank, FIELD_TYPES.branch, FIELD_TYPES.accountNumber]
                                                            : []}
                                        onChange={(e, selected) => {
                                            setSelection(selected);
                                        }}
                                        isFreeDropDown={true}
                                        defaultValue={selection}
                                        label="Selection"
                                    />
                                </>
                            )}
                            {((selectedFunc?.value === FUNCTION_CODES.FFREETEXT) || (selectedFunc?.value === FUNCTION_CODES.FEFFECTIVEDATE)) &&
                                (<div className={classList({"col-md-12 mb-2": true})}>
                                    <label
                                        htmlFor="validationCustom222">{selectedFunc?.value === FUNCTION_CODES.FFREETEXT ? "Text" : "Pattern"}</label>
                                    <input
                                        className="form-control"
                                        id="validationCustom222"
                                        placeholder="Text"
                                        value={freeText ?? ""}
                                        onChange={(e) => setFreeText(e.target.value)}
                                        required
                                    />
                                </div>)
                            }
                        </div>
                    </div>
                    <div className="row">
                        <div className={classList({"col-md-12 mb-2": true,})}>
                            <label htmlFor="validationCustom222">Sequence</label>
                            <input
                                type="number"
                                className="form-control"
                                id="validationCustom222"
                                placeholder="Sequence"
                                min={0}
                                value={sequence}
                                onChange={(e) => setSequence(parseInt(e.target.value))}
                                required
                            />
                        </div>
                        <div className={classList({"col-md-12 mb-2": true})}>
                            <label htmlFor="validationCustom222">Length</label>
                            <input
                                type="number"
                                className="form-control"
                                id="validationCustom222"
                                placeholder="length"
                                min={0}
                                value={length}
                                onChange={(e) => setLength(parseInt(e.target.value))}
                                required
                            />
                        </div>
                        <div className={classList({"col-md-12 mb-2": true})}>
                            <label htmlFor="validationCustom222">Trim</label>
                            <AutoCompleteDropDown
                                dropDownData={trimData ?? []}
                                isFreeDropDown={true}
                                onChange={(e, selected) => {
                                    setTrim(selected);
                                }}
                                defaultValue={trim}
                                label="Select Trim Method"
                            />
                        </div>
                        <div className={classList({"col-md-12 mb-2": true})}>
                            <label htmlFor="validationCustom222">Fill With</label>
                            <input
                                className="form-control"
                                id="validationCustom222"
                                placeholder="Fill With"
                                maxLength={1}
                                value={fillWith}
                                onChange={(e) => setFillWith(e.target.value)}
                                required
                            />
                        </div>
                        <div className={classList({"col-md-12 mb-3": true})}>
                            <label htmlFor="validationCustom222">Fill Method</label>
                            <AutoCompleteDropDown
                                dropDownData={fillDirectionData ?? []}
                                onChange={(e, selected) => {
                                    setFillDirection(selected);
                                }}
                                isFreeDropDown={true}
                                defaultValue={fillDirection}
                                label="Select Fill Method"
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {editData ? <Button variant="primary" type="submit" onClick={handleUpdate}>
                        Update
                    </Button> : <Button variant="primary" type="submit" onClick={handleSubmit}>
                        Save Changes
                    </Button>}
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default BankFileFormatModal;
