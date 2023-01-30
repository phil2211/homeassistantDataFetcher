const axios = require('axios');
const { MongoClient } = require("mongodb");

const config = {
    method: 'get',
    url: 'http://homeassistant.local:8123/api/states',
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjMmEyODU1YmJjMGM0OWY4OTkyNzY4ZjNiYjRjYzk0NiIsImlhdCI6MTY3NDgzMzc4NywiZXhwIjoxOTkwMTkzNzg3fQ.qIK9N7vTJZNZ-rHmDS3xqrf-h_Gz4LQf9J5ro82RTdU" 
    }
}

const uri = "mongodb+srv://admin:Passw0rd@homeassistant.2i6urhw.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
    try {
        while (true) {
            const resp = await axios(config);
            resp.data = resp.data.map((item) => {
                return (
                    { ...item, "last_changed": new Date(item.last_changed), "last_updated": new Date(item.last_updated) }
                )});
            console.log(resp.data.length);
            const database = client.db('homeassistant');
            const sensordata = database.collection('sensordata');
            await sensordata.insertMany(resp.data);
            await sleep(10000);
        }
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}


run().catch(console.dir);
