import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './styles.css'

import OrFilterPanel from './OrFilterPanel';
import DataContext from './DataContext.js';

const GridExample = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const dataContext = React.useContext(DataContext);

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
  };

  return (
    <div style={{ width: '100%', height: '100vh' }}>
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
          onGridReady={onGridReady}
          rowData={dataContext.filteredRowData}
          sideBar={{
            toolPanels: [
              {
                id: 'or-filters',
                labelDefault: 'OR-filters',
                labelKey: 'or-filters',
                iconKey: 'filter',
                toolPanel: 'orFilterPanel',
                toolPanelParams: {
                  columnDefs: columnDefs,
                }
              },
              {
                id: 'and-filters',
                labelDefault: 'AND-filters',
                labelKey: 'and-filters',
                iconKey: 'filter',
                toolPanel: 'agFiltersToolPanel',
              },

            ],
            defaultToolPanel: 'or-filters',
          }}
          frameworkComponents={{ orFilterPanel: OrFilterPanel }}
        />
      </div>
    </div>
  );
};

const App = () => {
  const [rowData, setRowData] = useState([]);
  const [filteredRowData, setFilteredRowData] = useState([]);

  useEffect(() => {
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .then((resp) => resp.json())
      .then((data) => {
        data = data.slice(0, 1000);
        let dataCopy = data.map(row => ({ ...row }));
        setRowData(data);
        setFilteredRowData(dataCopy);
      });
  }, []);

  return (
    <DataContext.Provider value={{ rowData, filteredRowData, setFilteredRowData }}>
      <GridExample />
    </DataContext.Provider>
  )
}

render(<App />, document.querySelector('#root'));
