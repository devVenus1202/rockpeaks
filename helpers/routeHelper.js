import { Router } from '@root/routes.esm';
import { getConcatenatedURI } from './urlHelper';

export const handleClickLink = (...values) => event => {
  event.stopPropagation();
  console.log(getConcatenatedURI(...values));
  Router.pushRoute(getConcatenatedURI(...values));
};

export const handleClickLinkRedirect = (...values) => event => {
  event.stopPropagation();
  console.log(getConcatenatedURI(...values));
  window.location.href = getConcatenatedURI(...values);
};

export const handleGotoCalendar = date => event => {
  event.stopPropagation();
  Router.pushRoute(`/browse/calendar?date=${date}`);
};
