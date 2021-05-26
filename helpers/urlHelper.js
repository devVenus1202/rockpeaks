export const concatURL = url => {
  return url
    .trim()
    .toLowerCase()
    .replace(/\ /g, '-');
};

export const getConcatenatedURI = (...values) => {
  let resultURI = '';

  values.map(value => {
    resultURI = resultURI.concat('/' + concatURL(value ? value.toString() : ''));
  });

  return resultURI;
};

export const getProfileLink = (name, id) => {
  const uname = name.replace(/ /g, '-');
  const url = `/profile/${uname.toLowerCase()}/${id}`;
  return url;
};

export const getCalendarLink = date => {
  return `/browse/calendar?date=${date}`;
};
