var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models").User;
var forms = require("../forms/user_forms");

// GET Register
router.get("/register", (req, res)=> {
    let form = new forms.RegisterUserForm();
    res.render("users/register", {form});
});// end route

// POST Register
router.post("/register", (req, res)=> {
    form = new forms.RegisterUserForm();
    form.username.text = req.body.username;
    form.email.text = req.body.email;
    form.password.text = req.body.password;
    form.confirmPassword.text = req.body.confirmPassword;
    if(form.validate_on_submit(form)){
        if(form.password.text === form.confirmPassword.text){
            console.log("form Validated");
            //check if user exists
            User.findOne({
                where:{
                    username: form.username.text
                }
            }).then(user =>{
                if(user){
                    form.username.errors.push("This username is already taken. Please choose another.");
                    res.render("users/register", {form});
                }//end if
            });//end findOne

            //check if email exists
            User.findOne({
                where: {
                    email: form.email.text
                }
            }).then(user => {
                if(user){
                    form.email.errors.push("This email is already taken. Please choose another.");
                    res.render("users/register", {form});
                }//end if
            });//end findOne

            // encrypt password
            bcrypt.genSalt(10, (err, salt) =>{
                if(err){
                    throw err;
                }else{
                    bcrypt.hash(form.password.text, salt, (err, hash) =>{
                        if(err){
                            throw err;
                        }else{
                            //create user
                            User.create({
                                username: form.username.text,
                                email: form.email.text,
                                password: hash
                            }).then(user =>{
                                req.session.message = {
                                    type:"success",
                                    msg: "User has been registered. Please login"
                                }//end message
                                res.redirect("/users/login");
                            });//end create
                        }//end else
                    });// end hash
                }//end else
            });// end getSalt

        }else{
            form.password.errors.push("Password must match confirm password field below");
            res.render("users/register", {form});
        }//end else
    }else{
        res.render("users/register", {form});
    }// end if
});//end route

// GET login
router.get("/login", (req, res, next)=> {
    form = new forms.LoginForm();
    res.render("users/login", {form});
});// end route

// POST login
router.post("/login", (req, res)=> {
    // Check if user already logged in.
    if(req.session.user){
        res.redirect("/");
    }//end if

    // get data from form
    form = new forms.LoginForm();
    form.username.text = req.body.username;
    form.password.text = req.body.password;

    // check if username exists
    User.findOne({
        where: {
            username: form.username.text
        }
    }).then(user => {
        if(user){

            // check if password is correct
            bcrypt.compare(form.password.text, user.password, (err, result) =>{
                if(result){

                    // set user session
                    req.session.user = user;
                    delete req.session.user.password;
                    //TODO: push user to next page if next is available.
                    req.session.message = {
                        type:"success",
                        msg: "Login successful"
                    }//end message
                    res.redirect("/");
                }else{

                    //send errors for bad password
                    form.password.errors.push("Incorrect Password. Please try again");
                    res.render("users/login", {form});
                }//end if
            });//end compare
        }else{

            //send error back to form
            form.username.errors.push("There is no user with this username. If you need an account click the link below.");
            res.render("users/login", {form});
        }// end if
    });// end findOne
});// end route

// GET logout
router.get("/logout", (req, res)=> {
    //check if user is not logged in.
    if(!req.session.user){
        res.redirect("/users/login");
    }//end if

    // remove user from session
    delete req.session.user;
    if(req.session.user){
        req.session.message = {
            type:"danger",
            msg: "Logout failed"
        }//end message
        console.log("There was an issue logging out");
    }else{
        req.session.message = {
            type:"success",
            msg: "Logout successful"
        }//end message
        console.log("Logout Successful!");
    }//end if
    res.redirect("/");
});// end route

// GET Account
router.get("/account", (req, res)=> {
    // check if user is logged in
    if(!req.session.user){
        res.redirect('login');
    }//end if

    //resave udated credentials
    User.findOne({
        where:{
            id: req.session.user.id
        }
    }).then(user =>{
        delete req.session.user;
        req.session.user = user;
        delete req.session.user.password;
        console.log("updated session user");

        // load form for Account Page
        let form = new forms.UserAccountForm();
        form.username.text = req.session.user.username;
        form.email.text = req.session.user.email;

        res.render("users/account", {form});
    }).catch(err =>{
        console.log(err);
    });

    
});// end route

// POST Account
router.post("/account", (req, res)=> {
    // get data from form
    let form = new forms.UserAccountForm();
    form.username.text = req.body.username;
    form.email.text = req.body.email;
    console.log(form);

    //validate form
    if(form.validate_on_submit(form)){

        //get user data from session user.
        User.findOne({
            where:{
                id: req.session.user.id
            }
        }).then(userSession =>{
            if(userSession){
                console.log("found user: "+ userSession.username);
                // validate user
                User.findOne({
                    where:{
                        username: form.username.text
                    }
                }).then(userUsername =>{
                    if(userUsername && userUsername.id != userSession.id){

                        // send error that username is taken.
                        form.username.errors.push("A user with this username is taken. Please try another.");
                        res.render("users/account", {form});
                    }else{

                        // validate email
                        User.findOne({
                            where:{
                                email: form.email.text
                            }
                        }).then(userEmail =>{
                            if(userEmail && userEmail.id != userSession.id){
                                console.log("user email exists");
                                // send errors that email is taken
                                form.email.errors.push("A user with this email is taken. Please try another.");
                                res.render("users/account", {form});
                            }else{

                                // update user info
                                userSession.username = form.username.text;
                                userSession.email = form.email.text;
                                userSession.save();
                                req.session.message = {
                                    type:"success",
                                    msg: "Account Info updated"
                                }//end message
                                console.log("saved user");
                                res.redirect("/users/account");
                                
                            }//end if
                        }).catch(err =>{
                            console.log(err);
                        });//end findOne
                    }//end if
                });
            }else{
                // please login and redirect to login page
                req.session.message = {
                    type:"danger",
                    msg: "You are not currently signed in. Please login and try this again."
                }//end message
                console.log("You are not currently signed in. Please login and try this again.");
                res.redirect("/users/login");
            }//end if
        }).catch(err =>{
            console.log(err);
        });// end findOne
    }else{
        // render page.
        res.render("users/account", {form});
    }//end if

});// end route

module.exports = router;