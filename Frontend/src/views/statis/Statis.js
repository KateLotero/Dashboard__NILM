import React, { useEffect, useState } from 'react'
import { CChartBar, CChartDoughnut, CChartLine, CChartPie } from '@coreui/react-chartjs'
import {
  CAvatar,
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
  CCardImage,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'

import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import diagram from './../../assets/images/Diagrama.png'
import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

import { width } from '@mui/system'

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
  const tableExample = [
    {
      avatar: { src: avatar1 },
      user: {
        name: 'Yiorgos Avraamu',
        new: true,
        registered: 'Jan 1, 2021',
      },
    },
    {
      avatar: { src: avatar2, status: 'danger' },
      user: {
        name: 'Avram Tarasios',
        new: false,
        registered: 'Jan 1, 2021',
      },
    },
    {
      avatar: { src: avatar3, status: 'warning' },
      user: { name: 'Quintin Ed', new: true, registered: 'Jan 1, 2021' },
    },
    {
      avatar: { src: avatar4, status: 'secondary' },
      user: { name: 'Enéas Kwadwo', new: true, registered: 'Jan 1, 2021' },
    },
    {
      avatar: { src: avatar5, status: 'success' },
      user: {
        name: 'Agapetus Tadeáš',
        new: true,
        registered: 'Jan 1, 2021',
      },
    },
  ]
  //**************************************** page ****************************************/
  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>¿Qué es NIX?</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs={6}>
                  <p>
                    <small>
                      NIX es un sistema basado en NILM (monitoreo no invasivo de carga). Este
                      sistema le permite al usuario conocer el consumo de energía total o individual
                      de los electrodomésticos. El diagrama general del sistema muestra las etapas
                      que permiten desagregar el consumo de energía de cada electrodoméstico. En
                      este caso, el proceso de desagregación se realiza a través de una red neuronal
                      LSTM. Los datos resultantes, se almacenan en una base de datos que es
                      consultada por la aplicación web, dependiendo de las peticiones del usuario.
                    </small>
                  </p>

                  <p>
                    <small>
                      Con esta información, por un lado, los usuarios pueden tomar decisiones
                      encaminadas al uso eficiente de energía. Por otro lado, las empresas
                      prestadoras del servicio pueden identificar las tendencias de consumo del
                      usuario, diseñar un plan de gestión de la demanda y ajustar los planes de
                      generación de energía.
                    </small>
                  </p>
                </CCol>
                <CCol xs={6}>
                  <div className="text-center border">
                    <img src={diagram} className="img-fluid" alt="Responsive image"></img>
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Sobre nosotros</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol>
                  <small>
                    Nix se desarrolló en el marco del proyecto P14-SÉNECA-MICRORREDES, que hace
                    parte del Programa para la Sostenibilidad Energética de Colombia, a través del
                    trabajo de grado{' '}
                    <em>
                      Sistema para la desagregación de perfiles de carga usando técnicas de
                      inteligencia computacional a través del monitoreo no invasivo de carga
                    </em>
                    ; a cargo de Katerine Lotero Londoño y Pablo Andrés Uribe Agudelo. El trabajo
                    contó con la dirección de los profesores Wilfredo Alfonso y Jenniffer Guerrero,
                    y la asesoría del ingeniero James Gaviria.
                  </small>
                </CCol>

                <CCol>
                  <p className="mt-1">
                    <small>
                      <strong>Contáctanos</strong>
                    </small>
                  </p>
                  <p className="mt-2">
                    <small>katerine.lotero@correounivalle.edu.co</small>
                  </p>
                  <p className="mt-2">
                    <small>pablo.uribe@correounivalle.edu.co</small>
                  </p>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
export default Statis
