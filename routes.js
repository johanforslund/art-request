const routes = require('next-routes')();

routes
  .add('/requests/new', '/requests/new')
  .add('/requests/:address', '/requests/show');

module.exports = routes;
