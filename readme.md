## Intro

Control a [NodeCopter](http://nodecopter.com) using the Wii Fit Balance Board and a Wii Remote.

Wii Fit Balance Board/Wii Remote -> [Osculator](http://www.osculator.net) -> This (node wiicopter.js) -> NodeCopter

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

## Adapted from:

* https://github.com/levity/svi-balance-board
* http://github.com/catshirt/node-hands
* http://github.com/automata/node-osc