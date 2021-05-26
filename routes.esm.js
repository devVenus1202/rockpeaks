const routes = require('next-routes')();
const routeConfig = require('./constants/routeConfig');

export const { Link, Router } = routes;

Object.keys(routeConfig).forEach(routeName =>
  routes.add(routeConfig[routeName]),
);

export default routes;
