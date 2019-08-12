const express = require('express');
const app = express();

app.get('/',(req,res)=>{
    res.send('Hello!!');
});


app.get('/api/getuser',(req,res)=>{
    res.send("Vincent");
})

app.listen(3000,()=>{
    console.log('Listen to port 3000...');
});


//Set Header Check (async)
app.use(function (req,res,next){
    var api_key = req.key('API-KEY');

    if(api_key !=    "test"    ){
        res.status(401).send({error: "Unauthorized"});
    }
    else{
        next();
    }
});
