import {server} from "./app.ts";
import "./config.ts";

const port = 5000;

server.listen(port, function () {
    console.log('Webserver läuft und hört auf Port %d', port);
});