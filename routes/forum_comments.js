var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');
const _ = require('lodash');
const auth = require('../middleware/auth');
const ForumComments = require('../schemas/forumTopicDiscussion');
const admin = require('../middleware/admin');
//----for validating the meeting creating---//
function validateCommentForum(comment) {

    const schema =
        {
            topic_id: Joi.string().required(),
            commentBy_email: Joi.string().email().required(),
            comment_text: Joi.string().required()
        }
    return Joi.validate(comment, schema);
}
//-----------------------------//

router.post('/comments', auth, async (req, res) => {
    const { error } = validateCommentForum(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let forum_topic_creation = new ForumComments(
        _.pick(req.body, ['topic_id', 'commentBy_email', 'comment_text'])
    );
    forum_topic_creation = await forum_topic_creation.save();
    res.status(200).json({ message: 'Comment Posted!' })

});
router.get('/:id', auth, async (req, res) => {
    let comments = await ForumComments.find({ 'topic_id': req.params.id })
    res.status(200).send(comments);
});


module.exports = router;





