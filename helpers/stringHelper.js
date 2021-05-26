export const summerize = (str, count) => {
  if (str) {
    if (str.length > count) {
      return str.substr(0, count) + '...';
    }
    return str;
  }
  return '';
};

export const decodeHtmlSpecialChars = string => {
  if (!string) return '';
  // Our finalized string will start out as a copy of the initial string.
  const specialchars = [['"', '&quot;'], ['>', '&gt;'], ['<', '&lt;'], ['&', '&amp;'], ["'", '&#039;']];
  let unescapedString = string;

  // For each of the special characters,
  const len = specialchars.length;
  for (let x = 0; x < len; x++) {
    // Replace all instances of the entity with the special character.
    unescapedString = unescapedString.replace(new RegExp(specialchars[x][1], 'g'), specialchars[x][0]);
  }

  // Return the unescaped string.
  return unescapedString;
};

export const unescapeString = string => {
  return str.replace(/&#(\d+);/g, function(match, dec) {
    return String.fromCharCode(dec);
  });
}
