import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import React, {useEffect, useState} from 'react' 
import {
    CChartBar,
    CChartDoughnut,
    CChartLine,
    CChartPie,
  } from '@coreui/react-chartjs'
import { DocsCallout } from 'src/components' 


const API = process.env.REACT_APP_API; //Estamos llamando la variable de entorno que me conecta con Flask
console.log(API)// Imprime dirección del servidor




 const Elect = () => {

    
//***************************************  Peticiones para el servidor *************************************/

    //Obtener datos nevera 

    const res =  fetch(`${API}/nevera`,) //por defecto está el método GET
    const data =  res.json();
    console.log(res);

    
//**************************************** Esqueleto de la página ****************************************/
  return (
    <>
        <h1>Comparación del consumo en los últimos meses</h1>
        <CRow>
            <CCol xs={6}>
                <CCard className="mb-4">
                <CCardHeader>Enero</CCardHeader>
                <CCardBody>
                    <CChartPie
                    data={{
                        labels: ['Nevera', 'Microondas', 'Yellow'],
                        datasets: [
                        {
                            data: [300, 50, 100],
                            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                        },
                        ],
                    }}
                    />
                </CCardBody>
            </CCard>
            <CCol xs={6}>
                <CCard>
                
                    
                
                </CCard>

            </CCol>

            </CCol>
        </CRow>

        
        

    </>
  )
}

export default Elect
