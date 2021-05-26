import Router from 'next/router';
import nextCookie from 'next-cookies';
import { now as _now } from 'lodash';
import LOGIN_REQUEST from '@graphql/auth/Login.graphql';
import USERINFO_REQUEST from '@graphql/user/userInfoById.graphql';
import CURRENTUSER_REQUEST from '@graphql/user/currentUserContext.graphql';
import GetJWTToken from '@graphql/auth/GetToken.graphql';

import { getCookie, setCookie, removeCookie } from './session';
import { ThemeProvider } from 'glamorous';

export const USER_TOKEN = 'token';
export const USER_ID = 'user_id';
export const USER_NAME = 'user_name';
export const USER_EMAIL = 'user_email';
export const USER_AVATAR = 'user_avatar';
export const USER_PASSWORD = 'password';
export const TOKEN_AGE = 'token_age';
export const TOKEN_ISSUED_TIME = 'token_issued_at';
export const USER_ROLES = 'user_roles';
export const USER_THEME = 'themeState';
export const FBLINK = 'fbLink';
export const TWITTERLINK = 'twitterLink';
export const THEMESTATE = 'themeState';
export const PROFILELINK = 'profileLink';

export const isValidToken = req => {
  const tokenAge = getCookie(TOKEN_AGE, req);
  const tokenIssuedTime = getCookie(TOKEN_ISSUED_TIME, req);
  return (_now() - tokenIssuedTime) / 1000 <= tokenAge;
};

export const auth = req => {
  const userInfo = {
    [USER_TOKEN]: getCookie(USER_TOKEN, req) || '',
    [USER_ID]: getCookie(USER_ID, req) || '',
    [USER_EMAIL]: getCookie(USER_EMAIL, req) || '',
    [USER_NAME]: decodeURIComponent(getCookie(USER_NAME, req) || ''),
    [USER_AVATAR]: getCookie(USER_AVATAR, req) || '',
    [USER_ROLES]:
      getCookie(USER_ROLES, req) || ''
        ? decodeURIComponent(getCookie(USER_ROLES, req) || '').split(',')
        : [],
    [USER_THEME]: getCookie(USER_THEME, req) || '',
    [FBLINK]: getCookie(FBLINK, req) || '',
    [TWITTERLINK]: getCookie(TWITTERLINK, req) || '',
    [THEMESTATE]: getCookie(THEMESTATE, req) || '',
    [PROFILELINK]: getCookie(PROFILELINK, req) || '',
    password: decodeURIComponent(getCookie('password', req)) || '',
  };
  if (!isValidToken(req)) {
    return {};
  }
  return userInfo;
};

export const clearCookie = async () => {
  removeCookie(USER_TOKEN);
  removeCookie(USER_ID);
  removeCookie(USER_NAME);
  removeCookie(USER_EMAIL);
  removeCookie(USER_AVATAR);
  removeCookie(TOKEN_ISSUED_TIME);
  removeCookie(THEMESTATE);
  removeCookie(FBLINK);
  removeCookie(TWITTERLINK);
  removeCookie(PROFILELINK);
  removeCookie(FBLINK);
  removeCookie(USER_ROLES);
};

export const setUserCookie = async ({ key, uid, name, tokenAge, roles }) => {
  setCookie(USER_TOKEN, key);
  setCookie(USER_ID, uid);
  setCookie(USER_NAME, name);
  setCookie(TOKEN_AGE, tokenAge); // tokenAge
  setCookie(TOKEN_ISSUED_TIME, _now());
  setCookie(USER_AVATAR, '../../public/static/images/default-avatar.jpg');
  setCookie(USER_THEME, 'dark');
  setCookie(USER_ROLES, roles.join(','));
};

export const isLoggedIn = req => {
  const token = getCookie(USER_TOKEN, req);
  return !!token;
};

export const getUserAvatar = async (client, uid) => {
  try {
    const userData = await client.query({
      query: USERINFO_REQUEST,
      variables: {
        uid: String(uid),
      },
    });

    const {
      data: {
        userById: {
          name,
          mail,
          rpCustomerProfiles: { entity },
        },
      },
    } = userData;

    setCookie(USER_EMAIL, mail);
    setCookie(USER_NAME, name);
    if (entity) {
      const {
        avatarImage,
        themeSelectionState,
        fbProfileLink,
        twitterProfileLink,
        // rp_user_public_profile_link: userPublicProfileLink,
      } = entity;
      setCookie(USER_AVATAR, avatarImage.url);
      setCookie(USER_THEME, themeSelectionState);
      setCookie(FBLINK, fbProfileLink ? fbProfileLink.uri : '');
      setCookie(TWITTERLINK, twitterProfileLink ? twitterProfileLink.uri : '');
      // setCookie(PROFILELINK, userPublicProfileLink);
    }

    // setCookie('user_header', headerImage.url);
  } catch (err) {
    console.log(err);
  }
  return auth();
};

export const getJwtToken = async client => {
  const { data } = await client.query({
    query: GetJWTToken,
  });
  const { getJwtToken: tokenData } = data;
  if (tokenData) {
    const { token, uid } = tokenData;
    setCookie(USER_TOKEN, token);
    setCookie(USER_ID, uid);
    setCookie(TOKEN_ISSUED_TIME, _now());
  }
  return tokenData;
};

export const logout = () => {
  clearCookie();
  localStorage.removeItem('access_token');
};

export const isLogout = () => {
  return getCookie('is_logout');
};

export const isClearCookie = () => {
  return !getCookie(USER_TOKEN) && !getCookie('is_logout');
};
/**
  loginHandler
 */
export const login = async (client, username, password) => {
  try {
    const data = await client.query({
      query: LOGIN_REQUEST,
      variables: {
        username,
        password,
      },
    });
    const {
      data: {
        login: { error },
      },
    } = data;

    if (error !== 'null') {
      return { error, userInfo: null };
    }
    const {
      data: {
        login: {
          key,
          account,
          expire_at: expireAt,
          issued_at: issuedAt,
          roles,
        },
      },
    } = data;

    clearCookie();
    const {
      uid,
      name,
      mail,
      rpCustomerProfiles: { entity: profile },
    } = account;
    const {
      avatarImage,
      themeSelectionState,
      fbProfileLink,
      twitterProfileLink,
    } = profile;

    setCookie(USER_ID, uid);
    setCookie(USER_NAME, name);
    setCookie(USER_EMAIL, mail);
    setCookie(USER_TOKEN, key);
    setCookie(USER_ROLES, roles.join(','));
    if (profile) {
      setCookie(
        USER_AVATAR,
        avatarImage
          ? avatarImage.url
          : '../../public/static/images/default-avatar.jpg',
      );
      setCookie(USER_THEME, themeSelectionState);
      setCookie(FBLINK, fbProfileLink ? fbProfileLink.uri : '');
      setCookie(TWITTERLINK, twitterProfileLink ? twitterProfileLink.uri : '');
    }
    setCookie(USER_PASSWORD, password);
    setCookie(TOKEN_AGE, expireAt - issuedAt); // tokenAge
    setCookie(TOKEN_ISSUED_TIME, _now());
    localStorage.setItem('access_token', key);
    // // temp

    return { error: null, userInfo: { uid, uname: name } };
  } catch (error) {
    return { error: 'Login is failed. Please try again!', userInfo: null };
  }
};

export const isExpiredToken = () => {
  const issuedAt = Number(getCookie('issued_at'));
  const maxAge = Number(getCookie('token_max_age'));
  const currentAge = (_now() - issuedAt) / 1000;
  return currentAge > maxAge;
};
