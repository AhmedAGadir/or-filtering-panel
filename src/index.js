import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import './styles.css'

import MyGrid from './Components/MyGrid';
import DataContext from './DataContext.js';

const App = () => {
  const [rowData, setRowData] = useState([]);
  const [filteredRowData, setFilteredRowData] = useState([]);

  useEffect(() => {
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .then((resp) => resp.json())
      .then((data) => {
        setRowData(data);
        let dataCopy = data.map(row => ({ ...row }));
        setFilteredRowData(dataCopy);
      });
  }, []);

  return (
    <DataContext.Provider value={{ rowData, filteredRowData, setFilteredRowData }}>
      <MyGrid />
    </DataContext.Provider>
  )
}

render(<App />, document.querySelector('#root'));
