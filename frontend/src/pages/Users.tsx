import React, { useEffect, useState } from 'react'
import { TestTable } from '../components/my_created/TestPage'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import '../index.css'
import {
  Column,
  ColumnDef,
  PaginationState,
  Table,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { UsersType } from '@/types';
import { Button } from '@/components/ui/button';
type Props = {}
function Users({ }: Props) {
  const queryClient = useQueryClient();
  const ac_token = localStorage.getItem('accessToken');
  const { data, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: () => {
      return axios.get(`/api/users/`, {
        headers: {
          token: ac_token
        }
      });
    },
  });
  //Okay have set all the data for the users _data here now can use tanstack Table
  const [users_data, setData] = useState([]);
  const rerender = React.useReducer(() => ({}), {})[1];
  const columns = React.useMemo<ColumnDef<UsersType>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: info => info.getValue(),
        footer: props => props.column.id,
      },
      {
        accessorKey: 'role',
        header: () => 'Role',
        footer: props => props.column.id,
      },
      {
        accessorKey: 'email',
        header: () => <span>Email</span>,
        footer: props => props.column.id,
      },
      {
        header: 'ACTIONS',
        cell: info =>
          <div className='flex justify-center gap-10' >
            <Button className='w-28'>Edit</Button>
            <Button className='w-28'>Delete</Button>
          </div>
      }
    ],
    []
  )
  useEffect(() => {
    if (data?.data) {
      setData(data.data.data);
    }
  }, [data]);
  if (isLoading) {
    return <div>Loading</div>
  };
  if (isError) {
    return <div>Error found</div >
  }
  return (
    <div className=' p-10'>


      <div className='px-4'>
        <Button>Create A new User</Button>
      </div>
      <div className='h-full flex flex-col justify-center items-center' >

        <MyTable
          {...{
            users_data,
            columns,
          }}
        />
      </div>

    </div>
  )
}
function MyTable({
  users_data,
  columns,
}: {
  users_data: UsersType[], columns: ColumnDef<UsersType>[]
}) {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const table = useReactTable({
    columns,
    data: users_data,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
    state: {
      pagination,
    },
    //AutoResetPageIndex: false, //Turn off page index reset when sorting or filtering
  })
  return <div className="p-2">
    <div className="h-2" />
    <table className="min-w-full table-auto border-spacing-2 border-separate   ">
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id} className="bg-primary text-secondary  rounded-lg">
            {headerGroup.headers.map(header => (
              <th key={header.id} colSpan={header.colSpan} className="px-4 py-2 text-left  font-semibold w-96  rounded-lg">
                <div
                  {...{
                    className: header.column.getCanSort()
                      ? 'cursor-pointer select-none hover:text-accent'
                      : 'text-muted',
                    onClick: header.column.getToggleSortingHandler(),
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{
                    asc: ' 🔼',
                    desc: ' 🔽',
                  }[header.column.getIsSorted() as string] ?? null}
                  {header.column.getCanFilter() ? (
                    <div className="mt-1">
                      <Filter column={header.column} table={table} />
                    </div>
                  ) : null}
                </div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id} className="border-t border-secondary hover:bg-secondary-light">
            {row.getVisibleCells().map(cell => (
              <td
                className="bg-secondary rounded-lg px-1 py-2 text-center  hover:bg-primary-foreground"
                key={cell.id}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>

    <div className="h-2" />
    <div className="flex items-center gap-2">
      <button
        className="border rounded p-1"
        onClick={() => table.firstPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {'<<'}
      </button>
      <button
        className="border rounded p-1"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {'<'}
      </button>
      <button
        className="border rounded p-1"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        {'>'}
      </button>
      <button
        className="border rounded p-1"
        onClick={() => table.lastPage()}
        disabled={!table.getCanNextPage()}
      >
        {'>>'}
      </button>
      <span className="flex items-center gap-1">
        <div>Page</div>
        <strong>
          {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount().toLocaleString()}
        </strong>
      </span>
      <span className="flex items-center gap-1">
        | Go to page:
        <input
          type="number"
          min="1"
          max={table.getPageCount()}
          defaultValue={table.getState().pagination.pageIndex + 1}
          onChange={e => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0
            table.setPageIndex(page)
          }}
          className="rounded-sm border-none p-2 w-16 text-primary bg-secondary"
        />
      </span>
      <select
        className="rounded-sm border-none p-2 text-primary bg-secondary"
        value={
          table.getState().pagination.pageSize}
        onChange={e => {
          table.setPageSize(Number(e.target.value))
        }}
      >
        {[10, 20, 30, 40, 50].map(pageSize => (
          <option key={pageSize} value={pageSize}
            className="rounded-sm border-none p-2  text-primary bg-secondary"
          >
            Show {pageSize}
          </option>
        ))}
      </select>
    </div>
    <div>
      Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
      {table.getRowCount().toLocaleString()} Rows
    </div>
  </div>
}
function Filter({
  column,
  table,
}: {
  column: Column<any, any>
  table: Table<any>
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  return typeof firstValue === 'number' ? (
    <div className="flex space-x-2" onClick={e => e.stopPropagation()}>
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ''}
        onChange={e =>
          column.setFilterValue((old: [number, number]) => [
            e.target.value,
            old?.[1],
          ])
        }
        placeholder={`Min`}
        className="w-full border shadow  rounded-sm border-none p-2 text-primary bg-secondary"
      />
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ''}
        onChange={e =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            e.target.value,
          ])
        }
        placeholder={`Max`}
        className="w-full border shadow  rounded-sm border-none p-2 text-primary bg-secondary"
      />
    </div>
  ) : (
    <input
      className="w-full border shadow  rounded-sm border-none p-2 text-primary bg-secondary"
      onChange={e => column.setFilterValue(e.target.value)}
      onClick={e => e.stopPropagation()}
      placeholder={`Search...`}
      type="text"
      value={(columnFilterValue ?? '') as string}
    />
  )
}
export default Users