import { get } from 'lodash';

export const isSubArray = (bigArray, smallArray) => {
  return smallArray.every(function(val) {
    return bigArray.indexOf(val) >= 0;
  });
};

export const transformArray = (source, mapping) => {
  const items = [];
  source.forEach(item => {
    const newItem = {};
    mapping.forEach(mappingItem => {
      newItem[mappingItem.target] = get(item, mappingItem.source, '');
    });
    items.push(newItem);
  });
  return items;
};

export const object2Array = (source, key) => {
  const items = [];
  source.forEach(item => {
    items.push(get(item, key, ''));
  });
  return items;
};
