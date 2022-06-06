import React, { useEffect, useState } from 'react'
import { CChartBar, CChartDoughnut, CChartLine, CChartPie } from '@coreui/react-chartjs'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

const API = process.env.REACT_APP_API //Call the environment var to connect with Flask
console.log(API) // print server address

const Statis = () => {
  const [dataPies1, setDataPies1] = useState([])
  const [dataPies2, setDataPies2] = useState([])

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  //*************************************** requests to the server *************************************/

  //*************************************** Data process **************************************************

  //**************************************** page ****************************************/
  return (
    <>
      <h1>Sobre nosotros</h1>
      <CRow></CRow>
    </>
  )
}

export default Statis
