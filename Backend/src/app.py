from cgi import print_arguments
from http import client
from typing import final
from unicodedata import name
from flask import Flask, request, jsonify
from flask_pymongo import pymongo
from bson.objectid import ObjectId
from flask_cors import CORS
import os
from dotenv import load_dotenv
import datetime

load_dotenv()
userName = os.getenv('USERK')
password = os.getenv('PASSWORD')


# ------------------Instantiation-------------------------------

connection_url = 'mongodb+srv://'+userName+':'+password+'@cluster0.fs6sz.mongodb.net/users?retryWrites=true&w=majority'
print(connection_url)
app = Flask (__name__) # inicializar flask

client = pymongo.MongoClient(connection_url)

CORS(app) # cors permite que el servidor de flask se comunique con el servidor de React

# Database
Database = client.get_database('prueba')
# collection
#db = Database.time_bucket
db = Database.house_2
  

#-------------Routes-------------
@app.route('/date', methods = ['GET']) 
def getbyDate():
    startDay = datetime.datetime.fromisoformat(request.json['startDay'])
    finalDay = datetime.datetime.fromisoformat(request.json['finalDay']+' 23:59:59')

    print('json',request.json) #vamos a imprimir los datos en formato json que el cliente o navegador está enviando
    print('startDay',startDay,'finalDay',finalDay)
    data = []
    for doc in db.find({
    'd': {
        "$gte":(startDay),
        "$lte":(finalDay),
    }
    }):data.append({
            '_id': str(ObjectId(doc['_id'])),
            'd': doc['d'],
            'deviceId': doc['deviceId'],
            'nsamples': doc['nsamples'],
            'samples': doc['samples']
        })
    print(data)
    return jsonify(data)

    
@app.route('/allData', methods = ['GET']) #defino ruta para obtener todos los datos de una collection
def getData():
    data = [] #creo una lista y dentro de ella hay un diccionario por cada documento
    for doc in db.find(): # con un for recorro los documentos de la base de datos y se extrae la info
        data.append({
            '_id': str(ObjectId(doc['_id'])),
            'd': doc['d'],
            'deviceId': doc['deviceId'],
            'nsamples': doc['nsamples'],
            'samples': doc['samples']
        })
    print(data)
    return jsonify(data) #se retorna la lista con todos los usuarios

@app.route('/<appliance>', methods = ['GET']) #defino ruta para obtener todos los datos de la nevera
def getElectro(appliance):
    data = [] #creo una lista y dentro de ella hay un diccionario por cada documento
    for doc in db.find({'deviceId': appliance}): # con un for recorro los documentos de la base de datos y se extrae la info
        data.append({
            '_id': str(ObjectId(doc['_id'])),
            'd': doc['d'],
            'deviceId': doc['deviceId'],
            'nsamples': doc['nsamples'],
            'samples': doc['samples']
        })
    print(data)
    return jsonify(data) #se retorna la lista con todos los usuarios


if __name__== "__main__":
    app.run(debug=True)