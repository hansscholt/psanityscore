import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable, } from 'material-react-table';

const Songs = () => {
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
        accessorKey: 'song_title',
        header: 'Title',
        muiFilterTextFieldProps: { placeholder: 'Title' },
      },
      {
        accessorKey: 'song_artist',
        header: 'Artist',
        muiFilterTextFieldProps: { placeholder: 'Artist' },
      },
      {
        accessorKey: 'song_type',
        header: 'Type',
        muiFilterTextFieldProps: { placeholder: 'Type' },
      },
      {
        accessorKey: 'song_category',
        header: 'Category',
        muiFilterTextFieldProps: { placeholder: 'Category' },
      },
      {
        accessorKey: 'song_sort',
        header: 'Folder',
        muiFilterTextFieldProps: { placeholder: 'Folder' },
      },
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

export default Songs;
