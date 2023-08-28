import * as React from 'react';
import {enableRipple} from '@syncfusion/ej2-base';
import {TreeViewComponent} from '@syncfusion/ej2-react-navigations';

enableRipple(true);

const EmployeeDetailsSelectedList = ({criteriaList, fetchCriteriaDataFunc}) => {
    const field = {dataSource: criteriaList, id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChild'};
    const isChecked = true;

    const nodeChecked = (args) => fetchCriteriaDataFunc(args);

    return (
        <TreeViewComponent fields={field} showCheckBox={isChecked} nodeChecked={nodeChecked}/>);
}

export default EmployeeDetailsSelectedList;
