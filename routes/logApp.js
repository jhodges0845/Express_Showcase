var express = require('express');
var router = express.Router();
const User = require("../models").User;
const Log = require("../models").Log;
var forms = require("../forms/logApp_forms");

// GET logApp
router.get('/', (req, res, next) =>{
	let page=1;
	let pageSize=4;
	if(res.locals.message){
		req.session.message = res.locals.message;
	}//end if
	res.redirect(`/logApp/logs/${page}`);
	
});//end route

router.get("/logs/:pageNum", (req, res)=>{
	//setup for pagination
	let page=req.params.pageNum;
	let pageSize=4;
	let offset = page * pageSize;
	let limit= pageSize;
	

	// pull data using pagination
	Log.findAndCountAll({
		include: [User],
		order:[['createdAt', 'DESC']],
		limit,
		offset
	}).then(logs =>{
		let paginate = {
			page,
			pageSize,
			count: logs.count
		};
		console.log(logs);
		res.render("logApp/logs", {logs: logs.rows, paginate});
	}).catch(err => {
		console.log(err);
	});//end findAndCountAll
});//end route

// GET Create log
router.get("/add", (req, res, next) =>{
	// check for session user
	if(!req.session.user){
		res.redirect("/logApp");
	}//end if

	form = new forms.CreateLogForm();
	res.render("logApp/add", {form});
});//end route

// POST Create log
router.post("/add", (req, res, next) =>{
	form = new forms.CreateLogForm();
	form.comment.text = req.body.comment;
	form.location.text = req.body.location;
	// create log
	Log.create({
		comment: form.comment.text,
		location: form.location.text,
		UserId: req.session.user.id
	}).then(log =>{
		req.session.message = {
			type:"success",
			msg: "Your log has been created."
		}//end message
		console.log("Check here");
		res.redirect("/logApp");
	}).catch(err =>{
		console.log(err);
	});// end create
});//end route

// GET Update log
router.get("/update/:logId", (req, res)=> {
	console.log(req.params.logId);
	// check if session user exists
	if(req.session.user){

		// check if log belongs to user
		Log.findOne({
			where:{
				id: req.params.logId,
				UserId: req.session.user.id
			}
		}).then(log =>{
			if(log){

				// load form
				let logId = req.params.logId;
				console.log("logId: "+ logId);
				form = new forms.UpdateLogForm();
				form.comment.text = log.comment;
				form.location.text = log.location;
				res.render("logApp/update", {form, logId});
			}else{
				req.session.message = {
					type:"danger",
					msg: "No log was found. Either there was no log with this id or this user does not have permission to update this log."
				}//end message
				console.log("No log was found. Either there was no log with this id or this user does not have permission to update this log.");
				res.redirect("/logApp");
			}//end if
		}).catch(err =>{
			console.log(err);
		});//end findOne
	}else{
		req.session.message = {
			type:"danger",
			msg: "no active user. Please login"
		}//end message
		console.log("no active user. Please login");
		res.redirect("/users/login");
	}//end if

});//end route

// POST Update log
router.post("/update/:logId",(req, res) =>{

	// check if session user exists
	if(req.session.user){

		// check if user has permissions to access log
		Log.findOne({
			where:{
				UserId: req.session.user.id,
				id: req.params.logId
			}
		}).then(log =>{
			if(log){
				
				// get data from req
				let form = new forms.UpdateLogForm();
				form.location.text = req.body.location;
				form.comment.text = req.body.comment;

				//validate form
				if(form.validate_on_submit(form)){

					// save changes to log
					log.comment = form.comment.text;
					log.location = form.location.text;
					console.log(log.comment);
					log.save();

					// redirect to logApp page
					req.session.message = {
						type:"success",
						msg: "Updated log successfully"
					}//end message
					res.redirect("/logApp");
				}else{
					req.session.message = {
						type:"danger",
						msg: "failed validation"
					}//end message
					console.log("failed validation");
					res.redirect("/logApp/update/"+ req.params.logId);
				}//end if
			}else{
				req.session.message = {
					type:"danger",
					msg: "no log found"
				}//end message
				console.log("no log found");
				res.redirect("/logApp/update/"+ req.params.logId);
			}//end if

		}).catch(err => {
			console.log(err);
		});//end findOne

	}else{
		req.session.message = {
			type:"danger",
			msg: "You are currently not logged in. Please log in and try again."
		}//end message
		console.log("You are currently not logged in. Please log in and try again.");
		res.redirect("/logApp");
	}//end if

});//end route

// GET Delete log
router.post("/delete/:logId", (req, res)=> {
	console.log("will delete log: " + req.params.logId);
	// check to see if your 
	if(req.session.user){

		// check if user had permissions to delete this log
		// delete log
		Log.destroy({
			where: {
				id: req.params.logId,
				UserId: req.session.user.id
			}
		}).then(count =>{
			req.session.message = {
				type:"success",
				msg: "Deleted "+ count + " items"
			}//end message
			console.log("Deleted "+ count + " items");
			res.redirect("/logApp");
			
		}).catch(err =>{
			console.log(err);
		});//end findOne
	}else{
		req.session.message = {
			type:"danger",
			msg: "You are not logged in. Please login and try again."
		}//end message
		console.log("You are not logged in. Please login and try again.");
		res.redirect("/users/login");
	}//end if
	
});//end route

module.exports = router;