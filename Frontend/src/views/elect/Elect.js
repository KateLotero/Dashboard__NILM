import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import React, {useEffect, useState} from 'react' 
import {
    CChartBar,
    CChartDoughnut,
    CChartLine,
    CChartPie,
  } from '@coreui/react-chartjs'




const API = process.env.REACT_APP_API; //Call the environment var to connect with Flask
console.log(API)// print server address




const Elect = () => {
    const [powerAppliances, setPowerAppliances] = useState([])
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const elects = ['nevera','washing_machine']

//***************************************  requests to the server *************************************/
    
    const getAppliances =  () => {      
        fetch(`${API}/allData`,) // GET is the default method
        .then(res => res.json())// res is an object, al convertirlo en json estoy haciendo otra promesa  
        .then(data=> setPowerAppliances(data))//por eso uso este otro then
        //console.log(`${API}/${appliance}`)
    }
    useEffect (()=>{
        getAppliances()
    },[])


//*************************************** Data process **************************************************
    
    // Calculate average power consumption each day
    function dataAppliances (data){  //Receive the data extracted of the data base
            const dataElect = data
            //console.log('Datos de una casa', dataElect)

            const muestras =  dataElect.map(function(x){
                let newArray = {
                    'deviceId': x.deviceId,
                    'd': x.d,
                    'samples': x.samples,
                }
                return newArray
            })
            console.log('elect, fecha , Muestras elect', muestras)
            const filtro = muestras.filter(x => x.d.includes('Jan'))
            console.log('filtrosiiiiiiiiii',filtro)

            /*

            const samplesElect = muestras.map(x => [x.deviceId,x.d,x.samples])
            
            for (let i = 0; i < samplesElect.length; i++){
                let sample = samplesElect[i][2]
                console.log('muestras', sample)

                let powerElect = sample.map(x => x.power)
                console.log('potencia', powerElect) 
                
                let average = (powerElect.reduce( (total,value) => total+value))/96 //Preguntar a Pablo si siempre serán 96
                console.log(average)

                samplesElect[i][2] = average
                console.log('promedio por día', samplesElect)
            }
            return samplesElect */
        }
  
    const dataElects = dataAppliances(powerAppliances)
    console.log('Datos Electrodomésticos procesados', dataElects)
/*
    //filter by appliance 
    const fridge = dataElects.filter(x => x[0] == 'nevera') 
    console.log('datos nevera',fridge)  

    let fridgeMonth = []
    let average = 0
    for (let k = 0; k < months.length; k++){
        
        for (let i = 0; i < fridge.length; i++){
            if (fridge[i][1] == months[k]){
                average = fridge[i][1] + average
                //console.log('promedio',average,'meses',months[k])
            }
            fridge.some 
            average = (powerElect.reduce( (total,value) => total+value))
            
        }

        fridgeMonth.push([months[k],average])          
    }
    console.log('potencia mes nevera', fridgeMonth)

        



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
