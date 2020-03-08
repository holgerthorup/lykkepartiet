// Import
const lookupUser = require('../db/user/lookupUser');
const createUser = require('../db/user/createUser');
const parseAuthToken = require('../logic/parseAuthToken');
const namespace = 'https://app.lykkepartiet.dk/'

//Functions
async function loginPostHandler(request, response) {
  const authToken = request.params.authToken;
  let tokenInfo = await parseAuthToken(authToken);

  /* auth0 stopped providing user_metadata by default, so the information is added by a custom rule */
  tokenInfo = {...tokenInfo, user_metadata: tokenInfo[namespace + 'user_metadata']}

  if (tokenInfo) {
    const knownUser = await lookupUser(tokenInfo);
    const userCreated = new Date(tokenInfo.created_at)
    const verified = tokenInfo.email_verified
    if (verified) {
      if (!knownUser) {
        const newUser = await createUser(tokenInfo);
        const user = await lookupUser(tokenInfo);
        response.send({ user: user, exp: tokenInfo.exp });
      } else {
        response.send({ user: knownUser, exp: tokenInfo.exp });
      }
    } else {
      response.sendStatus(403);
    }
  } else {
    response.sendStatus(401);
  }
}

// Export
module.exports = loginPostHandler;
