const debugLib = require('debug');

const debug = debugLib('rp:debug:anayltics');

export const gaTrackingId = process.env.GA_TRACKING_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = url => {
  debug('pageview', url);
  window.gtag('config', gaTrackingId, {
    page_path: url,
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
  debug('event', action);
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
};
