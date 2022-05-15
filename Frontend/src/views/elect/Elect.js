import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { CChartBar, CChartDoughnut, CChartLine, CChartPie } from '@coreui/react-chartjs'

const API = process.env.REACT_APP_API //Call the environment var to connect with Flask
console.log(API) // print server address

const Elect = () => {
  const [dataPies, setDataPies] = useState([])
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
    let datapie = []
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

      datapie.push({ month: month, chart: chart })
    }
    console.log('datapie', datapie)

    setDataPies(datapie)
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
      <h1>Comparación del consumo en los últimos meses</h1>
      <CRow>
        <CCol xs={6}>
          {dataPies.map((pie) => (
            <CCard className="mb-4" key={pie.month}>
              <CCardHeader>{pie.month}</CCardHeader>
              <CCardBody>
                <CChartPie data={pie.chart} />
              </CCardBody>
            </CCard>
          ))}
          <CCol xs={6}>
            <CCard></CCard>
          </CCol>
        </CCol>
      </CRow>
    </>
  )
}

export default Elect
