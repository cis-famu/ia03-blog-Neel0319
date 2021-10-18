require("dotenv").config();
var express = require('express');
var router = express.Router();
const Parse = require('parse/node');

//javascriptKey is required only if you have it on server.
Parse.initialize(process.env.PARSE_APP_ID, process.env.PARSE_JS_KEY);
Parse.serverURL = process.env.PARSE_SERVER_URL;

router.post("/login", async (req, res) =>{

    const username = req.body.username;
    const password = req.body.password;

    await Parse.User.logIn(username, password).then(
        (user) => {
            res.status(200).json({response: user});
        }
    ).catch(err => {
        res.status(400).json({message: "ERROR: Log In failure.", err});
    })

});

router.get("/logout", async (req, res) =>{


    await Parse.User.logOut().then(
        () => {
            res.status(200).json({response: "Logged out"})
        }
    ).catch(err => {
        res.status(400).json({message: "ERROR: Log In failure.", err});
    })

});


module.exports = router;