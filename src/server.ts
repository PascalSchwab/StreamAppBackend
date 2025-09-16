import {server} from "./app";
import "./config";

const port = 5000;

server.listen(port, function () {
    console.log('Webserver läuft und hört auf Port %d', port);
});