import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import OrFilterPanel from './OrFilterPanel';
import DataContext from '../DataContext.js';

const MyGrid = () => {
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
                        filter: true,
                        filterParams: {
                            newRowsAction: 'keep'
                        },
                        menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab']
                    }}
                    columnDefs={columnDefs}
                    onGridReady={onGridReady}
                    rowData={dataContext.orFilteredRowData}
                    sideBar={{
                        toolPanels: [
                            {
                                id: 'or-filtering',
                                labelDefault: 'OR-filtering',
                                labelKey: 'or-filtering',
                                iconKey: 'filter',
                                toolPanel: 'orFilterPanel',
                                toolPanelParams: {
                                    columnDefs: columnDefs,
                                }
                            },
                            {
                                id: 'and-filtering',
                                labelDefault: 'AND-filtering',
                                labelKey: 'and-filtering',
                                iconKey: 'filter',
                                toolPanel: 'agFiltersToolPanel',
                            },

                        ],
                        defaultToolPanel: 'or-filtering',
                    }}
                    frameworkComponents={{ orFilterPanel: OrFilterPanel }}
                />
            </div>
        </div>
    );
};

export default MyGrid;