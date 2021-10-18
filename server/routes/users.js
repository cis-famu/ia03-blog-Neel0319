require("dotenv").config();
var express = require('express');
const Parse = require("parse/node");
var router = express.Router();

//javascriptKey is required only if you have it on server.
Parse.initialize(process.env.PARSE_APP_ID, process.env.PARSE_JS_KEY);
Parse.serverURL = process.env.PARSE_SERVER_URL;


router.get("/:user/posts", async (req, res, next) =>{
  const id = req.params.user;

  const Post = Parse.Object.extend("Post");
  const user = new Parse.User();
  user.id = id;
  const query = new Parse.Query(Post);
  query.equalTo("user", user);
  query.include("user");
  await query.find().then((posts) => {
        res.status(200).json({response: posts} )
      }
  ).catch(err => {
    res.status(400).json({message: "ERROR: Retrieving posts failed.", err})
  })
})
module.exports = router;
