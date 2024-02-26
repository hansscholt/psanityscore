import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable, } from 'material-react-table';

import {ZoomOutMap as IconZoomOutMap} from '@mui/icons-material';
import {Keyboard as IconKeyboard} from '@mui/icons-material';
import { ListItemIcon } from '@mui/material';

const Latest = () => {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!data.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }
     const url = new URL(
        'api/yourapiurl',
        process.env.NODE_ENV === 'production'
          ? 'produrl'
          : 'localurl',
      );
      url.searchParams.set(
        'start',
        `${pagination.pageIndex * pagination.pageSize}`,
      );
      url.searchParams.set('size', `${pagination.pageSize}`);
      url.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
      url.searchParams.set('globalFilter', globalFilter ?? '');
      url.searchParams.set('sorting', JSON.stringify(sorting ?? []));

      try {
        const response = await fetch(url.href);
        //console.log(response);
        const json = await response.json();
        
        setData(json.data);
        json.data.forEach(element => {
          element.score_ID =
          element.score_ID + '|~|' +
          element.song_pump_id;

          if(element.step_meter === 99)
            element.step_meter = '??';
          element.song_title = 
          element.song_title + '|~|' +
          element.song_artist + '|~|' +
          element.style_name + '|~|' +
          element.step_meter;
          
          element.score_score =
          element.score_score + '|~|' +
          element.score_perfect + '|~|' +
          element.score_great + '|~|' +
          element.score_good + '|~|' +
          element.score_bad + '|~|' +
          element.score_miss + '|~|' +
          element.score_combo;

          if (element.grade_ID > 8)
            element.grade_ID = 'grade_1' + (element.grade_ID - 8);
          else
            element.grade_ID = 'grade_0' + element.grade_ID;
          // element.grade_ID = 1;
        });
        setRowCount(json.length);
      } catch (error) {
        setIsError(true);
        console.error(error);
        return;
      }
      setIsError(false);
      setIsLoading(false);
      setIsRefetching(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    columnFilters,
    globalFilter,
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
  ]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'score_ID',
        header: 'ID',
        enableColumnFilter: false,
        size: 50,
        grow: false,
        enableSorting: false,
        Cell: ({ cell }) => {
          let value = cell.getValue().split("|~|");          
          var icon;
          try{
            icon = require('../img/banner/' + value[1] + '.jpg');
          }
          catch{
            icon = require('../img/banner/NOBANNER.jpg');
          }
          return (
          <div>
            {<img src={icon} alt={value} style={{width: '80px'}}/>}
          </div>
          );
        },
      },
      
      {
        accessorKey: 'player_nick',
        header: 'Discord Nick',
        muiFilterTextFieldProps: { placeholder: 'Discord Nick' },
      },
      {
        accessorKey: 'song_title',
        header: 'Song',
        muiFilterTextFieldProps: { placeholder: 'Song' },
        Cell: ({ cell }) => {
          let value = cell.getValue().split("|~|");
          if(!value[0] || value[0] === null || value[0] === 'null')
            value[0] = '~'
          if(!value[1] || value[1] === null || value[1] === 'null')
            value[1] = '~'
          return (
          <div>
            {value[0]}
            <br></br>
            {value[1]}
            <br></br>
            <b>{value[2]} - {value[3]}</b>
          </div>
          );
        },
      },
      {
        accessorKey: 'score_score',
        header: 'Result',
        enableColumnFilter: false,
        size: 100,
        Cell: ({ cell }) => {
          let value =  cell.getValue().split("|~|");
          return (
          <div>
            {value[0]}  {/*score*/}
            <br></br>
            <b><span className='colorPerfect'>{value[1]}</span>  {/*perfect*/}
            &nbsp;
            <span className='colorGreat'>{value[2]}</span>  {/*great*/}
            &nbsp;
            <span className='colorGood'>{value[3]}</span>  {/*good*/}
            &nbsp;
            <span className='colorBad'>{value[4]}</span>  {/*bad*/}
            &nbsp;
            <span className='colorMiss'>{value[5]}</span>  {/*miss*/}            
            <br></br>
            {value[6]}  {/*combo*/}
            </b>
          </div>
          );
        },
        muiFilterTextFieldProps: { placeholder: 'Result' },
      },
      {
        accessorKey: 'grade_ID',
        header: 'Grade',
        size: 100,
        muiFilterTextFieldProps: { placeholder: 'Grade' },
        filterVariant: 'multi-select',
        filterSelectOptions: [
          { label: 'SSS', value: 1 },
          { label: 'SS', value: 2 },
          { label: 'S', value: 3 },
          { label: 'A', value: 4 },
          { label: 'B', value: 5 },
          { label: 'C', value: 6 },
          { label: 'D', value: 7 },
          { label: 'F', value: 8 },
          { label: 'SSS Broken', value: 9 },
          { label: 'SS Broken', value: 10 },
          { label: 'S Broken', value: 11 },
          { label: 'A Broken', value: 12 },
          { label: 'B Broken', value: 13 },
          { label: 'C Broken', value: 14 },
          { label: 'D Broken', value: 15 },
          { label: 'F Broken', value: 16 }          
        ],
        Cell: ({ cell }) => {
          let value =  cell.getValue();
          return (
          <div>
            <img src={require('../img/grade/' + value + '.png')} alt={value} />
          </div>
          );
        },
      },
      {
        accessorKey: 'score_date',
        header: 'Date',
        size: 100,
        filterVariant: 'date',
        muiFilterTextFieldProps: { placeholder: 'Date' },
        Cell: ({ cell }) => cell.getValue().toLocaleString('en-US'),
      },
      {
        accessorKey: 'player_keyboard',
        header: 'Style',
        enableColumnFilter: false,
        muiFilterTextFieldProps: { placeholder: 'Style' },
        Cell: ({ cell }) => {
          let myIcon = <IconZoomOutMap fontSize="large"/>;
          // console.log(cell.getValue());
          if(Number(cell.getValue()) ===  1)
            myIcon = <IconKeyboard fontSize="large"/>;
          return (
          <div>
            <ListItemIcon>
              {myIcon}
            </ListItemIcon>
          </div>
          );
        },
      }
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: false,
    initialState: { showColumnFilters: true, density: 'compact' },
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableGlobalFilter: false,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    enableMultiSort: false,
    muiToolbarAlertBannerProps: isError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
  });

  return <MaterialReactTable table={table} />;
};

export default Latest;
