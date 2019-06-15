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
//----for validating the meeting creating---//
function validateCreateMeeting(meeting) {

    const schema =
        {
            topic: Joi.string().required(),
            discussion_points: Joi.string().required(),
            timming: Joi.string().required(),
            sender_email: Joi.string().required(),
            reciever_email: Joi.array().required(),
        }
    return Joi.validate(meeting, schema);
}
//-----------------------------//

router.post('/create_meeting', auth, async (req, res) => {

    const { error } = validateCreateMeeting(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let meeting_topic_creation = new MeetingTopic(
        _.pick(req.body, ['topic', 'discussion_points', 'timming'])
    );

    meeting_topic_creation = await meeting_topic_creation.save();

    let meeting_id = meeting_topic_creation._id;

    for (var i = 0; i < req.body.reciever_email.length; i++) {
        let sender_email = req.body.sender_email;
        let name = await User.findOne({ email: sender_email }).select('name');
        var meeting_distribution = new MeetingTopicDistribution(
            {
                sender_email: sender_email,
                reciever_email: req.body.reciever_email[i],
                description: name.name + " Creates a Meeting"
            }
        );

        meeting_distribution.topic_id = meeting_id;
        meeting_distribution = await meeting_distribution.save();
    }

    res.status(200).json({ message: 'Meeting Created!' })

});



module.exports = router;





