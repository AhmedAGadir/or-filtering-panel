import React, { useState, useEffect } from 'react';
import DataContext from './DataContext.js';
import Select from 'react-select';
import { capatalise } from './_utils.js';

const OrFilterPanel = props => {
    const [availableFilterOptions, setAvailableFilterOptions] = useState({});
    const [selectedFilterOptions, setSelectedFilterOptions] = useState({});
    const dataContext = React.useContext(DataContext);

    useEffect(() => {
        if (
            dataContext.rowData && dataContext.rowData.length > 0
            && props.columnDefs && props.columnDefs.length > 0
        ) {
            initFilterOptions();
        }
    }, [dataContext.rowData, props.columnDefs]);

    useEffect(() => {
        applyFilter();
    }, [selectedFilterOptions])

    const initFilterOptions = () => {
        let availableFilterOptions = {};
        let selectedFilterOptions = {};

        props.columnDefs.forEach(({ field }) => {
            availableFilterOptions[field] = new Set();
            selectedFilterOptions[field] = [];
        });

        dataContext.rowData.forEach(row => {
            Object.entries(row).forEach(([field, value]) => availableFilterOptions[field].add(value))
        });

        setAvailableFilterOptions(availableFilterOptions);
        setSelectedFilterOptions(selectedFilterOptions);

    }

    const selectChangeHandler = (selectedOptions, field) => {
        let updatedSelectedFilterOptions = { ...selectedFilterOptions };
        updatedSelectedFilterOptions[field] = selectedOptions.map(option => option.value);
        setSelectedFilterOptions(updatedSelectedFilterOptions);
    }

    const applyFilter = () => {
        let updatedFilteredRowData;
        let noSelectedFilterOptions = Object.values(selectedFilterOptions).every(selectedFilters => selectedFilters.length === 0);

        if (noSelectedFilterOptions) {
            updatedFilteredRowData = dataContext.rowData.map(row => ({ ...row }));
        } else {
            updatedFilteredRowData = dataContext.rowData
                .map(row => ({ ...row }))
                .filter(row => {
                    // If a row's values contains any selected filter options then pass
                    return Object.entries(row).some(([field, value]) => {
                        return selectedFilterOptions[field].some(selectedFilters => selectedFilters === value)
                    });
                });
        }
        // update context
        dataContext.setFilteredRowData(updatedFilteredRowData);
    }

    return (
        <form >
            <h2>Or-Filter Panel</h2>
            {props.columnDefs.map(({ field }) => availableFilterOptions && availableFilterOptions[field] ? (
                <div key={field} className="my-form-control">
                    <label>{capatalise(field)}</label>
                    <Select
                        options={Array.from(availableFilterOptions[field]).map(option => ({ value: option, label: option }))}
                        isMulti
                        onChange={(params) => selectChangeHandler(params, field)}
                    />
                </div>
            ) : null
            )}
        </form>
    )
}

export default OrFilterPanel;