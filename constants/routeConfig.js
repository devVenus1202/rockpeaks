const _ = require('lodash');

const routeConfig = [
  {
    name: 'Browse Calendar',
    page: 'calendar',
    pattern: '/browse/calendar',
  },
  {
    name: 'browse',
    page: 'browse',
    pattern: '/browse/:type?/:key?',
  },
  {
    /*
    /shows/{letter}/{title}
    /shows/{nid}/{title}
    /shows/{nid}
    /shows/{title}
    */
    name: 'Show',
    page: '/Show',
    pattern: '/shows/:nid/:title?',
  },
  {
    /*
    /video/{nid}/{artist}/{show}/{clipTitle},
    /video/{nid}/{clipTitle},
    /video/{clipTitle}
    /video/{letter}/{clipTitle}
    /video/{letter}/{artist}/{show}/{clipTitle}
    */
    name: 'clip',
    page: '/Clip',
    pattern: '/video/:nid/:artist?/:show?/:clipTitle?',
  },

  {
    /*
    /artists/{letter}/{title}
    /artists/{nid}/{title}
    /artists/{nid}
    /artists/{title}
    */
    name: 'Artist',
    page: '/Artist',
    pattern: '/artists/:nid/:title?',
  },
  {
    /*
    /discs/{letter}/{title}
    /discs/{nid}/{title}
    /discs/{nid}
    /discs/{title}
    */
    name: 'Disc',
    page: '/Disc',
    pattern: '/discs/:nid/:title?',
  },
  {
    name: 'Privacy Policy',
    page: '/privacypolicy',
    pattern: '/privacy-policy',
  },
  {
    name: 'Terms of Use',
    page: '/termsofuse',
    pattern: '/terms-of-use',
  },
  {
    name: 'addclip',
    page: '/AddClip',
    pattern: '/addclip',
  },
  {
    name: 'adddisc',
    page: '/AddDisc',
    pattern: '/adddisc/:playlist?',
  },
  {
    name: 'Profile',
    page: 'profile',
    pattern: '/profile/:name/:uid',
  },
  {
    name: 'Reset',
    page: 'reset',
    pattern: '/user/reset/:uid/:timestamp/:hash',
  },
  {
    name: 'Search',
    page: 'search',
    pattern: '/search/:type/:key',
  },
  {
    name: 'Welcome',
    page: 'welcome',
    pattern: '/welcome',
  },
  {
    name: 'DiscourseSso',
    page: 'discoursesso',
    pattern: '/discourse_sso',
  },
];

module.exports = _.keyBy(routeConfig, 'name');
