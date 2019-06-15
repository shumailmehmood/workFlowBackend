var express = require('express');
var router = express.Router();
const Joi = require('joi');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const QuestionPaper = require('../schemas/questionPaper');
const multer = require('multer');
const User = require('../schemas/user');
var time = '';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        var date = new Date();
        time = date.getTime();
        cb(null, time + "-" + file.originalname);
    },

});
const upload = multer({ storage: storage });
function validateFile(paper) {
    const schema =
        {
            file_name: Joi.string().required(),
            file_path: Joi.string().required(),
        }
    return Joi.validate(paper, schema);
}

function validateUsers(users) {
    const schema =
        {
            sender_email: Joi.string().required().email(),
            reciever_email: Joi.string().required().email(),
        }
    return Joi.validate(users, schema);
}

router.post('/', auth, upload.single('paper'), async (req, res) => {

    const { file_error } = validateFile(req.file);
    if (file_error) return res.status(400).send(file_error.details[0].message);
    const { error } = validateUsers(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let paper = new QuestionPaper(
        _.pick(req.body, ['sender_email', 'reciever_email']),
    );

    paper['file_path'] = time + "-" + req.file.path;
    paper['file_name'] = req.file.originalname;

    await paper.save();
    res.status(200).json({ message: 'File Uploaded!' });

});
router.get('/email', auth, async (req, res) => {
    let name = await User.findOne({ isAdmin: true }).select('email');
    res.status(200).json(name);
});
router.get('/faculty/:email', auth, async (req, res) => {
    let papers = await QuestionPaper.find({ sender_email: req.params.email });
    res.status(200).json(papers);
});
router.get('/principal/:email', auth, async (req, res) => {
    let papers = await QuestionPaper.find({ $and: [{ reciever_email: req.params.email }, { status: 'pending' }] });
    res.status(200).json(papers);
});
router.put('/change_status/:id/:status', auth, async (req, res) => {
    let paper_status = await QuestionPaper.findByIdAndUpdate({ _id: req.params.id },
        {
            status: req.params.status
        }
    );
    res.status(200).json({ message: 'Status Updated!' });
});




module.exports = router;

