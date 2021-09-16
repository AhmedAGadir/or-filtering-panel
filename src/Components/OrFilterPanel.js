import React, { useState, useEffect } from 'react';
import DataContext from '../DataContext.js';
import Select from 'react-select-me';
import makeVirtualized from 'react-select-me/lib/hoc/makeVirtualized';
import 'react-select-me/lib/ReactSelectMe.css';
import * as _ from '../_utils.js';

const VirtualizedSelect = makeVirtualized(Select);

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

    const searchChangeHandler = (searchStr, field) => {
        let searchResults = dataContext.rowData
            .filter(row => row[field] && row[field].toString().toLowerCase().indexOf(searchStr.toLowerCase()) > -1)
            .map(row => row[field])

        let updatedAvailableFilterOptions = { ...availableFilterOptions }
        updatedAvailableFilterOptions[field] = new Set(searchResults);

        setAvailableFilterOptions(updatedAvailableFilterOptions);
    }

    return (
        <form >
            <h2>Or-Filter Panel</h2>
            {props.columnDefs.map(({ field }) => availableFilterOptions[field] ? (
                <div key={field} className="my-form-control">
                    <label>{_.capatalise(field)}</label>
                    <VirtualizedSelect
                        multiple
                        virtualized
                        options={Array.from(availableFilterOptions[field]).map(value => ({ value, label: value }))}
                        value={selectedFilterOptions[field].map(value => ({ value, label: value }))}
                        onChange={(params) => selectChangeHandler(params, field)}
                        searchable
                        onSearch={params => searchChangeHandler(params, field)}
                    />
                </div>
            ) : null
            )}
        </form>
    )
}

export default OrFilterPanel;