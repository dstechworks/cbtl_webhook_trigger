const express = require('express');
const bodyParser = require('body-parser');
const querystring = require('querystring');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Constants
const PORT = 3013;
const TOKEN_ENDPOINT = 'http://209.38.120.187/api/authorize/access_token';
const API_URL = 'http://209.38.120.187/api';

const CLIENT_ID = '8ee1bb19428bb0fc03a7563092ab2f1aa6807374';
const CLIENT_SECRET = '17c3685b4baffabca7fdbd94656bda5741ffc3a3c3ea316549086ad77baf6d5f7de0fe92b21f9344cb4ca476ae472246f76c46c59c7542d696b95c9e12dfcf9bd6c7774e935e9fa9f09dae598ed5d2ee626969231a5f6582fa79338507929ff1f487b72d05e2730d705d415298c5819de6dbd3f02e1041f6a776c05963288a';

let accessToken;


async function getAccessToken(clientData) {
    try {
        const requestBody = {
            grant_type: 'client_credentials',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET
        };

        const response = await axios.post(TOKEN_ENDPOINT, querystring.stringify(requestBody), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        accessToken = response.data.access_token;
        console.log('Access token received !!');
        if (clientData) {
            await sendDataToServer(clientData);
        }

        return accessToken;

    } catch (error) {
        console.error('Error fetching access token:', error.message);
    }
}

async function getApiData() {
    const batchSize = 10;
    let offset = 0;
    const results = [];
    const token = await getAccessToken();
    const headers = {
        Authorization: `Bearer ${token}`
    };

    try {
        while (true) {
            const { data } = await axios.get(`${API_URL}/display?start=${offset}`, { headers });
            if (data.length === 0) break;

            results.push(...data);
            offset += batchSize;
            console.log(`Offset updated to :: ${offset}`);
        }
        console.log(`Total Items Fetched :: ${results.length}`);
        let obj = [];
        results.map((d) => { obj.push({ "displayId": d.displayId, "display": d.display, "description": d.description }) });
        return obj;
    } catch (error) {
        console.error(`Error fetching :`, error.message);
        throw error;
    }
}

// Function to send data to server
async function sendDataToServer(clientData) {
    try {
        fs.writeFile(path.join(__dirname, 'name.txt'), `${clientData?.text}`, 'utf8', (err) => {

            if (err) {
                console.error('Error saving name:', err);
            }
        });

        if (clientData?.displayId) {
            await triggerWebhook(clientData?.displayId, clientData?.description);
        }
    } catch (error) {
        console.error('Error sending data:', error.message);
    }
}

// Function to trigger webhook
async function triggerWebhook(displayId, description) {
    try {
        const url = `${API_URL}/displaygroup/${displayId}/action/triggerWebhook`;

        console.log('Triggering webhook code:', description);

        const response = await axios.post(url, querystring.stringify({
            triggerCode: description
        }), {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        console.log('Webhook triggered. Status:', response.status);
    } catch (error) {
        console.error('Error triggering webhook:', error.message);
    }
}

// Route
app.post('/triggerServerWebhook', (req, res) => {
    console.log('Received webhook trigger request:', req.body);
    getAccessToken(req.body);
    res.send('Webhook Triggered !!');
});

app.get('/getBirthdayName', (req, res) => {
    fs.readFile(path.join(__dirname, 'name.txt'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading name:', err);
            return res.status(500).send('Failed to read name.');
        }
        console.log('Name read successfully.');
        res.send({ name: data });
    });
});

app.get('/getListOfDisplay', async (req, res) => {
    let getListOfData = await getApiData();
    res.send({ data: getListOfData });
})

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
