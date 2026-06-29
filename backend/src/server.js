const server = require('http').createServer();
const io = require('socket.io')(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// INITIALISATION FIREBASE ADMIN
const admin = require('firebase-admin');
const serviceAccount = require("./config/serviceAccountKey.json"); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

io.on('connection', (socket) => {
  console.log(`Connexion : ${socket.id}`);

  // 1. Rejoindre un salon et charger l'historique depuis Firestore 
  socket.on('join-room', async (roomId) => {
    socket.join(roomId);
    
    try {
      // chercher l'historique des lignes directement dans la base de données
      const roomRef = db.collection('rooms').doc(roomId).collection('lines');
      const snapshot = await roomRef.orderBy('createdAt', 'asc').get();
      
      const existingLines = [];
      snapshot.forEach(doc => {
        existingLines.push(doc.data());
      });

      // On envoie le vrai historique persistant à l'utilisateur
      socket.emit('init-canvas', existingLines);
    } catch (error) {
      console.error("Erreur lors du chargement Firestore :", error);
    }
  });

  // Pour le mouvement fluide (inchangé, reste en mémoire tampon réseau)
  socket.on('draw-cursor-start', ({ room, line }) => {
    socket.to(room).emit('receive-cursor-start', line);
  });
  socket.on('draw-cursor-move', ({ room, path }) => {
    socket.to(room).emit('receive-cursor-move', path);
  });

  // 2. Fin du tracé : Sauvegarde dans Firestore 
  socket.on('send-line', async ({ room, line }) => {
    socket.to(room).emit('receive-line', line);

    try {
      // Ajout de la ligne dans la sous-collection du salon correspondant
      await db.collection('rooms').doc(room).collection('lines').add({
        ...line,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la ligne :", error);
    }
  });

  // 3. Effacer le canvas dans Firestore 
  socket.on('clear-canvas', async (roomId) => {
    io.to(roomId).emit('canvas-cleared');

    try {
      // Supprimer tous les documents de la sous-collection 'lines'
      const linesRef = db.collection('rooms').doc(roomId).collection('lines');
      const snapshot = await linesRef.get();
      
      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      
      console.log(`Firestore : Salon [${roomId}] réinitialisé.`);
    } catch (error) {
      console.error("Erreur lors du clear Firestore :", error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Déconnexion : ${socket.id}`);
  });
});

server.listen(3000, () => console.log('Serveur persistant actif sur le port 3000'));