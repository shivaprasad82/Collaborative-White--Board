var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

server.listen(port, function () {
  //console.log('Server listening at port %d', port);
});

Array.prototype.remove = function (value) {
  var index = this.indexOf(value);
  this.splice(index, 1);
};

var wbHistory = function () {
  this._stack = [];
  this._queue = [];
};

wbHistory.prototype = {
  get: function () {
    return this._stack;
  },
  add: function (data) {
    this._stack.push(data);
    if (this._queue.length > 0) {
      this._queue = [];
    }
  },
  undo: function () {
    if (this._stack.length == 0) {
      return;
    }
    this._queue.push(this._stack.pop());
  },
  redo: function () {
    if (this._queue.length == 0) {
      return;
    }
    this._stack.push(this._queue.pop());
  },
};

var Room = function (name) {
  this.name = name;
  this.users = [];
  this.chatHistory = [];
  this.wbHistory = new wbHistory();
  this.images = [];
};

Room.prototype = {
  getUsers: function () {
    return this.users;
  },
  addUser: function (userName) {
    this.users.push(userName);
  },
  removeUser: function (userName) {
    this.users.remove(userName);
  },
};

var createRoom = function (roomName) {
  var room = new Room(roomName);
  rooms[room.name] = room;
  return room;
};

var rooms = {};

io.sockets.on("connection", function (socket) {
  if (Object.keys(rooms).length == 0) {
    createRoom("Room 1");
  }
  socket.emit("show_rooms", rooms);

  socket.on("add_user", function (userName, roomName) {
    roomName = roomName || "Room 1";
    socket.username = userName;
    socket.room = roomName;

    var currentRoom = rooms[roomName] || createRoom(roomName);
    currentRoom.addUser(userName);
    socket.join(roomName);
  });
});
