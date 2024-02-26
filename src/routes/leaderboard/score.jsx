import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable, } from 'material-react-table';

import {ZoomOutMap as IconZoomOutMap} from '@mui/icons-material';
import {Keyboard as IconKeyboard} from '@mui/icons-material';
import { ListItemIcon } from '@mui/material';

const LeaderboardScore = () => {
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
        accessorKey: 'player_nick',
        header: 'Discord Nick',
        enableColumnFilter: false,
      },      
      {
        accessorKey: 'player_keyboard',
        header: 'Style',
        muiFilterTextFieldProps: { placeholder: 'Title' },
        enableColumnFilter: false,
        Cell: ({ cell }) => {
          let myIcon = <IconZoomOutMap fontSize="large"/>;
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
      },
      {
        accessorKey: '_countsingle',
        header: 'Single Plays',
        enableColumnFilter: false,
      },
      {
        accessorKey: '_countdouble',
        header: 'Double Plays',
        enableColumnFilter: false,
      },
      {
        accessorKey: '_countscore',
        header: 'Total Plays',
        enableColumnFilter: false,
      },
      {
        accessorKey: '_sumscore',
        header: 'Total Score',
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

export default LeaderboardScore;
