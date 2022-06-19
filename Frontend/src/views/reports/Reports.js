import React, { useEffect, useState } from 'react'
import { Document, Page, View, Text, Image, PDFViewer } from '@react-pdf/renderer'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import es from 'date-fns/locale/es'
registerLocale('es', es)
import { registerLocale } from 'react-datepicker'
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
  const [fetchData, setFetchData] = useState(false)
  const [startDate, setstartDate] = useState(new Date(2022, 0, 1))
  const [endDate, setendDate] = useState(new Date(2022, 5, 1))
  const [infoTable, setInfoTable] = useState([])
  const [infoBar, setInfoBar] = useState({})
  const [infoPie, setInfoPie] = useState({})

  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ]

  //*************************************** requests to the server *************************************/

  const getData = (date1, date2) =>
    fetch(`${API}/dateReport/${date1}/${date2}`)
      .then((res) => res.json())
      .catch((error) => console.error('Error:', error))

  //*************************************** Data process **************************************************

  const onChangeDate = async (dates) => {
    const [start, end] = dates
    setstartDate(start)
    setendDate(end)
  }

  useEffect(async () => {
    if (endDate != null) {
      let start = startDate
      let end = endDate
      let month1 =
        (start.getMonth() + 1).toString().length == 2
          ? `${start.getMonth() + 1}`
          : `0${start.getMonth() + 1}`

      let month2 =
        (end.getMonth() + 2).toString().length == 2
          ? `${end.getMonth() + 2}`
          : `0${end.getMonth() + 2}`
      month2 = month2 == '13' ? '01' : month2

      let date1 = `${start.getFullYear()}-${month1}-01`
      let date2 = `${end.getFullYear()}-${month2}-01`
      const res = await getData(date1, date2)
      console.log('fecha1', date1, 'fecha2', date2)
      console.log('respuestaaaa', res)

      let data = []
      let infoMonth = {}
      let labels = []

      //Data process barchart
      for (let i = 0; i < res.length; i++) {
        infoMonth = {
          x: `${months[res[i]._id.month - 1]} ${res[i]._id.year}`,
          [res[i].datos[0].deviceId]: (
            (res[i].datos[0].average * 24 * (res[i].datos[0].count / 96)) /
            1000
          ).toFixed(1), // (power)*24*(days) kWh
          [res[i].datos[1].deviceId]: (
            (res[i].datos[1].average * 24 * (res[i].datos[1].count / 96)) /
            1000
          ).toFixed(1),
          [res[i].datos[2].deviceId]: (
            (res[i].datos[2].average * 24 * (res[i].datos[2].count / 96)) /
            1000
          ).toFixed(1),
          [res[i].datos[3].deviceId]: (
            (res[i].datos[3].average * 24 * (res[i].datos[3].count / 96)) /
            1000
          ).toFixed(1),
          [res[i].datos[4].deviceId]: (
            (res[i].datos[4].average * 24 * (res[i].datos[4].count / 96)) /
            1000
          ).toFixed(1),
        }

        labels.push(infoMonth.x)
        data.push(infoMonth)
      }

      let barChart = {
        labels: labels,
        datasets: [
          {
            label: 'Lavadora',
            backgroundColor: '#ED6A5A',
            data: data,
            parsing: {
              yAxisKey: 'Lavadora',
            },
          },
          {
            label: 'Microondas',
            backgroundColor: '#9BC1BC',
            data: data,
            parsing: {
              yAxisKey: 'Microondas',
            },
          },
          {
            label: 'Nevera',
            backgroundColor: '#5CA4A9',
            data: data,
            parsing: {
              yAxisKey: 'Nevera',
            },
          },
          {
            label: 'Otros',
            backgroundColor: '#415A77',
            data: data,
            parsing: {
              yAxisKey: 'Otros',
            },
          },
        ],
      }

      let pie = []
      const devices = ['Lavadora', 'Microondas', 'Nevera', 'Otros']

      //Data process piechart
      for (let k = 0; k < devices.length; k++) {
        let sum = 0
        for (let i = 0; i < data.length; i++) {
          sum += parseFloat(data[i][devices[k]])
        }
        let avg = sum / data.length
        pie.push(avg)
      }

      let pieChart = {
        labels: devices,
        datasets: [
          {
            data: pie,
            backgroundColor: ['#ED6A5A', '#9BC1BC', '#5CA4A9', '#415A77'],
            hoverBackgroundColor: ['#ED6A5A', '#9BC1BC', '#5CA4A9', '#415A77'],
            animation: true,
            radius: '85%',
          },
        ],
      }

      setInfoPie(pieChart)
      setInfoBar(barChart)
      setInfoTable(data)
    }
  }, [fetchData])
  //**************************************** page ****************************************/
  return (
    <>
      <CCard>
        <CCardHeader>Periodo del reporte</CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md={10} sm={6} xs={6}>
              <DatePicker
                className="form-select"
                selected={startDate}
                startDate={startDate}
                endDate={endDate}
                onChange={onChangeDate}
                dateFormat="MMMM yyyy"
                //maxDate={[addDays(new Date(), -1), addDays(startDate, 7)]}
                //excludeDates={[addDays(startDate, 7)]}
                placeholderText="Selecciona un rango"
                //dateFormat="Pp"
                locale="es"
                showMonthYearPicker
                selectsRange
                //shouldCloseOnSelect={false}
              />
            </CCol>
            <CCol md={2} sm={6} xs={6}>
              <CButton
                color="secondary"
                onClick={() => {
                  setFetchData(!fetchData)
                }}
              >
                Generar reporte
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <CCard>
        <CCardHeader>
          <CRow>
            <CCol md={10} sm={10} xs={10}>
              Reporte
            </CCol>
            <CCol md={2} sm={2} xs={2} className="text-end">
              <CButton
                color="secondary"
                size="sm"
                onClick={() => {
                  window.print()
                }}
              >
                Imprimir
              </CButton>
            </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md={8} sm={8} xs={12}>
              <CChartBar data={infoBar} />
            </CCol>

            <CCol md={4} sm={4} xs={12}>
              <CChartDoughnut data={infoPie} />
            </CCol>
          </CRow>
          <CRow>
            <CCol className="mt-4">
              <CCard>
                <CCardBody>
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <CTableHeaderCell scope="col">Mes</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Lavadora (kWh)</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Microondas (kWh)</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Nevera (kWh)</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Otros (kWh)</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Total (kWh)</CTableHeaderCell>
                      </tr>
                    </thead>
                    <tbody>
                      {infoTable.map((row) => (
                        <tr key={row.x}>
                          <td>{row.x}</td>
                          <td>{row.Lavadora}</td>
                          <td>{row.Microondas}</td>
                          <td>{row.Nevera}</td>
                          <td>{row.Otros}</td>
                          <td>{row.Total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Reports
