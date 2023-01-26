import http from 'http'
import express from 'express'
import mongoose from 'mongoose'
import WebSocket from 'ws'
import mongo from './mongo.js'
import wsConnect from './wsConnect'
import path from "path";

mongo.connect();
const app = express()
if (process.env.NODE_ENV == "production"){
    const __dirname=path.resolve();
    console.log(__dirname);
    app.use(express.static(path.join(__dirname,"../frontend","build")));
    app.get("/*",function(req,res){
        res.sendFile(path.join(__dirname,"../frontend","build","index.html"));
    });
}
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })
const db = mongoose.connection
const PORT = process.env.PORT || 4000;

db.once('open', () => {
    console.log("MongoDB connected!");
    
    wss.on('connection', (ws) => {
        console.log('ws readystate', ws.readyState);
        wsConnect.onMessage(ws,wss);
    });
});
server.listen(PORT, () => {console.log('listening')});