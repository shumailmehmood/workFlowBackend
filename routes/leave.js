var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');
const _ = require('lodash');
const auth = require('../middleware/auth');
const Leave = require('../schemas/Leave');
const admin = require('../middleware/admin');
//----for validating the meeting creating---//
function validateCreateLeave(leave) {

    const schema =
        {
            reason: Joi.string().required(),
            sender_email: Joi.string().email().required(),
            reciever_email: Joi.string().email().required(),
            from: Joi.string().required(),
            to: Joi.string().required(),
        }
    return Joi.validate(leave, schema);
}
//-----------------------------//

router.post('/leave', auth, async (req, res) => {

    const { error } = validateCreateLeave(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let leave = new Leave(
        _.pick(req.body, ['reason', 'sender_email', 'reciever_email', 'from', 'to'])
    );
    leave = await leave.save();
    res.status(200).json({ message: 'Leave Posted!' })

});


router.get('/principal/:email', auth, async (req, res) => {
    let leaves = await Leave.find({ $and: [{ status: 'pending' }, { reciever_email: req.params.email }] })
    res.status(200).send(leaves);
});
router.get('/faculty_hod/:email', auth, async (req, res) => {
    let leaves = await Leave.find({ sender_email: req.params.email })
    res.status(200).send(leaves);
});
router.put('/change_status/:id/:status', auth, async (req, res) => {
    let approve_disapprove = await Leave.findOneAndUpdate({ _id: req.params.id }
        , {
            status: req.params.status
        });
    res.json({ message: 'updated!' })
});
module.exports = router;





