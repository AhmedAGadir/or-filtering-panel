import { createContext } from "react";

const DataContext = createContext({
  rowData: [],
  filteredRowData: [],
  setFilteredRowData: () => { }
});

export default DataContext;