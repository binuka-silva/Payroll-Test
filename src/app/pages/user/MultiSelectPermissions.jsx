import React from "react";
import Multiselect from 'multiselect-react-dropdown'

const MultiSelectPermissions = ({getSelectedOptions, getRemovedOptions, getPreSelectedOptions, permissionList}) => {
    return (<Multiselect
        displayValue="key"
        onKeyPressFn={function noRefCheck() {
        }}
        onRemove={getRemovedOptions}
        onSearch={function noRefCheck() {
        }}
        selectedValues={getPreSelectedOptions}
        onSelect={getSelectedOptions}
        options={permissionList}
        style={{
            chips: {
                // background: "#663399"
            },
        }}
        placeholder="Permissions"
    />)
}

export default MultiSelectPermissions;
