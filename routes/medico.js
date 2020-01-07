var express = require("express");
var mdAuntenticacion = require('../middlewares/autenticacion');
var app = express();
var Medico = require("../models/medico");

/* var Hospital = require("../models/hospital"); */

// Obtener todos los medicos
app.get("/", (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Medico.find({}).skip(desde).limit(5).populate('usuario', 'nombre email')
        .populate('hospital').exec((err, medicos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error cargando medicos",
                    errors: err
                });
            }

            Medico.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    medicos: medicos,
                    total: conteo
                });
            });
        });
});

// Crear un nuevo medico
app.post("/", mdAuntenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        // img: body.img,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    /*  Hospital.findById(body.hospital, (err, hospital) => {
         if (err) {
             return res.status(500).json({
                 ok: false,
                 mensaje: "Error al buscar hospital",
                 errors: err
             });
         }

         if (!hospital) {
             return res.status(400).json({
                 ok: false,
                 mensaje: "El hospital con el id " + body.hospital + " no existe",
                 errors: {
                     message: "No existe hospital con ese id"
                 }
             });
         }
     }); */

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error al crear medico",
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado,
            decoded: req.medico
        });
    });
});

// Actualizar medico
app.put("/:id", mdAuntenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar medico",
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: "El medico con el id " + id + " no existe",
                errors: {
                    message: "No existe medico con ese id"
                }
            });
        }

        medico.nombre = body.nombre;
        // medico.img = body.img;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar medico",
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });
    });
});

//Borrar medico
app.delete("/:id", mdAuntenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al borrar medico",
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(500).json({
                ok: false,
                mensaje: "No existe un medico con ese id",
                errors: {
                    message: "No existe un medico con ese id"
                }
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    });
});

module.exports = app;