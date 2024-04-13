const admin = require("firebase-admin");

const serviceAccount = require("");
{
  /* include the path of the private key file after adding it in the config file */
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
