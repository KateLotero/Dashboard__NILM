FROM node:16-alpine
# -p crea la carpeta si no existe
RUN mkdir -p /app

WORKDIR /app

COPY package*.json ./ 

RUN npm install

#copiar el directorio actual dentro del contenedor actual
COPY . .

EXPOSE 3000

CMD ["npm", "start"]