export async function defineName(lang, name) {
  if (lang === 'en') {
    return name + '_en';
  } else if (lang === 'ru') {
    return  name + '_ru';
  } else if (lang === 'ua') {
    return  name + '_ua';
  }
}