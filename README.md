# csgo-mapvote
csgo-mapvote is a tool to reach a consensus on a CS:GO map pool while playing with friends.

## work in progress
The project is still in development, there are some missing functionalities (see issues).

## installation
The tool relies on node.js and sqlite3.
Navigate into the main directory and run ```npm i``` to install node dependencies.
Use `npm run dev` to start a development server.

For a production environment use once `sqlite3 mapvotes.db` to create the database file and `npm run setupDB` to create the required tables.
Afterwards start the  server with `npm start`.

## contributing
We're happy about contributions. Feel free to fix bugs via PR. New features should be discussed in "Issues" with "enhancement" label.

## demo
You can find a live demo at [https://mapvote.error401.de](https://mapvote.error401.de)

![screenshot](https://github.com/error401de/csgo-mapvote/blob/master/docu/screenshot.png?raw=true)
