const routes = require('next-routes')();

routes
  .add('/requests/new', '/requests/new-request')
  .add('/requests/:address', '/requests/show')
  .add('/requests/:address/submit', '/requests/new-submission');

module.exports = routes;
