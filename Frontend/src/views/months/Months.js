import { CCard, CCardBody, CCardHeader, CCol, CRow, CFormSelect } from '@coreui/react'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { CChartBar, CChartPie } from '@coreui/react-chartjs'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { addDays } from 'date-fns'
import es from 'date-fns/locale/es'
registerLocale('es', es)
import { registerLocale } from 'react-datepicker'
import HeatMap from 'react-heatmap-grid'
import { padding } from '@mui/system'

const API = process.env.REACT_APP_API //Call the environment var to connect with Flask
console.log(API) // print server address

const Months = () => {
  const [startDateBar, setstartDateBar] = useState(new Date(2022, 0, 1))
  const [endDateBar, setEndDateBar] = useState(new Date())
  const [infoBar, setInfoBar] = useState({})
  const [datePie, setDatePie] = useState(new Date())
  const [infoPie, setInfoPie] = useState({})
  const [startDateMap, setstartDateMap] = useState(new Date(2022, 0, 1))
  const [endDateMap, setendDateMap] = useState(new Date(2022, 0, 2))
  const [infoMap, setInfoMap] = useState({})

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

  const getHour = (date1, date2, device) =>
    fetch(`${API}/weekRange/${date1}/${date2}/${device}`)
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
    console.log('fecha1', date1, 'fecha2', date2)
    //console.log('respuestaaaa', fetchedAppliances)

    let month = []
    let month_ = []
    let data = []
    let power = 0
    let days = 0

    for (let i = 0; i < fetchedAppliances.length; i++) {
      if (fetchedAppliances[i]._id.deviceId == 'Total') {
        month[i] = fetchedAppliances[i]._id.month
        power = fetchedAppliances[i].average // Potencia (W)
        days = fetchedAppliances[i].countSamples / 96
        data[i] = ((power * 24 * days) / 1000).toFixed(1) //Energía (kWh)
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
          label: 'Energía consumida por mes (kWh)',
          backgroundColor: '#f87979',
          data: data,
          animation: false,
        },
      ],
    }

    //console.log('chartt', chart)

    return chart
  }

  useEffect(async () => {
    let start = new Date(2022, 0, 1)
    let end = new Date()
    let chart = await calcRange(start, end)
    setInfoBar(chart)
  }, [])

  const onChangeBar = async (dates) => {
    const [start, end] = dates
    setstartDateBar(start)
    setEndDateBar(end)

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

    //console.log('mes1', month1, 'finalmes', month2)

    let date1 = `${datePie.getFullYear()}-${month1}-01`
    let date2 = `${datePie.getFullYear()}-${month2}-01`
    const fetchedAppliances = await getPastMonth(date1, date2)
    //console.log('respuestaaaa', fetchedAppliances)

    let devices = []
    let data = []
    let power = 0
    let days = 0

    for (let i = 0; i < fetchedAppliances.length; i++) {
      if (fetchedAppliances[i]._id.deviceId != 'Total') {
        devices[i] = fetchedAppliances[i]._id.deviceId
        power = fetchedAppliances[i].average // Potencia (W)
        days = fetchedAppliances[i].countSamples / 96
        data[i] = ((power * 24 * days) / 1000).toFixed(1) //Energía (kWh)
      }
    }

    devices = devices.flat()
    data = data.flat()

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
    //console.log('devices', devices, 'data', data)
    setInfoPie(chart)
  }, [datePie])

  const onChangeMap = async (dates) => {
    const [start, end] = dates
    setstartDateMap(start)
    setendDateMap(end)
  }
  const fechas = []
  for (let i = 0; i < fechas.length; i++) {
    const element = fechas[i]
  }

  const xLabels = new Array(24).fill(0).map((_, i) => `${i}`)
  //console.log(xLabels)
  const xLabelsVisibility = new Array(24).fill(0).map((_, i) => true)
  const yLabels = ['Ene 1', 'Mon', 'Tue', 'Wede', 'Thu', 'Fri', 'Sat', 'och', 'nue', 'diez']
  const data = new Array(yLabels.length)
    .fill(0)
    .map(() => new Array(xLabels.length).fill(0).map(() => Math.floor(Math.random() * 100)))
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
                    selected={startDateBar}
                    startDate={startDateBar}
                    endDate={endDateBar}
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

      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Consumo por hora</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol>
                  <CFormSelect
                    aria-label="Default select example"
                    options={[
                      { label: 'Lavadora', value: '3' },
                      { label: 'Nevera', value: '1' },
                      { label: 'Microondas', value: '2' },
                      { label: 'Total', value: '4' },
                    ]}
                  />
                </CCol>
                <CCol>
                  <DatePicker
                    className="form-select"
                    selected={startDateMap}
                    startDate={startDateMap}
                    endDate={endDateMap}
                    onChange={onChangeMap}
                    dateFormat="MMMM d, yyyy"
                    //maxDate={[addDays(new Date(), -1), addDays(startDate, 7)]}
                    //excludeDates={[addDays(startDate, 7)]}
                    placeholderText="Selecciona un rango"
                    //dateFormat="Pp"
                    locale="es"
                    selectsRange
                    //shouldCloseOnSelect={false}
                  />
                </CCol>
              </CRow>
              <CRow className="card-body" style={{ fontSize: '8px' }}>
                <CCol>
                  <HeatMap
                    xLabels={xLabels}
                    yLabels={yLabels}
                    xLabelsLocation={'bottom'}
                    xLabelsVisibility={xLabelsVisibility}
                    xLabelWidth={60}
                    yLabelWidth={90}
                    data={data}
                    squares
                    height={20}
                    onClick={(x, y) => alert(`Clicked ${x}, ${y}`)}
                    cellStyle={(background, value, min, max, data, x, y) => ({
                      background: `rgb(0, 151, 230, ${1 - (max - value) / (max - min)})`,
                      fontSize: '11.5px',
                      color: '#444',
                    })}
                    //cellRender={(value) => value && <div>{value}</div>}
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
