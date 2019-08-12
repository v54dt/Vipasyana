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