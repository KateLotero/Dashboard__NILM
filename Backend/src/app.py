from cgi import print_arguments
from http import client
from unicodedata import name
from flask import Flask, request, jsonify
from flask_pymongo import pymongo
from bson.objectid import ObjectId
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()
userName = os.getenv('USER')
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
db = Database.time_bucket
  

#-------------Routes-------------
@app.route('/users', methods = ['POST']) #defino ruta para crear usuarios
def createUser():
    #print(request.json) #vamos a imprimir los datos en formato json que el cliente o navegador está enviando
    ida = db.insert_one({#En la colletion de users voy a insertar un nuevo dato
    'name': request.json['name'],
    'email': request.json['email'],
    'password': request.json['password']
    })
    return jsonify(str(ida.inserted_id))
    
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

@app.route('/users/<id>', methods = ['GET']) #defino ruta para obtener 1 usuario a partir de un id dado
def getUser(id):
    user = db.find_one({'_id': ObjectId(id)}) # me devuelve toda la info de ese usuario
    print(user)
    return jsonify({                        # se retorna un json con la información del usuario
      '_id': str(ObjectId(user['_id'])),
      'name': user['name'],
      'email': user['email'],
      'password': user['password']
  })

@app.route('/users/<id>', methods = ['DELETE']) #defino ruta para eliminar usuario
def deleteUser(id):
    db.delete_one({'_id': ObjectId(id)})
    return jsonify({'message': 'User Deleted'})

@app.route('/users/<id>', methods = ['PUT']) #defino ruta para actualizar usuarios
def updateUser(id):
  print(request.json)
  db.update_one({'_id': ObjectId(id)}, {"$set": {
    'name': request.json['name'],
    'email': request.json['email'],
    'password': request.json['password']
  }})
  return jsonify({'message': 'User Updated'})
    

if __name__== "__main__":
    app.run(debug=True)