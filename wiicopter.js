var connect = require('connect'),
  fs = require('fs'),
  jspack = require('./lib/node-jspack/jspack').jspack,
  express = require('express'),
  osc = require('./lib/osc');

var client;

// Prepare listening socket for the OSC data
var dgram = require('dgram');
osc_serv = dgram.createSocket('udp4');


// State global for the control data
var state = {sum: 0, 
             x: 0.5,
             y: 0.5,
             go: true,
             a: false,
             b: false,
             pitch: 0.5,
             roll: 0.5};

// Track the state of the copter.
// Obviously this only tracks the state we *think* 
// the copter is in, it doesn't take into account crashes.
var flying = false;

// Utility function to round control values to N decimal places.
function smooth(val, dp) {
  m = Math.pow(10, dp);
  return Math.round(val * m)/m;
}

function launch_copter() {
  // Start up drone client
  client = arDrone.createClient();
  client.disableEmergency();
  client.takeoff();
  flying = true;
}


// var allowedOrigins = "http://local.digital.travelex.net:4500";
// var io = require('socket.io').listen(2323, {origins: allowedOrigins});
// io.on('connection', function(client){});

var app = require('http').createServer(),
    io = require('socket.io').listen(app);
var sockets;
io.sockets.on('connection', function(socket) {
    sockets = socket;
});
app.listen(2323);

// var iii= 100;
// setInterval(function () {
//     io.sockets.send(iii);
//     console.log(iii);
//     iii++;
// },100);

var weight = 0;
var amountToSend=0;
var multiplyLeft=1;
var multiplyRight=1;

function run_cmds(s) {
    console.log(amountToSend);

    io.sockets.send(amountToSend);

    if (s.y > 0.6) {
        amountToSend += 1000;
        return
    }
    if (s.y < 0.4) {
        amountToSend -= 1000;
        return
    }
    if (s.x < 0.4) {
        amountToSend = amountToSend + 10 * multiplyLeft;
        multiplyLeft++;
        return
    } else if (s.x > 0.6) {
        // console.log(2)

        amountToSend = amountToSend - 10 *multiplyRight;
        multiplyRight++;
        return
    }
    if(s.x = 0.5){
        multiplyLeft=1;
        multiplyRight=1;
    }
    if (smooth(s.sum, 2) * 100 * 0.9 > weight || smooth(s.sum, 2) * 100 * 1.1 < weight) {
        amountToSend = smooth(s.sum, 2) * 100;
    }
    weight = smooth(s.sum, 2) * 100;




    // console.log(s);

}

// Event handler for the data received from the Wii via OSCulator
var buffer = 0;
osc_serv.on('message', function (msg, a) {
  buffer++;
  if (buffer === 10){
    buffer = 0;
      var val = osc.decode(msg);
      // console.log('Data',val);

      // The first item in the val array is the device
      // e.g "/wii/2/balance" is the balance board
      // The remaining data is the variables from the controller.
      field = val[0];
      controller = field.split("/").pop(); // Which controller?

      switch(controller) {
          case 'balance':
              // Get the X/Y postion of the CoG on the Balance Board
              state.x = smooth(val[6], 1);
              state.y = smooth(val[7], 1);

              // Get the "sum" value for the balance board
              state.sum = val[5];
              if (state.sum < 0.2)
              // There's nobody on the board, so stop the copter
                  state.go = false;
              else
                  state.go = true;
              break;
          case 'A':
              if (val[1] == 1)
                  state.a = true;
              else
                  state.a = false;
              break;
          case 'B':
              if (val[1] == 1)
                  state.b = true;
              else
                  state.b = false;
              break;
          case 'pry':
              // This is the accelerometer data from the WiiMote
              state.pitch = smooth(val[1], 1);
              state.roll  = smooth(val[2], 1);
              break;
      }

      // Having updated the state we send the relevant commands
      // to the copter.
      run_cmds(state);
  }
});

// listen for incoming messages from Osculator client
// be sure to set port and IP address to where your
// Osculator client routes OSC messages.
binding = osc_serv.bind(9000, '127.0.0.1');