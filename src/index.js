import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import './styles.css'

import MyGrid from './Components/MyGrid';
import DataContext from './DataContext.js';

const App = () => {
  const [rowData, setRowData] = useState([]);
  const [orFilteredRowData, setOrFilteredRowData] = useState([]);

  useEffect(() => {
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .then((res) => res.json())
      .then((data) => {
        data.forEach((row, ind) => row.id = ind);
        setRowData(data);
        let dataCopy = data.map(row => ({ ...row }));
        setOrFilteredRowData(dataCopy);
      })
      .catch(err => console.log(err));

  }, []);

  return (
    <DataContext.Provider value={{ rowData, orFilteredRowData, setOrFilteredRowData }}>
      <MyGrid />
    </DataContext.Provider>
  )
}

render(<App />, document.querySelector('#root'));
