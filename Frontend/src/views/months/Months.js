import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { CChartBar, CChartPie } from '@coreui/react-chartjs'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { addDays } from 'date-fns'
import es from 'date-fns/locale/es'
registerLocale('es', es)
import { registerLocale } from 'react-datepicker'

const API = process.env.REACT_APP_API //Call the environment var to connect with Flask
console.log(API) // print server address

const Months = () => {
  const [infoPie, setInfoPie] = useState({})
  const [infoBar, setInfoBar] = useState({})
  const [datePie, setDatePie] = useState(new Date())
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(null)

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
  const getPastMonth = (date1, date2) =>
    fetch(`${API}/dateRange/${date1}/${date2}`)
      .then((res) => res.json())
      .catch((error) => console.error('Error:', error))

  //*************************************** Data process **************************************************

  async function calcRange(start, end) {
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
    const fetchedAppliances = await getPastMonth(date1, date2)
    console.log('respuestaaaa', fetchedAppliances)

    let month = []
    let month_ = []
    let data = []

    for (let i = 0; i < fetchedAppliances.length; i++) {
      if (fetchedAppliances[i]._id.deviceId == 'Total') {
        month[i] = fetchedAppliances[i]._id.month
        data[i] = fetchedAppliances[i].average
      }
    }

    month = month.flat()
    data = data.flat()

    for (let i = 0; i < month.length; i++) {
      month_[i] = months[month[i] - 1]
    }

    let chart = {
      labels: month_,
      datasets: [
        {
          barPercentage: 0.8,
          label: 'Potencia consumida por mes (kW/m??? imprimí directo)',
          backgroundColor: '#f87979',
          data: data,
          animation: false,
        },
      ],
    }

    console.log('chartt', chart)

    return chart
  }

  useEffect(async () => {
    let start = new Date()
    let end = new Date()
    let chart = await calcRange(start, end)
    setInfoBar(chart)
  }, [])

  const onChangeBar = async (dates) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)

    if (end) {
      let chart = await calcRange(start, end)
      setInfoBar(chart)
    }
  }

  useEffect(async () => {
    let month1 =
      (datePie.getMonth() + 1).toString().length == 2
        ? `${datePie.getMonth() + 1}`
        : `0${datePie.getMonth() + 1}`

    let month2 =
      (datePie.getMonth() + 2).toString().length == 2
        ? `${datePie.getMonth() + 2}`
        : `0${datePie.getMonth() + 2}`
    month2 = month2 == '13' ? '01' : month2 //verificar el año

    console.log('mes1', month1, 'finalmes', month2)

    let date1 = `${datePie.getFullYear()}-${month1}-01`
    let date2 = `${datePie.getFullYear()}-${month2}-01`
    const fetchedAppliances = await getPastMonth(date1, date2)
    console.log('respuestaaaa', fetchedAppliances)

    let devices = []
    let data = []

    for (let i = 0; i < fetchedAppliances.length; i++) {
      devices[i] = fetchedAppliances[i]._id.deviceId
      data[i] = fetchedAppliances[i].average
    }

    let chart = {
      labels: devices,
      datasets: [
        {
          data: data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          animation: false,
          radius: '85%',
        },
      ],
    }
    console.log('devices', devices, 'data', data)
    setInfoPie(chart)
  }, [datePie])

  //**************************************** page ****************************************/
  return (
    <>
      <CRow>
        <CCol>
          <CCard className="mb-4">
            <CCardHeader>Histórico de datos</CCardHeader>

            <CCardBody>
              <CRow>
                <CCol xs={12} sm={12} md={4}>
                  <p>Selecciona un rango de fechas</p>
                  <DatePicker
                    selected={startDate}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={onChangeBar}
                    maxDate={addDays(new Date(), -1)}
                    dateFormat="MM/yyyy"
                    locale="es"
                    showMonthYearPicker
                    selectsRange
                    inline
                  />
                </CCol>
                <CCol xs={12} sm={12} md={8}>
                  <CChartBar data={infoBar} />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol>
          <CCard className="mb-4">
            <CCardHeader>Consumo por mes</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs={12} sm={6} md={6}>
                  <CChartPie data={infoPie} />
                </CCol>
                <CCol xs={12} sm={2} md={2}></CCol>

                <CCol xs={12} sm={4} md={4}>
                  <p className="">Selecciona un mes</p>

                  <DatePicker
                    selected={datePie}
                    onChange={(datePie) => setDatePie(datePie)}
                    maxDate={addDays(new Date(), -1)}
                    dateFormat="MM/yyyy"
                    locale="es"
                    showMonthYearPicker
                    inline
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Months
