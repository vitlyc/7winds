import React, { useState } from 'react'
import './Table.scss'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import TableRow from '../TableRow/TableRow'
import { useGetRowsQuery, updateQueryData } from '../../services/api'
import { Row } from '../../types'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../app/store'

export default function Table() {
  const dispatch = useDispatch<AppDispatch>()
  const { data: rows = [], isLoading, isError } = useGetRowsQuery()
  const [isRowCreated, setIsRowCreated] = useState(false)

  const handleAddRootRow = () => {
    if (isRowCreated) return

    const newRootRow: Row = {
      id: 112233,
      parentId: null, // Верхний уровень
      rowName: 'Новая строка',
      salary: 0,
      equipmentCosts: 0,
      overheads: 0,
      estimatedProfit: 0,
      materials: 0,
      mimExploitation: 0,
      supportCosts: 0,
      mainCosts: 0,
      machineOperatorSalary: 0,
      child: [],
    }

    dispatch(
      updateQueryData('getRows', undefined, (draft) => {
        draft.push(newRootRow)
      })
    )

    setIsRowCreated(true)
  }

  const renderRows = (rows: Row[], nested: number = 1) => {
    return rows.map((row) => (
      <React.Fragment key={row.id}>
        <TableRow
          key={row.id}
          row={row}
          nested={nested}
          isRowCreated={isRowCreated}
          setIsRowCreated={setIsRowCreated}
        />
        {row.child.length > 0 && renderRows(row.child, nested + 1)}
      </React.Fragment>
    ))
  }

  return (
    <div className="table no-select">
      <div className="title">
        <h4>Строительно-монтажные работы</h4>
        <AddCircleOutlineIcon
          onClick={handleAddRootRow}
          className="add-btn"
          viewBox="0 0 24 24"
        >
          Добавить работы
        </AddCircleOutlineIcon>
      </div>
      <div className="table-section">
        <table>
          <thead>
            <tr>
              <th>Уровень</th>
              <th>Наименование работ</th>
              <th>Основная з/п</th>
              <th>Оборудование</th>
              <th>Накладные расходы</th>
              <th>Сметная прибыль</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6}>Loading...</td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={6}>Error loading data</td>
              </tr>
            )}
            {renderRows(rows)}
          </tbody>
        </table>
      </div>
    </div>
  )
}
