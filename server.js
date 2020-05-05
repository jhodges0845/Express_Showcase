const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const User = require("./models").User;
const Log = require("./models").Log;

//TODO: Move all sensitive information to env variables

// imported Routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var logAppRouter = require('./routes/logApp');


const app = express();

//bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// sessions
app.use(session({
    name: 'sid',
    secret: process.env.WEBSITE_KEY,
    cookie: {
        maxAge: 1000 * 60 * 60 * 2
    },
    store: new FileStore,
    saveUninitialized: false,
    resave: true
}));

// setup session user and flash
app.use((req, res, next) => {
    let message = "";
    if(req.session.message){
        message = JSON.stringify(req.session.message);
        delete req.session.message;
    }//end if 
    if(message){
        res.locals.message = JSON.parse(message);
    }//end if

    res.locals.user = req.session.user;

    console.log(res.locals);
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));

// setup PUG
app.set("view engine", "pug");

//setup static routes
app.use(express.static(path.join(__dirname, 'public')));

// initiate routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/logApp', logAppRouter);

app.listen(process.env.PORT || 5000, () => console.log("listening on port 5000"));


