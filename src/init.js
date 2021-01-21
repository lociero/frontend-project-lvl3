import axios from 'axios';
import onChange from 'on-change';
import * as yup from 'yup';
import 'bootstrap';
// import $ from 'jquery';
import { parseRSS } from './utils.js';

// const yup = !y.object ? y.default : y;
const schema = yup.string().url().required();

const render = (state, elements) => {
  const { input, feeds, posts } = elements;
  const container = document.querySelector('#main_container');
  if (state.feeds.length > 0) {
    container.classList.remove('d-none');
    console.log(state.feeds);
    feeds.innerHTML = '';
    state.feeds.forEach((feed) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'list-group-item-dark');
      const h3 = document.createElement('h3');
      h3.textContent = feed.title;
      const p = document.createElement('p');
      p.textContent = feed.description;
      li.append(h3, p);
      feeds.append(li);
    });

    posts.innerHTML = '';
    state.posts.forEach((post) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'list-group-item-dark');
      const a = document.createElement('a');
      a.textContent = post.title;
      a.setAttribute('href', post.link);
      li.append(a);
      posts.append(li);
    });
  } else {
    container.classList.add('d-none');
  }
  // alert(state.error);
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

  const input = document.querySelector('#url_input');
  const feeds = document.querySelector('#feeds_list');
  const posts = document.querySelector('#posts_list');
  const watchedState = onChange(state, () => render(watchedState, { input, feeds, posts }));

  // https://ru.hexlet.io/lessons.rss
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    schema.validate(input.value)
      .then(() => axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${input.value}`))
      .then((res) => { console.log(res); return res; })
      .then((res) => parseRSS(res.data.contents))
      .then(({ title, description, items }) => {
        watchedState.feeds.push({ title, description });
        watchedState.posts.push(...items);
        watchedState.error = null;
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
