const routes = module.exports = require('next-routes')();
const { Link, Router } = module.exports = routes;
const routeConfig = require('./constants/routeConfig');

Object.keys(routeConfig).forEach(routeName =>
  routes.add(routeConfig[routeName]),
);
