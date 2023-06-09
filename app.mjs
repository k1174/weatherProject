import express from 'express'
import https from 'https'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import bodyParser from 'body-parser'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {

    // const dir = __dirname()
    const filePath = path.join(__dirname, 'index.html')
    // console.log(dirname)
    res.sendFile(filePath, "index.html")
})

app.post('/', (req, res) => {
    // let city = req.body.city
    // res.send(city)
    // console.log("city : "+ req.body.cityName)

    const apiKey = "c80678b211cb909886280868d90b25a6"
    const unit = "metric"
    const city = req.body.cityName


    const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=' + unit + '&appid=' + apiKey

    https.get(url, (response) => {
        let responseData = '';

        response.on('data', (chunk) => {
            responseData += chunk;
        });

        response.on('end', () => {
            try {
                const weatherData = JSON.parse(responseData);

                if (weatherData.cod === '404') {
                    // Handle city not found error
                    res.status(404).send('City not found');
                    return;
                }

                const weather = weatherData.main.temp;
                const iconId = weatherData.weather[0].icon;
                const iconUrl = `https://openweathermap.org/img/wn/${iconId}@2x.png`;

                // Send weather data as response to the client
                res.write(`<h1>Server is up and running.</h1>`);
                res.write(`<h2>Weather of ${city} is ${weather}</h2>`);
                res.write(`<img src=${iconUrl}>`);
                res.send();
            } catch (error) {
                // Handle error parsing weather data
                console.error('Error parsing weather data:', error);
                res.status(500).send('Unable to fetch weather data');
            }
        });
    }).on('error', (error) => {
        // Handle error fetching weather data from the API
        console.error('Error fetching weather data:', error);
        res.status(500).send('Unable to fetch weather data');
    });

})



app.listen(3000, () => {
    console.log(`server is running on port ${port}`)
})
