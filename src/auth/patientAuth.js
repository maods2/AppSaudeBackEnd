// login patient:
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Patient = require('../database/models/patient.model')
const PatientController = require('../controllers/patientController');
const secret = 'f36e0a6c9e1011cfacd75f6ea0c96610'

module.exports = async (req, res) => {
    const {email, password} = req.body;
    const user = await Patient.findOne({email}).select('+password')

    if(!user)
        return res.status(400).send({message: 'User not found'})

    if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({message: 'Email or password is wrong'});
    
    user.password = undefined

    const token = jwt.sign({id: user.id}, secret, {
        expiresIn: 86400
    })

    res.send({user, token})
}
