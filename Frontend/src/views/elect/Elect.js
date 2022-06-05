import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardImage,
  CCardText,
  CCardTitle,
  CCol,
  CRow,
} from '@coreui/react'

import fridge from './../../assets/images/Nevera.jpg' // ./ me sirve para ubicarme en el directorio de este archivo
import microwave from './../../assets/images/Microondas.jpg' // ../ me devuelvo un directorio
import washMachine from './../../assets/images/Lavadora.jpg'
import Otros from './../../assets/images/otros.jpg'
import lightning from './../../assets/images/lightning.png'
import money from './../../assets/images/dinero3.png'

const API = process.env.REACT_APP_API //Call the environment var to connect with Flask
console.log(API) // print server address

const Elect = () => {
  /*************************************** constants *************************************/

  const [dataCards, setDataCards] = useState([])

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
  console.time('loop')

  // calculate the past month
  const date = new Date()
  let pastMonth = date.getMonth().length == 2 ? date.getMonth() : `0${date.getMonth()}`
  let actualMonth =
    (date.getMonth() + 1).length == 2 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`
  pastMonth = pastMonth == '00' ? '12' : pastMonth
  let date1 = `${date.getFullYear()}-${pastMonth}-01`
  let date2 = `${date.getFullYear()}-${actualMonth}-01`
  date1 = '2022-01-01'
  date2 = '2022-02-01'

  //*************************************** requests to the server *************************************/

  const getPastMonth = () =>
    fetch(`${API}/lastMonth/${date1}/${date2}`)
      .then((res) => res.json())
      .catch((error) => console.error('Error:', error))

  useEffect(async () => {
    const fetchedAppliances = await getPastMonth()
    console.log('respuestaaaa', fetchedAppliances)

    let device = ''
    let power = 0
    let days = 0
    let price = 0
    let price_kWh = 0
    let data = []

    for (let i = 0; i < fetchedAppliances.length; i++) {
      device = fetchedAppliances[i]._id.deviceId
      power = fetchedAppliances[i].average
      power = power.toFixed(2)
      days = fetchedAppliances[i].countSamples / 96
      price_kWh = 500
      price = Math.round((power * 24 * days * price_kWh) / 1000)

      data.push({ device, power, price })
    }
    console.timeEnd('loop')
    setDataCards(data)
  }, [])

  console.log('cardsss', dataCards)

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
          <CCard xs={12} sm={12} md={12}>
            <CCardHeader>Consumo de energía en el mes anterior</CCardHeader>
            <CRow>
              <CCol xs={12} sm={6} md={3}>
                <CCard className="border border-1">
                  <CCardImage orientation="top" src={fridge} style={{ maxBlockSize: '20rem' }} />
                  <CCardBody>
                    <CCardTitle>Nevera</CCardTitle>
                    <CCard className="mb-3 border-0" style={{ maxWidth: '220px' }}>
                      <CRow className="g-0">
                        <CCol md={4} sm={4} xs={4}>
                          <CCardImage src={lightning} />
                        </CCol>
                        <CCol md={8} sm={8} xs={8}>
                          <CCardBody>
                            <CCardText>240.6 kW/mes</CCardText>
                          </CCardBody>
                        </CCol>
                      </CRow>
                    </CCard>
                    <CCard className="mb-3 border-0" style={{ maxWidth: '220px' }}>
                      <CRow className="g-0">
                        <CCol md={4} sm={4} xs={4}>
                          <CCardImage src={money} />
                        </CCol>
                        <CCol md={8} sm={8} xs={8}>
                          <CCardBody>
                            <CCardText>35000 pesos</CCardText>
                          </CCardBody>
                        </CCol>
                      </CRow>
                    </CCard>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol xs={12} sm={6} md={3}>
                <CCard className="border border-1">
                  <CCardImage orientation="top" src={microwave} style={{ maxBlockSize: '20rem' }} />
                  <CCardBody>
                    <CCardTitle>Microondas</CCardTitle>
                    <CCard className="mb-3 border-0" style={{ maxWidth: '220px' }}>
                      <CRow className="g-0">
                        <CCol md={4} sm={4} xs={4}>
                          <CCardImage src={lightning} />
                        </CCol>
                        <CCol md={8} sm={8} xs={8}>
                          <CCardBody>
                            <CCardText>240.6 kW/mes</CCardText>
                          </CCardBody>
                        </CCol>
                      </CRow>
                    </CCard>
                    <CCard className="mb-3 border-0" style={{ maxWidth: '220px' }}>
                      <CRow className="g-0">
                        <CCol md={4} sm={4} xs={4}>
                          <CCardImage src={money} />
                        </CCol>
                        <CCol md={8} sm={8} xs={8}>
                          <CCardBody>
                            <CCardText>35000 pesos</CCardText>
                          </CCardBody>
                        </CCol>
                      </CRow>
                    </CCard>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol xs={12} sm={6} md={3}>
                <CCard className="border border-1">
                  <CCardImage
                    orientation="top"
                    src={washMachine}
                    style={{ maxBlockSize: '20rem' }}
                  />
                  <CCardBody>
                    <CCardTitle>Lavadora</CCardTitle>
                    <CCard className="mb-3 border-0" style={{ maxWidth: '220px' }}>
                      <CRow className="g-0">
                        <CCol md={4} sm={4} xs={4}>
                          <CCardImage src={lightning} />
                        </CCol>
                        <CCol md={8} sm={8} xs={8}>
                          <CCardBody>
                            <CCardText>240.6 kW/mes</CCardText>
                          </CCardBody>
                        </CCol>
                      </CRow>
                    </CCard>
                    <CCard className="mb-3 border-0" style={{ maxWidth: '220px' }}>
                      <CRow className="g-0">
                        <CCol md={4} sm={4} xs={4}>
                          <CCardImage src={money} />
                        </CCol>
                        <CCol md={8} sm={8} xs={8}>
                          <CCardBody>
                            <CCardText>35000 pesos</CCardText>
                          </CCardBody>
                        </CCol>
                      </CRow>
                    </CCard>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol xs={12} sm={6} md={3}>
                <CCard className="border border-1">
                  <CCardImage orientation="top" src={Otros} style={{ maxBlockSize: '20rem' }} />
                  <CCardBody>
                    <CCardTitle>Otros</CCardTitle>
                    <CCard className="mb-3 border-0" style={{ maxWidth: '220px' }}>
                      <CRow className="g-0">
                        <CCol md={4} sm={4} xs={4}>
                          <CCardImage src={lightning} />
                        </CCol>
                        <CCol md={8} sm={8} xs={8}>
                          <CCardBody>
                            <CCardText>240.6 kW/mes</CCardText>
                          </CCardBody>
                        </CCol>
                      </CRow>
                    </CCard>
                    <CCard className="mb-3 border-0" style={{ maxWidth: '220px' }}>
                      <CRow className="g-0">
                        <CCol md={4} sm={4} xs={4}>
                          <CCardImage src={money} />
                        </CCol>
                        <CCol md={8} sm={8} xs={8}>
                          <CCardBody>
                            <CCardText>35000 pesos</CCardText>
                          </CCardBody>
                        </CCol>
                      </CRow>
                    </CCard>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
            <CRow>
              {dataCards.map((card) => (
                <CCol xs={12} sm={6} md={3}>
                  <CCard className="border border-1">
                    <CCardImage orientation="top" src={fridge} style={{ maxBlockSize: '20rem' }} />
                    <CCardBody>
                      <CCardTitle>{card.device}</CCardTitle>
                      <CCard className="mb-3 border-0" style={{ maxWidth: '220px' }}>
                        <CRow className="g-0">
                          <CCol md={4} sm={4} xs={4}>
                            <CCardImage src={lightning} />
                          </CCol>
                          <CCol md={8} sm={8} xs={8}>
                            <CCardBody>
                              <CCardText>{card.power} kW/mes</CCardText>
                            </CCardBody>
                          </CCol>
                        </CRow>
                      </CCard>
                      <CCard className="mb-3 border-0" style={{ maxWidth: '220px' }}>
                        <CRow className="g-0">
                          <CCol md={4} sm={4} xs={4}>
                            <CCardImage src={money} />
                          </CCol>
                          <CCol md={8} sm={8} xs={8}>
                            <CCardBody>
                              <CCardText>{card.price} pesos</CCardText>
                            </CCardBody>
                          </CCol>
                        </CRow>
                      </CCard>
                    </CCardBody>
                  </CCard>
                </CCol>
              ))}
            </CRow>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Elect
