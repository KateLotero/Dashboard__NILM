import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import React, {useEffect, useState} from 'react' 
import {
    CChartBar,
    CChartDoughnut,
    CChartLine,
    CChartPie,
  } from '@coreui/react-chartjs'
import { DocsCallout } from 'src/components' 
import { reject, resolve } from 'core-js/es/array';
import { func } from 'prop-types';



const API = process.env.REACT_APP_API; //Call the environment var to connect with Flask
console.log(API)// print server address




 const Elect = () => {

//***************************************  requests to the server *************************************/

    function dataApliance (data){
        const dataElect = data
        console.log('Datos Electrodoméstico',dataElect)
        const samplesElect =  dataElect.map(x => [x.d,x.samples])
        console.log('fecha , Muestras elect',samplesElect)
        let sample = samplesElect[0][1]
        console.log('muestras',sample)
        let potencia = sample.map(x => x.power)
        console.log('potencia',potencia) 
        let sumaa = 0
        let suma = potencia.map(x => {
            sumaa += x
        })
        console.log(suma)

    }


    //Consumo promedio de cada electrodom[estico en un mes
    //Consumo durante el año


  
    const getAppliance =  (appliance) => {
        fetch(`${API}/${appliance}`,) // GET is the default method
        .then(res => res.json())// res is an object, al convertirlo en json estoy haciendo otra promesa  
        .then(data=> dataApliance(data))//por eso uso este otro then
        //console.log(`${API}/${appliance}`)
        
    }
   
    getAppliance('nevera')
    
  

   


//**************************************** page ****************************************/
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
