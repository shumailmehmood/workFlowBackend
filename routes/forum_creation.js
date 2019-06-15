var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');
const _ = require('lodash');
const auth = require('../middleware/auth');
const ForumTopic = require('../schemas/forumTopic');
const admin = require('../middleware/admin');
const User = require('../schemas/user');
//----for validating the meeting creating---//
function validateCreateForum(forum) {

    const schema =
        {
            topic: Joi.string().required(),
            creater_email: Joi.string().email().required(),
        }
    return Joi.validate(forum, schema);
}
//-----------------------------//

router.post('/create_forum', auth, async (req, res) => {
    const { error } = validateCreateForum(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let forum_topic_creation = new ForumTopic(
        _.pick(req.body, ['topic', 'creater_email'])
    );
    forum_topic_creation = await forum_topic_creation.save();
    res.status(200).json({ message: 'Forum Created!' })

});
router.get('/', auth, async (req, res) => {
    let forums = await ForumTopic.find({})
    res.status(200).send(forums);
});
router.get('/:email', auth, async (req, res) => {
    let user_name = await User.findOne({ email: req.params.email }).select('name')
    res.status(200).send(user_name);
});

module.exports = router;





