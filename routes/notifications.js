var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const MeetingTopicDistribution = require('../schemas/meetingTopicDistribution');
const MeetingTopic = require('../schemas/meetingTopic');

router.get('/notifications/:email', auth, async (req, res) => {
    let notifications = await MeetingTopicDistribution.find({ reciever_email: req.params.email }).sort({ _id: -1 }).limit(10);
    let notifications_count = await MeetingTopicDistribution.find({ $and: [{ reciever_email: req.params.email }, { status: false }] }).count();
    res.status(200).json({ notifications: notifications, count: notifications_count });
});
router.get('/topic/:id', auth, async (req, res) => {

    let topic = await MeetingTopic.findById({ _id: req.params.id });
    res.status(200).send(topic);
})
router.put('/viewed/:id', auth, async (req, res) => {
    let viewed = await MeetingTopicDistribution.findOneAndUpdate({ _id: req.params.id }
        , {
            status: true
        });
});


module.exports = router;





