/**
 * Summary (Clase que contiene las configuraciones del servidor)
 *
 * Description. (Configuracion del puerto, base de datos, token de autenticacion)
 *
 * @class
 * @author Daniel Vega.
 * @since  1.0.0
 */
const dotenv = require('dotenv')
const morgan = require('morgan')
const path = require('path')

dotenv.config()
var express = require('express')
var app = express()
app.use(morgan('tiny'))

app.get('/', function (req, res) {
    res.send('hello, world!')
})

// URL API
app.use(require("../routes/index"));


app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto ${process.env.PORT}`)
})