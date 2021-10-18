require("dotenv").config();
var express = require('express');
var router = express.Router();
const Parse = require('parse/node');

//javascriptKey is required only if you have it on server.
Parse.initialize(process.env.PARSE_APP_ID, process.env.PARSE_JS_KEY);
Parse.serverURL = process.env.PARSE_SERVER_URL;

/* Create comment */
router.post("/", async (req, res)=>{

    const ignoreList = ["postId", "userId"];
    const Comment = Parse.Object.extend("Comment");
    const Post = Parse.Object.extend("Post");
    const User = new Parse.User();

    let query = new Parse.Query(Post);
    let query2 = new Parse.Query(User);

    const userId = req.body.userId;
    const postId = req.body.postId;
    let post, user;

    try {
        post = await query.get(postId);
        user = await query2.get(userId);

        const comment = new Comment();

        for (let key in req.body)
            if (!ignoreList.includes(key))
                comment.set(key, req.body[key]);

        comment.set("post", post);
        comment.set("user", user);

        comment.save().then((result) => {
            res.status(201).json({response: result})
        }).catch(err => res.status(400).json({message: "ERROR: Could not create comment", post, user, err}))

    }
    catch (e){
        res.status(404).json({message: "fail", e})
    }
})

/* Delete comment */

router.delete("/:id", async(req, res)=>{

    const Comment = Parse.Object.extend("Comment");
    const comment = new Comment();
    comment.id = req.params.id;

    comment.destroy().then((result) =>{
        res.status(200).json(
            {response: "Delete success"}
        );
    }).catch(err => {
        res.send(400).json({message: "ERROR: Could not delete comment", err })
    })

});

router.put("/:id/like", async(req, res) =>{
    const Comment = Parse.Object.extend("Comment");
    const id = req.params.id;
    let query = new Parse.Query(Comment);

    query.get(id).then((comment) =>{
        comment.increment("likes");
        comment.save().then((r)=>{
            res.status(200).json({response: r})
        }).catch(err => res.status(400).json({message: "ERROR: Could not increment comment likes", err}))
    })

})

router.put("/:id/unlike", async(req, res) =>{
    const Comment = Parse.Object.extend("Comment");
    const id = req.params.id;
    let query = new Parse.Query(Comment);

    query.get(id).then((comment) =>{
        comment.decrement("likes");
        comment.save().then((r)=>{
            res.status(200).json({response: r})
        }).catch(err => res.status(400).json({message: "ERROR: Could not decrement post likes", err}));
    })

});

module.exports = router;
