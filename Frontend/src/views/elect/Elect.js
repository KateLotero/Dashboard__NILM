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

import Nevera from './../../assets/images/Nevera.jpg' // ./ me sirve para ubicarme en el directorio de este archivo
import Microondas from './../../assets/images/Microondas.jpg' // ../ me devuelvo un directorio
import Lavadora from './../../assets/images/Lavadora.jpg'
import Otros from './../../assets/images/otros.jpg'
import lightning from './../../assets/images/lightning.png'
import money from './../../assets/images/dinero3.png'
import { imageListItemClasses } from '@mui/material'

const images = { Nevera, Microondas, Lavadora, Otros }

const API = process.env.REACT_APP_API //Call the environment var to connect with Flask
console.log(API) // print server address

const Elect = () => {
  /*************************************** constants *************************************/

  const [dataCards, setDataCards] = useState([])

  console.time('loop')

  // calculate the past month
  const date = new Date()
  let pastMonth =
    date.getMonth().toString().length == 2 ? `${date.getMonth()}` : `0${date.getMonth()}`
  let actualMonth =
    (date.getMonth() + 1).toString().length == 2
      ? `${date.getMonth() + 1}`
      : `0${date.getMonth() + 1}`
  pastMonth = pastMonth == '00' ? '12' : pastMonth
  let date1 = `${date.getFullYear()}-${pastMonth}-01`
  let date2 = `${date.getFullYear()}-${actualMonth}-01`
  date1 = '2022-01-01'
  date2 = '2022-02-01'

  //*************************************** requests to the server *************************************/

  const getPastMonth = () =>
    fetch(`${API}/dateRange/${date1}/${date2}`)
      .then((res) => res.json())
      .catch((error) => console.error('Error:', error))

  //*************************************** Data process **************************************************

  useEffect(async () => {
    const fetchedAppliances = await getPastMonth()
    console.log('respuestaaaa', fetchedAppliances)

    let device = ''
    let power = 0
    let power_kWh = 0
    let days = 0
    let price = 0
    let price_kWh = 0
    let data = []
    let image = ''

    for (let i = 0; i < fetchedAppliances.length; i++) {
      if (fetchedAppliances[i]._id.deviceId != 'Total') {
        device = fetchedAppliances[i]._id.deviceId
        power = fetchedAppliances[i].average // Watts
        days = fetchedAppliances[i].countSamples / 96
        power_kWh = ((power * 24 * days) / 1000).toFixed(1)
        price_kWh = 500 // $/kWh
        price = Math.round(power_kWh * price_kWh)
        image = images[device]

        data.push({ device, power_kWh, price, image })
      }
    }
    console.timeEnd('loop')
    setDataCards(data)
  }, [])

  console.log('cardsss', dataCards)

  //**************************************** page ****************************************/
  return (
    <>
      <CRow>
        <CCol>
          <CCard xs={12} sm={12} md={12}>
            <CCardHeader>
              {' '}
              <center>
                <h5>Consumo de energía en el mes anterior</h5>
              </center>
            </CCardHeader>
            <CRow>
              {dataCards.map((card) => (
                <CCol xs={12} sm={6} md={3} key={card.device}>
                  <CCard className="border border-1">
                    <CCardImage
                      orientation="top"
                      src={card.image}
                      style={{ maxBlockSize: '20rem' }}
                    />
                    <CCardBody>
                      <CCardTitle>{card.device}</CCardTitle>
                      <CCard className="mb-3 border-0" style={{ maxWidth: '220px' }}>
                        <CRow className="g-0">
                          <CCol md={4} sm={4} xs={4}>
                            <CCardImage src={lightning} />
                          </CCol>
                          <CCol md={8} sm={8} xs={8}>
                            <CCardBody>
                              <CCardText>{card.power_kWh} kWh</CCardText>
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
                              <CCardText>
                                {new Intl.NumberFormat('es-ES').format(card.price)} pesos
                              </CCardText>
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
