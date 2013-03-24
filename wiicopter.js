var connect = require('connect'),
  fs = require('fs'),
  socketIO = require('socket.io'),
  jspack = require('./lib/node-jspack/jspack').jspack,
  express = require('express'),
  osc = require('./lib/osc');

var arDrone = require('ar-drone');
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

function run_cmds(s) {
  console.log(s);

  if (s.a) {
    // Press the A button to take off.
    launch_copter();
  } else if (s.b) {
    // Press the B (trigger) button to do a flip
    client.animate('flipAhead', 1500);
  } else if (!s.fly && flying) {
    // Emergency cut out.
    // Stop the copter and land it.
    client.stop();
    client.land();
    flying = false;
  } else {
    // Just grab the control data and send commands
    // Data from the Wii is 0 to 1 with 0.5 being neutral position
    // We subtract 0.5 to make it work for the nodecopter.
    // Note that this approach also reduces the sensitivity, making
    // the copter a bit slower but easier to fly.
    // We could easily map directy on a 1 for 1 scale, but would probably
    // make it quite twitchy.
    client.clockwise(s.roll - 0.5);
    client.front(s.y - 0.5);
    client.right(s.x - 0.5);
    client.up(s.pitch - 0.5);
  }
}

// Event handler for the data received from the Wii via OSCulator
osc_serv.on('message', function (msg, a) {
  var val = osc.decode(msg);
  
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
})

// listen for incoming messages from Osculator client
// be sure to set port and IP address to where your
// Osculator client routes OSC messages.
binding = osc_serv.bind(9000, '127.0.0.1');