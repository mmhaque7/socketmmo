var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

serv.listen(8080);
console.log('server connected');

var SOCKET_LIST = {};
var PLAYER_LIST = {};

var Player = (id) => {
    var self = {
        x: 250,
        y: 250,
        id: id,
        number: "" + Math.floor(10 * Math.random()),
        pressRight: false,
        pressLeft: false,
        pressUp: false,
        pressDown: false,
        maxSpd: 10,


    }
    self.updatePosition = () => {
        if (self.pressRight)
            self.x += self.maxSpd;
        if (self.pressLeft)
            self.x -= self.maxSpd;
        if (self.pressUp)
            self.y -= self.maxSpd;
        if (self.pressDown)
            self.y = self.maxSpd;
    }
    return self;
}

var io = require('socket.io')(serv, {});
io.sockets.on('connection', (socket) => {
    socket.id = Math.random();

    var player = Player(socket.id);
    PLAYER_LIST[socket.id] = player;

    SOCKET_LIST[socket.id] = socket;
    socket.on('disconnect', () => {
        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];
    });

    socket.on('keyPress', (data) => {
        if (data.inputID == 'left')
            player.pressLeft = data.state;
        else if (data.inputID == 'right')
            player.pressRight = data.state;
        else if (data.inputID == 'up')
            player.pressUp = data.state;
        else if (data.inputID == 'down')
            player.pressDown = data.state;

    });





    socket.emit('serverMsg', {
        msg: 'hello',
    });
});

setInterval(() => {
    var pack = [];
    for (var i in PLAYER_LIST) {
        var player = PLAYER_LIST[i];
        player.updatePosition();
        pack.push({
            x: player.x,
            y: player.y,
            number: player.number

        });

    }
    for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('newPosition', pack);
    }


}, 1000 / 25);