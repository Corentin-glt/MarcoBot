module.exports = (city, locale) => {
 const cityDic = locale === 'fr' ? {
    'paris': 'paris',
    'londres': 'london',
    'barcelone': 'barcelona',
    'rome': 'rome'
  } : {
    'paris': 'paris',
    'london': 'london',
    'barcelona': 'barcelona',
    'rome': 'rome'
  };
  return cityDic[city];
};