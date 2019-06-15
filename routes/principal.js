var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');
const _ = require('lodash');
const auth = require('../middleware/auth');
const MeetingTopic = require('../schemas/meetingTopic');
const MeetingTopicDistribution = require('../schemas/meetingTopicDistribution');
const admin = require('../middleware/admin');
const User = require('../schemas/user');

function validateUser(user) {
    const schema =
        {

            designation: Joi.string().required(),
            salary: Joi.string().required(),
            timeIn: Joi.string().required(),
            timeOut: Joi.string().required(),
        }
    return Joi.validate(user, schema);
}
router.get('/all_members', [auth, admin], async (req, res) => {
    let members = await User.find({ $or: [{ designation: 'hod' }, { designation: 'faculty' }] });
    res.status(200).json(members);
});
router.get('/member/:id', [auth, admin], async (req, res) => {
    let member = await User.findById({ _id: req.params.id });
    res.status(200).json(member);
});

router.delete('/removeUser/:id', [auth, admin], async (req, res) => {
    let user = await User.findOneAndRemove({ _id: req.params.id });
    if (user) return res.status(200).json({ message: 'User Removed!', user })
});


router.put('/update/:id/:accStatus', [auth, admin], async (req, res) => {
    let result = await User.findOneAndUpdate({ _id: req.params.id },
        {
            accountStatus: req.params.accStatus
        });
    res.status(200).json({ message: 'Account Status Updated!', result })
});

router.put('/updateInfo/:id', [auth, admin], async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let result = await User.findOneAndUpdate({ _id: req.params.id },
        {
            designation: req.body.designation,
            timeOut: req.body.timeOut,
            timeIn: req.body.timeIn,
            salary: req.body.salary,

        });
    res.status(200).json({ message: 'Account Status Updated!', result })
});




module.exports = router;





