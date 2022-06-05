import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { CChartBar, CChartPie } from '@coreui/react-chartjs'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import es from 'date-fns/locale/es'
registerLocale('es', es)

import TextField from '@mui/material/TextField'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { registerLocale } from 'react-datepicker'
//import { DatePicker } from '@mui/x-date-pickers/DatePicker'

const API = process.env.REACT_APP_API //Call the environment var to connect with Flask
console.log(API) // print server address

const Months = () => {
  const [dataPies1, setDataPies1] = useState([])
  const [dataPies2, setDataPies2] = useState([])
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(null)
  const onChange = (dates) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  const [value, setValue] = React.useState(null)

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

  const getAppliances = () =>
    fetch(`${API}/allData`) // GET is the default method
      .then((res) => res.json()) // res is an object, al convertirlo en json estoy haciendo otra promesa
  //.then(data=> setPowerAppliances(data))//por eso uso este otro then
  //console.log(`${API}/${appliance}`)

  useEffect(async () => {
    const fetchedAppliances = await getAppliances()
    const dataElects = calcPowerDay(fetchedAppliances)
    //console.log('Datos Electrodomésticos procesados', dataElects)
    const { appliancesMonth, powerMonth } = calcPowerMonth(dataElects)
    console.log('Potencia de los dispos por mes', appliancesMonth)
    //console.log({ fetchedAppliances, dataElects, devices })

    let month = ''
    let devices = []
    let data = []
    let datapie1 = []
    let datapie2 = []
    let chart = {}

    for (let i = 0; i < powerMonth.length; i++) {
      month = powerMonth[i].month
      devices = powerMonth[i].devices
      data = powerMonth[i].power

      chart = {
        labels: devices,
        datasets: [
          {
            data: data,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          },
        ],
      }
      i % 2 == 0
        ? datapie1.push({ month: month, chart: chart })
        : datapie2.push({ month: month, chart: chart })
    }

    setDataPies1(datapie1)
    setDataPies2(datapie2)
  }, [])

  //*************************************** Data process **************************************************

  // Calculate average power consumption each day
  function calcPowerDay(data) {
    //Receive the data extracted of the data base
    const dataDB = data
    //console.log('dataDB', dataDB)

    const dataElects = dataDB.map(function (x) {
      let newArray = {
        deviceId: x.deviceId,
        d: x.d,
        samples: x.samples,
      }
      return newArray
    })
    //console.log('deviceId, d, samples', dataElects)

    const samplesElect = dataElects.map((x) => [x.samples])
    for (let i = 0; i < samplesElect.length; i++) {
      let sample = samplesElect[i][0]
      //console.log('muestras', sample)

      let powerElect = sample.map((x) => x.power)
      //console.log('potencia', powerElect)

      let average = powerElect.reduce((total, value) => total + value) / 96 //Preguntar a Pablo si siempre serán 96
      //console.log(average)

      dataElects[i]['power'] = average
    }
    return dataElects
  }

  // Calculate average power consumption per month
  function calcPowerMonth(dataElects) {
    //capture the devices available
    let devices = dataElects.map((x) => x.deviceId)
    devices = [...new Set(devices)]
    //setDataDevices(devices)
    console.log('devices', devices)

    let appliancesMonth = []
    devices.map((appliance) => {
      //filter by appliance
      const dataDevice = dataElects.filter((x) => x.deviceId == appliance)
      //console.log(`datos ${appliance}`, dataDevice)

      //filter by month
      for (let k = 0; k < months.length; k++) {
        const filterMonth = dataDevice.filter((x) => x.d.includes(months[k]))
        //console.log('filtro por mes', filterMonth)

        let powerElect = filterMonth.map((x) => x.power)
        //console.log('potencia', powerElect)

        let average = powerElect.reduce((total, value) => total + value, 0) / filterMonth.length
        //console.log('pr', average)

        average
          ? appliancesMonth.push({ deviceId: appliance, month: months[k], power: average })
          : 0
        // if average is different to NaN ? haga esto : si no esto
      }
    })

    let month = appliancesMonth.map((x) => x.month)
    month = [...new Set(month)]
    //console.log('Meses', month)

    let powerMonth = []
    month.map((month) => {
      //filter by month
      const dataMonth = appliancesMonth.filter((x) => x.month == month)
      //console.log(`datos ${month}`, dataMonth)

      let appliances = dataMonth.map((x) => x.deviceId)
      let power = dataMonth.map((x) => x.power)
      //console.log('potencia', power)

      powerMonth.push({ month: month, devices: appliances, power: power })
    })

    return { appliancesMonth, powerMonth }
  }

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
                    onChange={onChange}
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="MM/yyyy"
                    locale="es"
                    showMonthYearPicker
                    selectsRange
                    inline
                  />
                </CCol>
                <CCol xs={12} sm={12} md={8}>
                  <CChartBar
                    data={{
                      clip: { left: 5, top: false, right: -2, bottom: 0 },
                      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
                      datasets: [
                        {
                          barPercentage: 0.8,
                          label: 'GitHub Commits',
                          backgroundColor: '#f87979',
                          data: [40, 20, 12, 39, 10, 40],
                        },
                      ],
                    }}
                  />
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
                  <CChartPie
                    data={{
                      labels: ['Nevera', 'Microondas', 'Lavadora', 'otros'],
                      datasets: [
                        {
                          barPercentage: 0.7,
                          backgroundColor: '#f87979',
                          data: [50, 15, 30, 5],
                          radius: '85%',
                        },
                      ],
                    }}
                  />
                </CCol>
                <CCol xs={12} sm={2} md={2}></CCol>

                <CCol xs={12} sm={4} md={4}>
                  <p className="">Selecciona un mes</p>

                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
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
