import axios from 'axios';
import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';
import 'bootstrap';
// import $ from 'jquery';
import render from './view.js';
import { parseRSS } from './utils.js';
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

export default () => {
  const state = {
    urls: [],
    feeds: [],
    posts: [],
    error: null,
  };

  const input = document.querySelector('#url_input');
  const errorText = document.querySelector('#error_text');
  const feeds = document.querySelector('#feeds_list');
  const posts = document.querySelector('#posts_list');
  const watchedState = onChange(state, () => render(watchedState, {
    input, errorText, feeds, posts,
  }));

  // https://ru.hexlet.io/lessons.rss
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    schema.validate(input.value)
      .then(() => {
        if (watchedState.urls.includes(input.value)) {
          throw new TypeError('sameUrl', 'url exists');
        }
        return axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${input.value}`);
      })
      .then((res) => { console.log(res); return res; })
      .then((res) => parseRSS(res.data.contents))
      .then(({ title, description, items }) => {
        watchedState.feeds.push({ title, description });
        watchedState.posts.push(...items);
        watchedState.urls.push(input.value);
        watchedState.error = null;
      })
      .catch((err) => {
        const type = err.type ?? 'network';
        watchedState.error = { type, message: errors[type] };
        console.log(watchedState.error);
      });
  });

  // .then((parsed) => {
  //   console.log(parsed.firstChild.tagName);
  // });
  // console.log($('#modal').modal);
  // $('#modal').on('show.bs.modal', (event) => {
  //   const button = $(event.relatedTarget);
  //   const description = button.data('description');
  //   $('.modal-body div').html(description);
  // });
};
