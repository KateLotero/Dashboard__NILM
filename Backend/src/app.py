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
db = Database.UsuarioUno
  

#-------------Routes--------------

# get data of date range
@app.route('/powerDateRange/<initDay>/<endDay>', methods = ['GET']) 
def getPowerDataRange(initDay,endDay):
    inicio = time.time()
    startDay = datetime.datetime.fromisoformat(initDay).replace(hour = 5, minute = 0, second=0, microsecond=0)
    finalDay = datetime.datetime.fromisoformat(endDay).replace(hour = 5, minute = 0, second=0, microsecond=0)

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
    
# get power by hour
@app.route('/powerHour/<initDay>/<endDay>/<device>', methods = ['GET']) 
def getPowerByHour(initDay,endDay,device):
    inicio = time.time()
    startDay = datetime.datetime.fromisoformat(initDay).replace(hour = 5, minute = 0, second=0, microsecond=0)
    finalDay = datetime.datetime.fromisoformat(endDay).replace(hour = 5, minute = 0, second=0, microsecond=0)

    #print('json',request.json) #vamos a imprimir los datos en formato json que el cliente o navegador está enviando
    print('startDay',startDay,'finalDay',finalDay)
    data = []

    for doc in db.aggregate([
    {    
    "$match": {
        '$and': [{
            "d": {
                "$gte":(startDay),
                "$lte":(finalDay),
            },
            "deviceId":device 
            }]   
        }
    },

    {
    "$addFields": {
      "subarraySize": 4
    }
    },
    {
    "$addFields": {
      "startingIndices": {
        "$range": [
          0,
          {
            "$size": "$samples"
          },
          "$subarraySize"
        ]
      }
    }
  },

  {
    "$project": {
      "slicedArray": {
        "$map": {
          "input": "$startingIndices",
          "as": "i",
          "in":  {
            "$slice": [
              "$samples",
              "$$i",
              "$subarraySize",              
            ],        
          }
        },
      },
      "d": "$d",
      "deviceId": "$deviceId",
      
    }
  }, 

   {
    "$project": {
      "power": {
        "$map": {
          "input": "$slicedArray",
          "as": "i",
          "in":  {
            "$map": {
                "input":"$$i",
                "as":"n",
                "in": {"$avg": "$$n.power"}
            },
          }
        },
      },
      "d": "$d",
      "deviceId": "$deviceId",
    }
  }, 

{
    "$project": {
      "avgHour": {
        "$map": {
          "input": "$power",
          "as": "i",
          "in":  { "$avg": "$$i" }
        },
      },
      "d": "$d",
      "deviceId": "$deviceId",
    }
  },
    
       
    ]):data.append({
        'avgHour': doc['avgHour'],
        'd': doc['d'], 
        'deviceId': doc['deviceId'],
    })
    fin = time.time()
    print(fin-inicio) # 1.0005340576171875
    return jsonify(data)
      

# get data to report
@app.route('/powerMonthReport/<initDay>/<endDay>', methods = ['GET']) 
def getReport(initDay,endDay):
    inicio = time.time()
    startDay = datetime.datetime.fromisoformat(initDay).replace(hour = 5, minute = 0, second=0, microsecond=0)
    finalDay = datetime.datetime.fromisoformat(endDay).replace(hour = 5, minute = 0, second=0, microsecond=0)

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

{
      "$group": {
         "_id": {  
                      
               "year": "$_id.year",
               "month": "$_id.month",            
            },
      "datos" : {"$push" : {"deviceId": "$_id.deviceId", "average" :"$average", "count": "$count"}}
      
      },   
    },
  

    { "$sort" : { "_id.month": 1, "_id.year": 1 } },



       
    ]):data.append({
            '_id': doc['_id'],
            'datos': doc['datos'],               
      })
    #print(data)
    fin = time.time()
    print(fin-inicio) # 1.0005340576171875
    return jsonify(data)
    



if __name__== "__main__":
    app.run(debug=True)

