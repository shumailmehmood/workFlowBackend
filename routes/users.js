var express = require('express');
var router = express.Router();
const Joi = require('joi');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../schemas/user');
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');
const UsersController = require('../controllers/users');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }

});
const upload = multer({ storage: storage });
function validateUser(user) {
  const schema =
    {
      name: Joi.string().min(5).max(255).required(),
      email: Joi.string().min(5).max(255).required().email(),
      designation: Joi.string().required(),
      password: Joi.string().min(5).max(1024).required(),
      isAdmin: Joi.boolean().required(),
      gender: Joi.string().required(),
      experience: Joi.string().required(),
      salary: Joi.string().required(),
      timeIn: Joi.string().required(),
      timeOut: Joi.string().required(),
    }
  return Joi.validate(user, schema);
}
function validateUpdatedUser(user) {
  const schema =
    {
      name: Joi.string().min(5).max(255).required(),
      password: Joi.string().min(5).max(1024).required(),

    }
  return Joi.validate(user, schema);
}



router.post('/reg', async (req, res) => {

  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User Already Exists!!');

  user = new User(
    _.pick(req.body, ['name', 'email', 'designation', 'password', 'isAdmin', 'gender', 'experience', 'salary', 'timeIn', 'timeOut'])
  );

  const secretToken = randomstring.generate();
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user.secretToken = secretToken;
  user = await user.save();
  const output = `Hi there,
      <br/>
      Thank you for registering!
      <br/><br/>
      Please verify your email by typing the following token:
      <br/>
      Token: <b>${secretToken}</b>
      <br/>
      On the following page:
      <a href="http://localhost:3000/verify">http://localhost:3000/verify</a>
      <br/><br/>
      Have a pleasant day.`;

  let transporter = nodemailer.createTransport({
    host: 'smtp.mailgun.org',
    port: 587,
    secure: false,
    auth: {
      user: 'postmaster@sandbox9d77200fabcf406e8fbc210f83516641.mailgun.org', // generated ethereal user
      pass: '4cecf5c655dab244e587dad197e51c2c-e566273b-15969c4c'
    },
    tls: {
      rejectUnauthorized: false
    }
  });


  let mailOptions = {
    from: 'admin@immentia.com',
    to: user.email,
    subject: 'Verify Your Email',
    text: 'Verify Your Email',
    html: output
  };



  transporter.sendMail(mailOptions, (error, info) => {

    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);

  });
  res.status(200).send({ message: 'Check Mail For Account Confirmation', user });

});


router.post('/verify', async (req, res) => {
  try {
    const token = req.body.secretToken;
    let user = await User.findOne({ secretToken: token });
    if (!user) return res.status(400).json({ message: 'Your Account is not verified!' });
    user.accountStatus = 'active';
    user.isVerified = true
    user.secretToken = '';
    user = await user.save();
    res.status(200).json({ message: 'Your Account is Successfully Verified!' })
    res.send(user);
  } catch (error) {
    res.status(500).send(error)
  }

});

router.post('/login',UsersController.login );

router.put('/updateInfo/:id', auth, upload.single('profileImage'), async (req, res) => {
  const { error } = validateUpdatedUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const salt = await bcrypt.genSalt(10);
  const hashed_password = await bcrypt.hash(req.body.password, salt);
  let result = await User.findOneAndUpdate({ _id: req.params.id },
    {
      name: req.body.name,
      file_name: req.file.originalname,
      file_path: req.file.path,
      password: hashed_password,
    });
  res.status(200).json({ message: 'Updated!', result })
});

router.get('/profile/:email', auth, async (req, res) => {

  let user = await User.findOne({ email: req.params.email });
  res.status(200).send(user);
});
router.get('/hod', auth, async (req, res) => {
  let users = await User.find({ designation: 'faculty' });
  res.status(200).send(users);
});
router.get('/admin', auth, async (req, res) => {
  let users = await User.find({ $or: [{ designation: 'faculty' }, { designation: 'hod' }] });
  res.status(200).send(users);
});
router.get('/find_admin', auth, async (req, res) => {
  let admin = await User.find({ isAdmin: true }).select('email');
  res.status(200).send(admin);
});
module.exports = router;

