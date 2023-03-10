const axios = require('axios');
const { MongoClient } = require("mongodb");
const _ = require('lodash');

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

const entities = [
    "sensor.solarinverter_active_power_load_sys",
    "sensor.solarinverter_active_power_off_grid_total",
    "sensor.solarinverter_active_power_pcc_total",
    "sensor.solarinverter_pv_power_1",
    "sensor.solarinverter_pv_power_2",
    "sensor.solarinverter_pv_power_total",
    "sensor.solarinverter_battery_capacity_1",
    "sensor.solarinverter_battery_state_of_health_1",
    "sensor.solarinverter_battery_temperature_1",
    "sensor.solarinverter_battery_current_1",
    "sensor.solarinverter_battery_power_1",
    "sensor.solarinverter_battery_power_total",
];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
    try {
        while (true) {
            const resp = await axios(config);
            _.remove(resp.data, (item) => !entities.includes(item.entity_id));
            resp.data = resp.data.map((item) => {
                return (
                    { 
                        "entity_id": item.entity_id,
                        "attributes": item.attributes,
                        "last_changed": new Date(item.last_changed),
                        "last_updated": new Date(item.last_updated),
                        "state": parseFloat(item.state),
                        "created_at": new Date(),
                    }
                )});
            console.log(resp.data.length);
            const database = client.db('homeassistant');
            const sensordata = database.collection('powerdata');
            //console.log(JSON.stringify(resp.data, null, 2));
            await sensordata.insertMany(resp.data);
            await sleep(10000);
        }
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}


run().catch(console.dir);
