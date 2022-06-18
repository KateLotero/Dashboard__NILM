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
import { HeatMapGrid } from 'react-grid-heatmap'

const API = process.env.REACT_APP_API //Call the environment var to connect with Flask
console.log(API) // print server address

const Months = () => {
  const [startDateBar, setstartDateBar] = useState(new Date(2022, 0, 1))
  const [endDateBar, setEndDateBar] = useState(new Date())
  const [infoBar, setInfoBar] = useState({})
  const [datePie, setDatePie] = useState(new Date())
  const [infoPie, setInfoPie] = useState({})
  const [startDateMap, setstartDateMap] = useState(new Date(2022, 0, 1))
  const [endDateMap, setendDateMap] = useState(new Date(2022, 0, 7))
  const [infoMap, setInfoMap] = useState([])
  const [xLabelsMap, setxLabelsMap] = useState([])
  const [yLabelsMap, setyLabelsMap] = useState([])
  const [deviceMap, setDeviceMap] = useState('Lavadora')

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

  // Request to the server and data process Barchart
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
    return chart
  }

  // onChange event barchart calendar
  const onChangeBar = async (dates) => {
    const [start, end] = dates
    setstartDateBar(start)
    setEndDateBar(end)
  }

  // set data Barchart
  useEffect(async () => {
    if (endDateBar != null) {
      let chart = await calcRange(startDateBar, endDateBar)
      setInfoBar(chart)
    }
  }, [endDateBar])

  // Request to the server Pie
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

    /* 
    
      ['#A3C9A8', '#84B59F', '#69A297', '#50808E']
      ['#1B263B', '#415A77', '#778DA9', '#E0E1DD']
      ['#ED6A5A', '#9BC1BC', '#5CA4A9', '#415A77']
      ['#619B8A', '#FCCA46', '#FE7F2D', '#1B263B']
    */

    let chart = {
      labels: devices,
      datasets: [
        {
          data: data,
          backgroundColor: ['#ED6A5A', '#9BC1BC', '#5CA4A9', '#415A77'],
          hoverBackgroundColor: ['#ED6A5A', '#9BC1BC', '#5CA4A9', '#415A77'],
          animation: false,
          radius: '85%',
        },
      ],
    }
    //console.log('devices', devices, 'data', data)
    setInfoPie(chart)
  }, [datePie])

  // Request to the server Map
  const onChangeMap = async (dates) => {
    const [start, end] = dates
    setstartDateMap(start)
    setendDateMap(end)
  }

  useEffect(async () => {
    if (endDateMap != null) {
      let start = startDateMap
      let end = endDateMap
      let month1 =
        (start.getMonth() + 1).toString().length == 2
          ? `${start.getMonth() + 1}`
          : `0${start.getMonth() + 1}`
      let day1 =
        start.getDate().toString().length == 2 ? `${start.getDate()}` : `0${start.getDate()}`
      let month2 =
        (end.getMonth() + 1).toString().length == 2
          ? `${end.getMonth() + 1}`
          : `0${end.getMonth() + 1}`
      let day2 = end.getDate().toString().length == 2 ? `${end.getDate()}` : `0${end.getDate()}`

      let date1 = `${start.getFullYear()}-${month1}-${day1}`
      let date2 = `${end.getFullYear()}-${month2}-${day2}`
      console.log('date1', date1, 'date2', date2)

      const dataHour = await getHour(date1, date2, deviceMap)
      console.log('respuestaaaaaaaaaaa', dataHour)

      let xLabels = []
      let yLabels = []
      let data = []
      const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }

      for (let i = 0; i < dataHour.length; i++) {
        yLabels[i] = new Date(dataHour[i].d).toLocaleDateString('es', options)
        data[i] = dataHour[i].avgHour
      }

      xLabels = new Array(24).fill(0).map((_, i) => `${i}`)
      console.log('datoss', data)

      setInfoMap(data)
      setyLabelsMap(yLabels)
      setxLabelsMap(xLabels)
    }
  }, [endDateMap, deviceMap])

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
                      { label: 'Lavadora', value: 'Lavadora' },
                      { label: 'Nevera', value: 'Nevera' },
                      { label: 'Microondas', value: 'Microondas' },
                      { label: 'Total', value: 'Total' },
                    ]}
                    onChange={(event) => {
                      setDeviceMap(event.target.value)
                      console.log(event.target.value)
                    }}
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
              <CRow className="card-body">
                <CCol>
                  <HeatMapGrid
                    className="card-body"
                    xLabels={xLabelsMap}
                    yLabels={yLabelsMap}
                    xLabelsLocation={'bottom'}
                    //xLabelsVisibility={xLabelsVisibility}
                    data={infoMap}
                    yLabelWidth={150}
                    //squares
                    xLabelsStyle={(index) => ({
                      color: index % 2 ? 'transparent' : '#777',
                      fontSize: '.90rem',
                    })}
                    yLabelsStyle={() => ({
                      fontSize: '.90rem',
                      //textTransform: 'uppercase',
                      //color: '#4f5d70',
                    })}
                    cellStyle={(_x, _y, ratio) => ({
                      background: `rgb(65, 90, 119, ${ratio})`,
                      fontSize: '.7rem',
                      color: `rgb(0, 0, 0, ${ratio / 2 + 0.4})`,
                    })}
                    cellHeight="1.5rem"
                    xLabelsPos="bottom"
                    onClick={(x, y) => alert(`Clicked ${x}, ${y}`)}
                    cellRender={(x, y, value) => (
                      <div title={`Pos(${x}, ${y}) = ${value}`}>{'.'}</div>
                    )}
                    //cellRender={(value) => value && <div>{value}</div>}
                    //title={(x, y, value) => `${value}`}
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
