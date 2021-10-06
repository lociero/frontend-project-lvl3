/* eslint-disable no-param-reassign */
import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';
import _ from 'lodash';
import 'bootstrap';
// import $ from 'jquery';
import render from './view.js';
import { downloadRSS } from './utils.js';
import TypeError from './errors.js';
import en from './locales/en.js';

// const yup = !y.object ? y.default : y;
const schema = yup.string().url().required();

i18next.init({
  lng: 'en',
  debug: true,
  resources: {
    en,
  },
});

const errors = {
  url: i18next.t('errors.url'),
  required: i18next.t('errors.required'),
  rss: i18next.t('errors.rss'),
  sameUrl: i18next.t('errors.sameUrl'),
  network: i18next.t('errors.network'),
};

const updatePosts = (watchedState, timeout = 5000) => {
  const rssChanges = watchedState.urls.map((url) => downloadRSS(url)
    .then(({ items: newPosts }) => {
      const updatedPosts = _.unionBy(watchedState.posts, newPosts, 'guid');
      watchedState.posts = updatedPosts;
      watchedState.error = null;
    })
    .catch((err) => {
      const type = err.type ?? 'network';
      watchedState.error = { type, message: errors[type] };
    }));
  Promise.allSettled(rssChanges).then(() => setTimeout(() => updatePosts(watchedState), timeout));
};

export default () => {
  const state = {
    urls: [],
    feeds: [],
    posts: [],
    error: null,
    modal: { title: '', content: '', link: '#' },
    readIds: new Set(),
  };

  const input = document.querySelector('#url_input');
  const errorText = document.querySelector('#error_text');
  const feeds = document.querySelector('#feeds_list');
  const posts = document.querySelector('#posts_list');

  const modalTitle = document.querySelector('#modal_title');
  const modalContent = document.querySelector('#modal_body');
  const modalLink = document.querySelector('#modal_link');

  const watchedState = onChange(state, () => render(watchedState, {
    input, errorText, feeds, posts, modalTitle, modalContent, modalLink,
  }));

  // https://ru.hexlet.io/lessons.rss
  // http://lorem-rss.herokuapp.com/feed
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    schema.validate(input.value)
      .then(() => {
        if (watchedState.urls.includes(input.value)) {
          throw new TypeError('sameUrl', 'url exists');
        }
        return downloadRSS(input.value);
      })
      .then(({ title, description, items }) => {
        watchedState.feeds.push({ title, description, url: input.value });
        watchedState.posts.push(...items);
        watchedState.urls.push(input.value);
        watchedState.error = null;
      })
      .catch((err) => {
        console.error(err);
        const type = err.type ?? 'network';
        watchedState.error = { type, message: errors[type] };
      });
  });

  updatePosts(watchedState);
};
