const server = require('http').createServer();
const io = require('socket.io')(server, {
  cors: { 
    origin: "*", // Autorise les connexions depuis ton mobile, simulateur ou navigateur
    methods: ["GET", "POST"]
  }
});

// Structure en mémoire pour stocker l'historique des tracés par salon
// Format attendu : { "salon-id-123": [ { path: "...", color: "...", strokeWidth: 4 }, ... ] }
const roomCanvasStates = {};

io.on('connection', (socket) => {
  console.log(`Connexion établie — ID : ${socket.id}`);

  // 1. Un utilisateur rejoint un salon spécifique
  socket.on('join-room', (roomId) => {
    // Le socket s'abonne au canal spécifique de cette pièce
    socket.join(roomId);
    console.log(`L'utilisateur [${socket.id}] a intégré le salon : ${roomId}`);

    // Si le salon n'existe pas encore dans notre mémoire locale, on l'initialise
    if (!roomCanvasStates[roomId]) {
      roomCanvasStates[roomId] = [];
    }

    // On envoie immédiatement l'historique des tracés existants à cet utilisateur précis
    socket.emit('init-canvas', roomCanvasStates[roomId]);
  });

  // Réception et retransmission d'un nouveau tracé complet
  socket.on('send-line', ({ room, line }) => {
    // On sauvegarde la ligne dans l'historique de la pièce correspondante
    if (roomCanvasStates[room]) {
      roomCanvasStates[room].push(line);
    }

    // On diffuse la ligne à TOUS les utilisateurs de la pièce, SAUF à celui qui vient de la dessiner
    socket.to(room).emit('receive-line', line);
  });

  // Réinitialisation complète du canvas d'une pièce
  socket.on('clear-canvas', (roomId) => {
    if (roomCanvasStates[roomId]) {
      roomCanvasStates[roomId] = []; // On vide l'historique de ce salon
    }
    // On ordonne à tous les utilisateurs présents dans ce salon de vider leur écran
    io.to(roomId).emit('canvas-cleared');
    console.log(`Le salon [${roomId}] a été réinitialisé.`);
  });

  // Gestion de la déconnexion d'un utilisateur
  socket.on('disconnect', () => {
    console.log(`Utilisateur déconnecté — ID : ${socket.id}`);
  });
});

// Démarrage du serveur sur le port 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`=== Serveur de Dessin Collaboratif Actif sur le port ${PORT} ===`);
});