from cgi import print_arguments
from http import client
import string
from typing import final
from unicodedata import name
from flask import Flask, request, jsonify
from flask_pymongo import pymongo
from bson.objectid import ObjectId
from flask_cors import CORS
import os
from dotenv import load_dotenv
import datetime
import time


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
  

#-------------Routes--------------

# get data of date range
@app.route('/dateRange/<initDay>/<endDay>', methods = ['GET']) 
def getbyDate3(initDay,endDay):
    inicio = time.time()
    startDay = datetime.datetime.fromisoformat(initDay)
    finalDay = datetime.datetime.fromisoformat(endDay)

    #print('json',request.json) #vamos a imprimir los datos en formato json que el cliente o navegador está enviando
    print('startDay',startDay,'finalDay',finalDay)
    data = []
    for doc in db.aggregate([
    {    
    "$match": {
      "d": {
        "$gte":(startDay),
        "$lt":(finalDay),
      }     
    }
    },

    {
     "$unwind": "$samples"
    },

    {
      "$group": {
         "_id": {  
            "deviceId": "$deviceId",          
               "year":{"$year": "$d"},
               "month":{"$month": "$d"},            
            },    
        "average" : {"$avg": "$samples.power"},
        "count": {"$sum":1},
        },     

    },

    { "$sort" : { "_id.deviceId" : 1, "_id.month": 1, "_id.year": 1 } },



       
    ]):data.append({
            '_id': doc['_id'],
            'average': doc['average'],
            'countSamples': doc['count'],
            
        })
    #print(data)
    fin = time.time()
    print(fin-inicio) # 1.0005340576171875
    return jsonify(data)
    
# get all collection data     
@app.route('/allData', methods = ['GET']) 
def getData():
    data = [] 
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

# get all data of a specific appliance
@app.route('/<appliance>', methods = ['GET']) #defino ruta para obtener todos los datos de la nevera
def getElectro(appliance):
    data = [] 
    for doc in db.find({'deviceId': appliance}): 
        data.append({
            '_id': str(ObjectId(doc['_id'])),
            'd': doc['d'],
            'deviceId': doc['deviceId'],
            'nsamples': doc['nsamples'],
            'samples': doc['samples']
        })
    print(data)
    return jsonify(data) #se retorna la lista con todos los usuarios

# demo get date range
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

# demo2 get date range
@app.route('/pastMonth/<initDay>/<endDay>', methods = ['GET']) 
def getbyDate2(initDay,endDay):
    inicio = time.time()
    startDay = datetime.datetime.fromisoformat(initDay)
    finalDay = datetime.datetime.fromisoformat(endDay)

    #print('json',request.json) #vamos a imprimir los datos en formato json que el cliente o navegador está enviando
    print('startDay',startDay,'finalDay',finalDay)
    data = []
    for doc in db.find({
    'd': {
        "$gte":(startDay),
        "$lt":(finalDay),
    }
    }):data.append({
            '_id': str(ObjectId(doc['_id'])),
            'd': doc['d'],
            'deviceId': doc['deviceId'],
            'nsamples': doc['nsamples'],
            'samples': doc['samples']
        })
    print(data)
    fin = time.time()
    print(fin-inicio) # 1.0005340576171875
    return jsonify(data)



if __name__== "__main__":
    app.run(debug=True)

