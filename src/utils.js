import axios from 'axios';
import TypeError from './errors.js';

export const parseRSS = (xmltext) => {
  const doc = new DOMParser().parseFromString(xmltext, 'application/xml');
  if (doc.querySelector('parsererror')) {
    throw new TypeError('rss', 'Not valid RSS');
  }
  const title = doc.querySelector('title').textContent;
  const description = doc.querySelector('description').textContent;

  const items = [...doc.querySelectorAll('item')].map((item) => {
    const itemTitle = item.querySelector('title').textContent;
    const link = item.querySelector('link').textContent;
    const itemDescription = item.querySelector('description').textContent;
    const guid = item.querySelector('guid').textContent;

    return {
      guid,
      title: itemTitle,
      link,
      description: itemDescription,
    };
  });

  return { title, description, items };
};

export const downloadRSS = (url) => axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${url}`)
  .then((res) => ((console.log(res), res)))
  .then((res) => parseRSS(res.data.contents));
