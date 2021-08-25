'use strict';

import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './styles.css'


// <div>
//   <label for="country">Country:</label>
//   <select id="country" name="country">
//     <option value="Afganistan">Afganistan</option>
//     <option value="Algeria">Algeria</option>
//     // ....
//   </select>
//   <div id="filtered-countries">
//     <div><span>Afganistan</span><span onclick="remove()">x</span></div>
//   </div>
// </div> 

const capatalise = str => str[0].toUpperCase() + str.slice(1);

const FilterPanel = props => {
  const [valuesMaps, setValueMaps] = useState(null);
  const [selectedValuesMap, setSelectedValuesMap] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (props.columnDefs && props.columnDefs.length > 0) {
      let selectedValuesMap = {};
      props.columnDefs.forEach(({ field }) => {
        selectedValuesMap[field] = [];
      });
      setSelectedValuesMap(selectedValuesMap);
    }
  }, [props.columnDefs]);

  useEffect(() => {
    if (props.rowData && props.rowData.length > 0) {
      let valuesMaps = {};
      props.columnDefs.forEach(({ field }) => valuesMaps[field] = new Set());
      props.rowData.forEach(row => {
        Object.keys(row).forEach(key => valuesMaps[key].add(row[key]))
      });
      setValueMaps(valuesMaps);
    }
  }, [props.rowData])

  const changeHandler = event => {
    let field = event.target.getAttribute('name');
    let value = event.target.value;

    let updatedSelectedValuesMap = { ...selectedValuesMap };
    if (updatedSelectedValuesMap[field].includes(value)) {
      alert(`"${value}" value is already included in the "${field}" filter`);
      return;
    }
    updatedSelectedValuesMap[field].push(value);
    setSelectedValuesMap(updatedSelectedValuesMap);

  }

  const clearSelectedValue = (field, value) => {
    let updatedSelectedValuesMap = { ...selectedValuesMap };
    let valueInd = updatedSelectedValuesMap[field].findIndex(item => item === value);
    updatedSelectedValuesMap[field].splice(valueInd, 1);
    setSelectedValuesMap(updatedSelectedValuesMap);
  }

  const formSubmitHandler = e => {
    e.preventDefault();
    console.log('applyingFilter...')
    props.applyFilter({
      selectedValuesMap,
      search
    });
    return false;
  }

  return (
    <form onSubmit={formSubmitHandler} >
      <h3>Or Filter Panel</h3>
      <div className="my-form-control">
        <label for='search'>Search</label>
        <input id="search" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <hr></hr>
      {props.columnDefs.map(({ field }) => (
        <div className="my-form-control">
          <label for={field}>{capatalise(field)}</label>
          <select id={field} name={field} onChange={changeHandler}>
            <option value="none" selected disabled hidden></option>
            {valuesMaps && Array.from(valuesMaps[field]).map(value => (
              <option value={value}>{value}</option>
            ))}
          </select>
          {
            selectedValuesMap && selectedValuesMap[field].map(value => (
              <span className="selected-value">
                {value}
                <span className="remove-value" onClick={() => clearSelectedValue(field, value)}>
                  x
                </span>
              </span>
            ))
          }
        </div>
      ))}
      <button type="submit">Apply Or Filter</button>
    </form>
  )
}



const GridExample = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [filteredRowData, setFilteredRowData] = useState(null);

  const [columnDefs, setColumnDefs] = useState([
    { field: 'athlete', minWidth: 150 },
    { field: 'age', maxWidth: 90 },
    { field: 'country', minWidth: 150 },
    { field: 'year', maxWidth: 90 },
    { field: 'date', minWidth: 150 },
    { field: 'sport', minWidth: 150 },
    { field: 'gold' },
    { field: 'silver' },
    { field: 'bronze' },
    { field: 'total' }
  ]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);


    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .then((resp) => resp.json())
      .then((data) => {
        setRowData(data);
        setFilteredRowData(data.map(row => ({ ...row })));
      });
  };

  const applyFilter = ({ selectedValuesMap, search }) => {
    console.log('fo', search, selectedValuesMap);

    let updatedFilteredRowData = rowData
      .map(row => ({ ...row }))
      .filter(row => {
        return Object.entries(row).some(([field, value]) => {
          return selectedValuesMap[field].some(selectedValue => selectedValue == value) || (value && value.toString().includes(search))
        });
      });
    console.log('newrow data for grid', updatedFilteredRowData);
    setFilteredRowData(updatedFilteredRowData);
  }

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <FilterPanel
        columnDefs={columnDefs}
        rowData={rowData}
        applyFilter={applyFilter} />
      <div
        id="myGrid"
        style={{
          height: '100%',
          width: '100%',
        }}
        className="ag-theme-alpine"
      >
        <AgGridReact
          defaultColDef={{
            flex: 1,
            minWidth: 100,
            filter: true
          }}
          columnDefs={columnDefs}
          enableRangeSelection={true}
          onGridReady={onGridReady}
          rowData={filteredRowData}
        />
      </div>
    </div>
  );
};

render(<GridExample></GridExample>, document.querySelector('#root'));
