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
// import en from './locales/en.js';
import ru from './locales/ru.js';

// const yup = !y.object ? y.default : y;
const schema = yup.string().url().required();

i18next.init({
  lng: 'ru',
  // debug: true,
  resources: {
    ru,
  },
});

const errors = {
  url: i18next.t('errors.url'), // Ссылка должна быть валидным URL
  required: i18next.t('errors.required'), // Не должно быть пустым
  rss: i18next.t('errors.rss'), // Ресурс не содержит валидный RSS
  sameUrl: i18next.t('errors.sameUrl'), // RSS уже существует
  network: i18next.t('errors.network'), // Ошибка сети
};

const text = {
  posts: i18next.t('content.posts'),
  feeds: i18next.t('content.feeds'),
  example: i18next.t('content.example'),
  add: i18next.t('navigation.add'),
  preview: i18next.t('navigation.preview'), // Просмотр
  success: i18next.t('info.success'), // RSS успешно загружен

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

export default async () => {
  const state = {
    urls: [],
    feeds: [],
    posts: [],
    error: null,
    isSuccess: null,
    modal: { title: '', content: '', link: '#' },
    readIds: new Set(),
    text,
  };
  const elements = {
    input: document.querySelector('#url_input'),
    infoText: document.querySelector('#info_text'),
    successText: document.querySelector('#success_text'),
    feeds: document.querySelector('#feeds_list'),
    posts: document.querySelector('#posts_list'),
    feedsTitle: document.querySelector('#feeds_title'),
    postsTitle: document.querySelector('#posts_title'),
    addButton: document.querySelector('#add_button'),
    exampleText: document.querySelector('#example_text'),

    modalTitle: document.querySelector('#modal_title'),
    modalContent: document.querySelector('#modal_body'),
    modalLink: document.querySelector('#modal_link'),
  };

  const watchedState = onChange(state, () => render(watchedState, elements));

  // https://ru.hexlet.io/lessons.rss
  // http://lorem-rss.herokuapp.com/feed
  const form = document.querySelector('#main_form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    schema.validate(elements.input.value)
      .then(() => {
        if (watchedState.urls.includes(elements.input.value)) {
          throw new TypeError('sameUrl', 'url exists');
        }
        return downloadRSS(elements.input.value);
      })
      .then(({ title, description, items }) => {
        watchedState.feeds.push({ title, description, url: elements.input.value });
        watchedState.posts.push(...items);
        watchedState.urls.push(elements.input.value);
        watchedState.error = null;
        watchedState.isSuccess = true;
      })
      .catch((err) => {
        console.error(err);
        const type = err.type ?? 'network';
        watchedState.error = { type, message: errors[type] };
        watchedState.isSuccess = false;
      });
  });

  render(watchedState, elements);
  updatePosts(watchedState);
};
