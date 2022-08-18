# Dashboard__NILM

This project is a dashboard oriented to NILM (Non-Intrusive Load Monitoring) in development yet.

For the backend we use Python, the server is based on Flask.

For the frontend we use React, specifically a Template created by CoreUI. This is the link to download the template : [CoreUI Pro React Admin Template](https://coreui.io/pro/react)

## Model_LSTM

This directory is composed of two jupyter notebooks, in Nix_Core is the main function that allows the connection with MongoDB Atlas. For this, it is necessary to provide the location of the trained models and the data to be analyzed, the latter is also built in this notebook. The addresses can be changed by the end user and to carry out a test it is only necessary to define a start date, like this:

Bbackend_to_MongoDB('2022-01-01')

