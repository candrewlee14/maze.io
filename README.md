# Maze.io

## About:
A MMO maze game where players go head-to-head to solve mazes as fast as possible.

## Setup:
### To run server:
In the terminal, enter `cd server` then `npm run start`.
### To run client:
In the terminal, enter `cd client` then `npm run server`.
Go to localhost at port 8080 in the browser.
Multiple clients can be connected to the server.

## Features
+ Node Server runs that handles new connections with new players and generates mazes
+ Client sees graphics drawn with P5.js in Vue framework
+ Client sees themselves and other players  

## Future Features:
### Definite:
+ Clients can type names (with profanity check)

### Possible:
+ Clients can make accounts, which keeps track of stats and can purchase skins
+ Rooms are made and joined so multiple mazes are happening at the same time

## Dependencies:
### Front End:
+ P5 as a Vue object - https://github.com/Kinrany/vue-p5
+ Vue for front-end framework - https://vuejs.org/v2/guide/
  
### Server Side:
+ Socket<span>.io</span> for fast server-client communication - https://socket.io/
+ Express for running Node.js server - https://expressjs.com/
+ UUID for getting GUIDs for new clients - https://www.npmjs.com/package/uuid
+ Nodemon for hot reload - https://nodemon.io/
  
### Potential Future Dependencies
+ IO Redis - https://www.npmjs.com/package/ioredis
+ Name Profanity Filter - https://www.npmjs.com/package/bad-words

## References:
+ P5.js docs - https://p5js.org/reference/

  
## Author(s): 
Andrew Lee