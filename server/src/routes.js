// Import
const candidate = require('./api/candidate');
const candidateSupport = require('./api/candidateSupport');
const onboarding = require('./api/onboarding');
const decleration = require('./api/decleration');
const notificationSettings = require('./api/notificationSettings');
const auth = require('./api/auth');
const vote = require('./api/vote');
const preference = require('./api/preference');
const project = require('./api/project');
const subscription = require('./api/subscription');
const appData = require('./api/appData');
const seen = require('./api/notification');
const projectSupport = require('./api/projectSupport');
const formidable = require('express-formidable');

// Routes
function map(app) {
  const form = app.use(formidable());
  // GET
  app.get('/api/auth/:authToken', auth);
  app.get('/api/appDataBundle', appData);

  // POST
  form.post('/api/candidate', candidate);
  app.post('/api/candidate/:id/support', candidateSupport);
  app.post('/api/proposal/:id/vote', vote);
  app.post('/api/proposal/:id/subscription', subscription);
  app.post('/api/project/:id/edit', project);
  app.post('/api/project/:id/support', projectSupport);
  app.post('/api/preference', preference);
  app.post('/api/user/onboarding/:type', onboarding);
  app.post('/api/user/decleration', decleration);
  app.post('/api/user/notificationSettings', notificationSettings);
  app.post('/api/seen/', seen);
}

// Export
module.exports = {
  map
};
