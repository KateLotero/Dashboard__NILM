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

import diagram from './../../assets/images/diagram.jpg'
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
              <p>
                NIX es un sistema basado en NILM (monitoreo no invasivo de carga), que a través de
                un medidor inteligente captura el consumo total de energía y luego, lo procesa para
                estimar el consumo eléctrico de cargas desagregadas, en este caso electrodomésticos,
                de manera no invasiva. Este sistema le permite al usuario conocer el consumo de
                energía total o individual de los electrodomésticos, al igual que su tiempo de uso.
                Esta información permite conocer las tendencias de consumo del usuario, diseñar un
                plan de gestión de la demanda y validar su impacto sobre el uso eficiente de la
                energía. A continuación, se muestra el diagrama general del sistema:
              </p>

              <div className="text-center border" style={{ margin: '2rem' }}>
                <CCardImage
                  orientation="bottom"
                  src={diagram}
                  style={{ height: '30rem', width: '40rem' }}
                />
              </div>

              <p>
                En este caso, el proceso de desagregación se realiza a través de una red neuronal
                LSTM, los datos resultantes de este proceso se almacenan en una base de datos que es
                consultada por la aplicación web.
              </p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Sobre nosotros</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell className="text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell>Nosotros</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {tableExample.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-center">
                        <CAvatar size="md" src={item.avatar.src} status={item.avatar.status} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.user.name}</div>
                        <div className="small text-medium-emphasis">
                          <span>{item.user.new ? 'New' : 'Recurring'}</span> | Registered:{' '}
                          {item.user.registered}
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
export default Statis
