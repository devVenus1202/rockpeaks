import moment from 'moment';

export const getCurrentYear = () => {
  return new Date().getFullYear();
};

export const getCurrentMonth = () => {
  return new Date().getMonth();
};

const beautifyFormat = value => {
  if (!value) {
    return '';
  }
  if (value.toString().length === 1) {
    return `0${value}`;
  }

  return value;
};

export const getDateFromEntity = (entity, type) => {
  if (!entity) {
    return '';
  }
  const { fieldYear, fieldMonth, fieldDay } = entity;
  const year = beautifyFormat(fieldYear);
  const month = beautifyFormat(fieldMonth);
  const day = beautifyFormat(fieldDay);

  if (type) {
    return `${year} ${month}${fieldDay ? '-' : ''}${day}`;
  }
  return `${year}${month}${day}`;
};

export const getFormattedTime = (h, m, s) => {
  let hour = h;
  let minute = m;
  let sec = s;
  if (sec > 60) {
    sec = Math.round(sec / 1000);
    minute = Math.floor(sec / 60);
    sec -= minute * 60;
  }
  if (minute > 60) {
    hour = Math.floor(minute / 60);
    minute -= hour * 60;
  }
  // if (!hour) hour = '';
  // if (!minute) minute = '';
  // if (!sec) sec = '';

  const hourString = `0${hour || '0'}:`.slice(-2);
  const minString = `0${minute || '0'}`.slice(-2);
  const secondString = `0${sec || '0'}`.slice(-2);
  return `${hour ? hourString : ''}${minString}:${secondString}`;
};

export const getDateFromClipNode = ({ fieldYear, fieldMonth, fieldDay }) => {
<<<<<<< HEAD
  const formats = ['MMMM DD YYYY', 'MMMM YYYY', 'YYYY'];
  const date = fieldDay > 0 ? fieldDay : undefined;
  let index = 0;
  !date && index++;
  !fieldMonth && index++;
  const month = fieldMonth > 0 ? fieldMonth - 1 : undefined;
  if (!fieldYear) {
    return '';
  }
  // if (!fieldMonth) {
  //   return fieldYear;
  // }
  return moment()
    .set({
      year: fieldYear,
      month,
      date,
    })
    .format(formats[index]);
=======
  let format = 'YYYY';
  let date = {};
  if (typeof fieldYear === 'undefined' || !fieldYear) {
    return '';
  }

  date.year = fieldYear;
  if (typeof fieldMonth !== 'undefined' && fieldMonth) {
    date.month = fieldMonth - 1;
    format = 'MMMM YYYY';
  }

  if (typeof fieldDay !== 'undefined' && fieldDay) {
    date.date = fieldDay;
    format = 'MMMM DD YYYY';
  }

  return moment().set(date).format(format);
>>>>>>> 84836919dfaa0517f2e8b06b5574d91f1820a1f0
};

export const getMomentFromDate = date => {
  const formats = {
    8: 'YYYYMMDD',
    6: 'YYYYMM',
    4: 'YYYY',
  };

  if (date) {
    const len = date.length;
    if (formats[len] && moment(date, formats[len]).isValid()) {
      return moment(date, formats[len]);
    }
  }

  return null;
};
