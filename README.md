# Dashboard__NILM

This project is a dashboard oriented to NILM (Non-Intrusive Load Monitoring). On the dashboard, the user can monitor the energy consumption of three devices: the washing machine, microwave, and fridge. The user can select different dates and obtain the consumption in a month or per hour for each device.

This project has three principal parts. Firstly, a stage to desegregate the total power consumption through a neural network LSTM and save the results in MongoDB Atlas. Secondly, an API that makes the queries to MongoDB Atlas, and Thirdly, a web application to show the user different graphs about their consumption. 

For the desegregation process, we implement an LSTM using Keras. The API was developed with Flask. For the frontend, we use React, specifically a Template created by CoreUI. This is the link to download the template : [CoreUI Pro React Admin Template](https://coreui.io/pro/react). 

![](static/img/example.png)


### Instalation 
## Model_LSTM

This directory is made up of two jupyter notebooks. On the one hand, Nix_Core has the main function that allows connection to MongoDB Atlas. For this, it is necessary to provide the location of the trained models and the data to be analyzed, the latter is also built in this notebook. The addresses can be changed by the end user and to carry out a test it is only necessary to define a start date, like this:

Bbackend_to_MongoDB('2022-01-01')

On the other hand, BBackend_Final shows how a model is obtained, in this case, for the fridge. A similar approach can be used for the microwave and the washing machine.

## API 
This directory contains the API developed on Flask. 

1. Create a virtual environment in the API/src folder, where the requirement.txt is
2. Activate the virtual environment
3. Install the used packages: pip install -r requirements.txt
4. Create an .env with Mongo credentials.
     PASSWORD = password
     USERK = user
5. Run the app with python app.py
6. Dev server at http://localhost:5000 



## Fronted
This directory contains the web application's source code. Dev server with hot reload at http://localhost:3000

1. Install the packages with npm install
2. Run npm start



## License

MIT
