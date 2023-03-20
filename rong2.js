const app = require("express")();
const http = require("http").createServer(app);
const { Server } = require("socket.io")

const { createClient } = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter');

const io = new Server(http,{
    path:"/dalongdemo",
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});

app.get("/", (req, res) => res.sendFile(__dirname + "/index2.html"));

io.on("connection", function (socket) {
    console.log("socket connecte");
    io.emit("user connected");
    socket.on("message", function (msg) {
        io.emit("message", msg);
    });
});

const pubClient = createClient({ host: 'localhost', port: 5002, password: 'dalong' });
const subClient = pubClient.duplicate();
Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
    io.adapter(createAdapter(pubClient, subClient));
    http.listen(3001, () => console.log("listening on http://localhost:3001"))
});