/*global io*/
var socket = io("http://163.172.211.49:3003", { autoConnect: false });

// Fonction pour générer une couleur aléatoire
function generateRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

$("#btConnect").on("click", function () {
  var username = $("#loginName").val();
  console.log("socket", socket);
  socket.data = { username: username };
  socket.connect();
  socket.emit('send-nickname', username);
});

/**
 * Envoi d'un message
 */
$('#chat form').submit(function (e) {
  e.preventDefault();

  var messageText = $('#m').val();

  if (messageText.trim().length === 0) {
    $('#m').val('');
    $('#chat input').focus();
    return;
  }

  var storedColor = localStorage.getItem('userColor_' + socket.data.username);
  var color = storedColor || generateRandomColor();

  var message = {
    text: messageText,
    username: socket.data.username,
    timestamp: new Date().toISOString(),
    color: color
  };

  $('#m').val('');
  socket.emit('chat-message', message);
  $('#chat input').focus();

  // Sauvegarde de la couleur associée à l'utilisateur dans localStorage
  localStorage.setItem('userColor_' + socket.data.username, color);
});

/**
 * Réception d'un message
 */
socket.on('chat-message', function (message) {
  var formattedTime = new Date(message.timestamp).toLocaleTimeString();
  var messageDisplay = `<span style="color:${message.color}">${formattedTime} - ${message.username}: ${message.text}</span>`;
  $('#messages').append($('<li>').html(messageDisplay));
});
