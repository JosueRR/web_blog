const PersonalAdress = require('../models').PersonalAdress;

class PersonalAdressController {
    async index(req, res, next) {
        const personalAdressess = await PersonalAdress.findAll();
        if (req.session.flashMessage) {
            res.render('personalAdressess/index', { title: 'Direcciones Personales', personalAdressess: personalAdressess, flashMessage: req.session.flashMessage });
        }
        else {
            res.render('personalAdressess/index', { title: 'Direcciones Personales', personalAdressess: personalAdressess});
        }
    }

    async create(req, res, next) {
        if (req.method === 'POST') {
            await PersonalAdress.create({
                nombre: req.body.nombre,
                apellidos: req.body.apellidos,
                telefonoCasa: req.body.telefonoCasa,
                direccionCasa: req.body.direccionCasa,
                telefonoTrabajo: req.body.telefonoTrabajo,
                direccionTrabajo: req.body.direccionTrabajo,
                correo: req.body.correo,
            });
            res.redirect('/personaladress');
        }
        else {
            res.render('personalAdressess/create', { title: 'Direcciones Personales, crear'});
        }
    }

    async update(req, res, next) {
        if (req.method === 'POST') {
            await PersonalAdress.update(
            {
                nombre: req.body.nombre,
                apellidos: req.body.apellidos,
                telefonoCasa: req.body.telefonoCasa,
                direccionCasa: req.body.direccionCasa,
                telefonoTrabajo: req.body.telefonoTrabajo,
                direccionTrabajo: req.body.direccionTrabajo,
                correo: req.body.correo
            },
            {
                where: {
                    id: req.params.id
                }
            });
            res.redirect('/personaladress');
        }
        else {
            const personalAdress = await PersonalAdress.findOne({
                where: {
                    id: req.params.id
                }
            });
            res.render('personalAdressess/update', { title: 'Direcciones Personales, editar', personalAdress: personalAdress});
        }
    }

    async delete(req, res, next) {
        await PersonalAdress.destroy({
            where: {
                id: req.params.id
            }
        });
        req.session.flashMessage = 'Se eliminó la dirección';
        res.redirect('/personaladress');
    }
}

module.exports = PersonalAdressController;