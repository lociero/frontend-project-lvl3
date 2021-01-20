import axios from 'axios';
import onChange from 'on-change';
import * as yup from 'yup';
import 'bootstrap';
// import $ from 'jquery';
import { parseRSS } from './utils.js';

// const yup = !y.object ? y.default : y;
const schema = yup.string().url().required();

const render = (state) => {

};

const errors = {
  url: 'Invalid URL',
  required: 'Empty URL input',
  rss: 'Invalid RSS data',
  network: 'Network error',
};

export default () => {
  const state = {
    feeds: [],
    posts: [],
    error: null,
  };

  const watchedState = onChange(state, () => render(watchedState));

  // https://ru.hexlet.io/lessons.rss
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.querySelector('#url_input');
    schema.validate(input.value)
      .then(() => axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${input.value}`))
      .then((res) => { console.log(res); return res; })
      .then((res) => parseRSS(res.data.contents))
      .then(({ title, description, items }) => {
        watchedState.feeds.push({ title, description });
        watchedState.posts.push(...items);
      })
      .catch((err) => {
        const type = err.type ?? 'network';
        watchedState.error = errors[type];
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
