require("dotenv").config();
var express = require('express');
var router = express.Router();
const Parse = require('parse/node');

//javascriptKey is required only if you have it on server.
Parse.initialize(process.env.PARSE_APP_ID, process.env.PARSE_JS_KEY);
Parse.serverURL = process.env.PARSE_SERVER_URL;


/* GET post by id. */
router.get('/:id', async (req, res, next) => {
    const id = req.params.id;

    const Post = Parse.Object.extend("Post");

    const query = new Parse.Query(Post);
    query.equalTo("objectId", id);
    query.include("user");


    await query.find().then((post) =>{
        res.status(200).json({response: post});
    }).catch(err =>{
        res.status(400).json({message: "ERROR: Retrieving post failed.", err})
    })
});

/* GET comments by post id */
router.get("/:id/comments", async (req, res) =>{
    const id = req.params.id;

    const Comment = Parse.Object.extend("Comment");
    const Post = Parse.Object.extend("Post")

    //const innerQuery = new Parse.Query(Post);
    //innerQuery.equalTo("objectId", id);
    const post = new Post();
    post.id = id;

    const query = new Parse.Query(Comment);
    //query.matchesQuery("post", innerQuery);
    query.equalTo("post", post);
    query.include("user");

    await query.find().then((comments) =>{
        res.status(200).json({response: comments});
    }).catch(err =>{
        res.status(400).json({message: "ERROR: Retrieving comments failed.", err})
    })
});

/* POST blog post detials */
router.post("/", async (req, res) =>{
    const Post = Parse.Object.extend("Post");
    const newPost = new Post();

    const user = new Parse.User();
    user.id = req.body.userId;

    newPost.set("title",req.body.title);
    newPost.set("contents", req.body.content);
    newPost.set("likes", 0);
    newPost.set("tags", req.body.tags);
    newPost.set("showComments", req.body.showComments);
    newPost.set("user", user);

    newPost.save().then((post) => {
        res.status(201).json({response : { postId: post.id } } );
    }).catch((err) => {
        res.status(400).json({message: "ERROR: New post creation failure.", err});
    })
});

/* Update blog details*/
router.put("/", async(req, res)=>{
    const Post = Parse.Object.extend("Post");
    const acceptableUpdates = ['content', 'tags', 'showComments', 'title'];
    const post = new Post();
    post.id = req.body.id;

    for(let key in req.body){
        if(acceptableUpdates.includes(key))
            post.set(key, req.body[key]);
    }

    post.save().then((result) =>{
        res.status(200).json({response: result});
    }).catch( err => res.status(400).json({message: "ERROR: Post update failed.", err}))
});

router.put("/:id/like", async(req, res) =>{
    const Post = Parse.Object.extend("Post");
    const id = req.params.id;
    let query = new Parse.Query(Post);

    query.get(id).then((post) =>{
        post.increment("likes");
        post.save().then((r)=>{
            res.status(200).json({response: r})
        }).catch(err => res.status(400).json({message: "ERROR: Could not increment post likes", err}))
    })

})

router.put("/:id/unlike", async(req, res) =>{
    const Post = Parse.Object.extend("Post");
    const id = req.params.id;
    let query = new Parse.Query(Post);

    query.get(id).then((post) =>{
        post.decrement("likes");
        post.save().then((r)=>{
            res.status(200).json({response: r})
        }).catch(err => res.status(400).json({message: "ERROR: Could not decrement post likes", err}));
    })

})


module.exports = router;