const express=require('express');
const app=express();

app.use(express.json());

require('dotenv').config();
PORT=process.env.PORT;

const PersonRoutes = require('./routes/person');
app.use('/api/Person',PersonRoutes)

app.listen(PORT , err => {
    err ? console.log('fail to connect'):
    console.log(`server running at ${PORT}`)
})
 



const connectDB=require("./config/ConnectDB.JS");
connectDB();