// Import
const jwt = require('jsonwebtoken');
const db = require('../../db.js')

// Queries
const selectUser = db.sql('./src/auth/selectUser.sql')

// Functions
function getToken (request) {
  authToken = request.headers.authorization.split(' ')[1];
  return authToken
}

async function lookupUser (authToken) {
  const clientSecret = process.env.AUTH0SECRET;
  const clientId = process.env.AUTH0CLIENTID;
  const tokenInfo = jwt.verify(authToken, clientSecret, {
    audience: clientId
  });
  const rowList = await db.cx.query(selectUser,
    {
      email: tokenInfo.email
    });
  return rowList.length > 0 ? rowList[0] : null;
}

async function loginPostHandler (request, response) {
  const authToken = request.body.authToken;
  const userRow = await lookupUser(authToken);
  const status = userRow ? 200 : 401;
  response.sendStatus(status)
}

// Export
module.exports = {
  loginPostHandler,
  lookupUser,
  getToken
}
