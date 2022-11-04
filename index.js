'use strict'

const express = require('express'); 
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('dotenv').config();

// Database connection
const uri = "mongodb+srv://"+process.env.MONGO_USER+":"+process.env.MONGO_PASSWORD+"@operationadmin.dfghccc.mongodb.net/"+process.env.MONGO_DB_NAME+"?retryWrites=true&w=majority";

mongoose.connect(uri,
    { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('Connected to database'))
.catch(e => console.log('error db:', e))


var cors = require('cors');
const cors_option = {
	origin: true,
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true,
	exposedHeaders: ["x-auth-token"]
};

var app = express();
let router = express.Router();

app.use(cors(cors_option));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));


let api_route = "/api";
let v1 = require('./v1/index.js');
v1(app, router , api_route+"/v1");


app.get('/',(req,res)=>res.send("<h2>It Works!</h2>"));    

const port = process.env.PORT || 3005;

app.listen(port, () => {
	console.log("server running in port " + port);
});
