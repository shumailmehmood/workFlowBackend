const User = require('../schemas/user');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const ValidatingMethods=require('../validatingMethods/users');
// function validateUserLogin(user) {
//     const schema =
//         {
//             email: Joi.string().min(5).max(255).required().email(),
//             password: Joi.string().min(5).max(1024).required()
//         }
//     return Joi.validate(user, schema);
// }
exports.login = async (req, res, next) => {
    const { error } = ValidatingMethods.validateUserLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let account_verification = await User.findOne({ $and: [{ email: req.body.email, isVerified: true }] });
    if (!account_verification) return res.status(400).send('Your Account is not Verified');
    let user = await User.findOne({ $and: [{ email: req.body.email, accountStatus: 'active' }] });
    if (!user) return res.status(400).send('Invalid user');
    const compareUser = await bcrypt.compare(req.body.password, user.password);
    if (!compareUser) return res.status(400).send('Invalid user name and password');
    const token = user.generateToken();
    res.status(200).send(token);

}