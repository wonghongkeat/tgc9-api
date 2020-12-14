// EXPRESS AND OTHER SETUP
const express = require('express');
const {setupExpressApp} = require('./setupExpress');
const {setupHBS} = require('./setupHBS');
const MongoUtil = require('./MongoUtil.js');


// allows us to inject into the environment (the OS) our environmental variabkes
require('dotenv').config();

// create the app
const app = express();
setupExpressApp(app);
setupHBS();

async function main() {
    const MONGO_URL=process.env.MONGO_URL;
    await MongoUtil.connect(MONGO_URL, "tgc9_fault_reporting");

    const faultRoutes = require('./routes/faultRoutes');
    app.use('/faults', faultRoutes);

}

main();

// LISTEN
app.listen(3000, ()=>{
    console.log("Express is running")
})