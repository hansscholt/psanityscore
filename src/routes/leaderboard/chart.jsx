import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable, } from 'material-react-table';


const LeaderboardChart = () => {
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
          element.song_ID =
          element.song_ID + '|~|' +
          element.song_pump_id;

          if(element.step_meter === 99)
            element.step_meter = '??';
            element.song_title = 
            element.song_title + '|~|' +
            element.song_artist + '|~|' +
            element.style_name + '|~|' +
            element.step_meter;
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
        accessorKey: 'song_ID',
        header: 'ID',
        enableColumnFilter: false,
        size: 50,
        grow: false,
        enableSorting: false,
        Cell: ({ cell }) => {
          let value = cell.getValue().split("|~|");          
          var icon;
          try{
            icon = require('../../img/banner/' + value[1] + '.jpg');
          }
          catch{
            icon = require('../../img/banner/NOBANNER.jpg');
          }
          return (
          <div>
            {<img src={icon} alt={value} style={{width: '80px'}}/>}
          </div>
          );
        },
      },      
      {
        accessorKey: 'song_title',
        header: 'Song',
        muiFilterTextFieldProps: { placeholder: 'Title' },
        enableColumnFilter: false,
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
        accessorKey: 'song_sort',
        header: 'Folder',
        enableColumnFilter: false,
      },
      {
        accessorKey: 'song_category',
        header: 'Category',
        enableColumnFilter: false,
      },
      {
        accessorKey: '_count',
        header: 'Play Count',
        enableColumnFilter: false,
      }     
      
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: false,
    initialState: { 
      showColumnFilters: false, 
      density: 'compact', 
      sorting: [
        {
          id: '_count', 
          desc: true,
        },
      ],
    },
    enableSorting: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableGlobalFilter: false,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    enableMultiSort: false,
    enableFilters: false,
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

export default LeaderboardChart;
