import React, { useEffect, useState } from 'react'
import { Document, Page, View, Text, Image } from '@react-pdf/renderer'
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
  CButton,
} from '@coreui/react'

const API = process.env.REACT_APP_API //Call the environment var to connect with Flask
console.log(API) // print server address

const Reports = () => {
  const [viewPDF, setviewPDF] = useState(false)

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
      <h1>Reportes</h1>
      <CButton
        color="secondary"
        size="lg"
        onClick={() => {
          setviewPDF(true)
        }}
      >
        Descargar
      </CButton>
      <CCard>
        <CCardBody>
          {viewPDF == true ? (
            <Document>
              <Page size="A4">
                <Text>
                  fhdsjfjksadfha jkljahdfkjahdsfjka hajksdhfkjadshfjka jahsdfjkashdfk aahjsdkfha
                  jkdshfjk ajhdfskjhadsjfa ajdshfajk fdjj
                </Text>
              </Page>
            </Document>
          ) : null}
        </CCardBody>
      </CCard>
    </>
  )
}

export default Reports
