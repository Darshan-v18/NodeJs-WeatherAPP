require('dotenv').config();
const http = require("http");
const fs = require("fs");
const requests = require("requests");
const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
    return temperature;
};

const server = http.createServer((req, res) => {
    if (req.url === "/") {
        requests(`https://api.openweathermap.org/data/2.5/weather?q=Pune&units=metric&appid=${process.env.APPID}`)
            .on('data', (chunk) => {
                const objdata = JSON.parse(chunk);
                const arrData = [objdata];
                const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
                res.write(realTimeData);
            })
            .on('end', (err) => {
                if (err) {
                    console.log('connection closed due to errors', err);
                }
                res.end();
                console.log('end');
            });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(8000, "127.0.0.1");
