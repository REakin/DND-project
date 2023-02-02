//requirements
const express = require('express');
const path = require('path');
const tinyDB = require('tinydb');
const bodyParser = require('body-parser');
const cors = require('cors');

//statics variables
var app = express();
var database = new tinyDB('./test.db');

//init middleware
app.use(express.static(path.join(__dirname+'/public')));
app.use(cors())
app.use(bodyParser.urlencoded({ extended:false}))
app.use(bodyParser.json());

//normal functions
function getRandomInt(max){
    return Math.floor(Math.random()*max);
}

function removeCharacterAtIndex(value, index) {
    return value.substring(0, index) + value.substring(index + 1);
  }

//database functions
database.onReady = function (){
    console.log('database operational');
}
function addDB(key, value){
    database.insertItem({key,value}, callback=function(err,k,v){
        if (err){
            console.log(err)
        }
    })
    database.flush()
};

//get requests
app.get('/', function(req, res){
    res.redirect('/test.html');
});

app.get('/quiver',function(req,res){
    if(Object.keys(req.query).length===0){
        res.redirect('/test.html')
    }else{
        res.sendFile("./pages/quiver.html", {root:__dirname})
    }
})

//post requests
app.post('/create', function(req,res){
    //load amount of arrows in quiver
    console.log(req.body.bagType)
    q=""
    if(req.body.bagType=="Sample"){
        q=1234
        q+="0".repeat(req.body.count-4)
    }else if(req.body.bagType=="Custom")
    {
        q+="0".repeat(req.body.normal)
        q+="1".repeat(req.body.thunder)
        q+="2".repeat(req.body.explosive)
        q+="3".repeat(req.body.rope)
        q+="4".repeat(req.body.broken)
    }else{
        for(var i=0; i<= req.body.count; i++){
            q+=String(getRandomInt(5));
        }
    
    } 
    addDB(req.body.name, q)

    database.find({"key":req.body.name}, callback=function(err, value){
        if (err){
            console.log(err)
            return;
        }
        console.log(value[0]._id)
        res.redirect(`/quiver?id=${value[0]._id}`)
    })
});

app.post('/load', function(req,res){
    key = req.body.name
    database.find({"key":key}, callback=function(err, value){
        if (err){
            console.log(err)
            return;
        }
        console.log(value[0]._id)
        res.redirect(`/quiver?id=${value[0]._id}`)
    })
});

app.post('/draw', function(req,res){
    database.findById(req.body.value,function(err,v){
        if(err){
            console.log("Unable to find database entry")
            res.send("empty")
        }else{
        //select a random space from the string and remove it
        let ammo = String(v.value)
        let num = getRandomInt(String(v.value).length)
        res.send(v.value[num]);
        v.value = removeCharacterAtIndex(ammo,num)
        if(v.value.length==0){
            database.findByIdAndRemove(req.body.value)
        }
        database.flush()
        }
    })
});

var server= app.listen(80, function() {
        console.log('Node server is running on port 80');
        console.log(path.join(__dirname+'/public'));
});