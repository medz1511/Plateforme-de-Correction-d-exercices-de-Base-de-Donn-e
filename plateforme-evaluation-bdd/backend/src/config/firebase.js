const admin = require("firebase-admin");

// Charger la clé privée Firebase
const serviceAccount = require("./firebaseServiceAccount.json"); // 🔥 Chemin vers ta clé JSON

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "nbcmultiservices-9db9b.appspot.com", // Remplace par le nom de ton bucket
});

const bucket = admin.storage().bucket();

module.exports = bucket;
