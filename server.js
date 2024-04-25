var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function main() {
  console.log("Création de la base de données");
  // open the database file
  const db = await open({
    filename: 'chat.db',
    driver: sqlite3.Database
  });

  // create our 'messages' table (you can ignore the 'client_offset' column for now)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT);
  `);
}

/**
 * Gestion des requêtes HTTP des utilisateurs en leur renvoyant les fichiers du dossier 'public'
 */
app.use("/", express.static(__dirname + "/public"));
app.get('/hello', (req, res) => {
  res.send('<h1>Hello</h1>');
});

io.on('connection', function (socket) {

  socket.on('disconnect', function () {
    console.log("Un utilisateur s'est déconnecté");

  });


  /**
   * Réception de l'événement 'chat-message' et réémission vers tous les utilisateurs
   */
  socket.on('chat-message', function (message) {
    io.emit('chat-message', message);
    console.log("Message inséré",message,socket.id,socket.nickname);
  });

});



/**
 * Lancement du serveur en écoutant les connexions arrivant sur le port 3003
 */
http.listen(3003, function () {
  console.log('Le serveur écoute sur le port *:3003');
  main();
});