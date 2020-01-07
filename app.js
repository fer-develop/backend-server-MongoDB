// Rquieres - librerias para las funcionalidades que se van a ocupar
var express = require("express");
// Utilizar para definir el esquema que utiliza nuestros modelos para la insercion de datos
var mongoose = require("mongoose");
// Middleware que se encarga de convertir la data de un objeto es un archivo js para su insercion
var bodyParser = require("body-parser");

// Inicializar variables
var app = express();

// Body parser
// parse application/x-www-form-urlencoded
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

// mongoose.set('useCreateIndex', true);

// Importar Rutas
var appRoutes = require("./routes/app");
var usuarioRoutes = require("./routes/usuario");
var loginRoutes = require("./routes/login");
var hospitalRoutes = require("./routes/hospital");
var medicoRoutes = require("./routes/medico");
var busquedaRoutes = require("./routes/busqueda");
var uploadRoutes = require("./routes/upload");
var imagenesRoutes = require("./routes/imagenes");

// Conexion a la base de datos
mongoose.connection.openUri(
    "mongodb://localhost:27017/hospitalDB", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    },
    (err, res) => {
        if (err) throw err;
        console.log("Base de datos: \x1b[36m%s\x1b[0m", "Online");
    }
);

// Servidor Index
/* var serveIndex = require("serve-index");
app.use(express.static(__dirname + "/"));
app.use("/uploads", serveIndex(__dirname + "/uploads")); */

//Rutas
app.use("/img", imagenesRoutes);
app.use("/upload", uploadRoutes);
app.use("/busqueda", busquedaRoutes);
app.use("/medico", medicoRoutes);
app.use("/hospital", hospitalRoutes);
app.use("/usuario", usuarioRoutes);
app.use("/login", loginRoutes);
app.use("/", appRoutes);

//Escuchar peticiones
app.listen(3000, () => {
    console.log(
        "Express server corriendo en puerto 3000: \x1b[36m%s\x1b[0m",
        "Online"
    );
});