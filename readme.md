## Intro

Control a [NodeCopter](http://nodecopter.com) using the Wii Fit Balance Board and a Wii Remote.

Wii Fit Balance Board/Wii Remote -> [Osculator](http://www.osculator.net) -> This (node wiicopter.js) -> NodeCopter

[Video of @juliancheal and @sammachin using it](http://telly.com/A56FVW) - including Julian making use of the emergency cut out :)

## Connecting to the Controllers

To get the data from the controllers I've used [Osculator](http://www.osculator.net) for OS X. The file WiiCopter.oscd is a configuration that should work.

## Controlling Your Copter

### Launching

Stand on the board and press the A button once, while holding the Wii Remote level and stationary. The copter will rise to the default start height.

### Controlling

Leaning on the balance board controls forward/backward/left/right (relative to the camera direction).

Rotating the Wii Remote along its long axis controls the rotation of the copter, rotate left to rotate the copter counter-clockwise, and right for clockwise.

The pitch of the Wii Remote raises or lowers the copter. The copter will rise or fall in proportion to the angle of the Wii Remote from the horizontal. Don't point the remote straight up or down as it sometimes seems to go a bit mad and shoots up too fast. Don't make violent movements with the Wii Remote.

Start out by making small movements with the board, and then try making small movements with the Wii Remote before working your way up to more complex maneuvers.

### Emergency Stop

If you need to stop the copter at any point simply jump off the Wii Balance Board: the copter will immediately halt and execute a controlled landing.  You should be able to restart the copter by standing back on the board and pressing A.


## Future Ideas

### Bind the Other Controls on the WiiMote

* Take photos
* Shoot video
* Play light sequences

### Immersive Control System

Get a set of those Sony video glasses and feed the camera from the copter into them, creating a totally immersive control system.

### Use an Oculus Rift Headset as Well

Use an Oculus Rift headset to display the video, but also control the direction that the copter is pointing. So if you look to the side it will do the same. You'd still need the WiiMote for steering the copter as turning your head would only be able to turn you about 180 degrees.

This could be really fun. Get the sync between the head position from the Rift and the rotation of the copter might be tricky, but should be possible.

So who wants to sponsor us to get a Rift when they come out, for a NodeCopter event? :)

## Adapted from:

* https://github.com/levity/svi-balance-board
* http://github.com/catshirt/node-hands
* http://github.com/automata/node-osc