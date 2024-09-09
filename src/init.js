import _ from 'lodash';
import * as yup from 'yup';
import onChange from 'on-change';
import render from './view';
import i18next from 'i18next';
import resources from './locales/index.js';
import axios from 'axios';
import parse from './parser.js';
import uniqueId from 'lodash/uniqueId.js';


const addProxy = (url) => {
  const urlWithProxy = new URL('/get', 'https://allorigins.hexlet.app');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', 'true');
  return urlWithProxy.toString();
}

const downloadRss = (url, state) => {
  const urlWithProxy = addProxy(url);
  return axios.get(urlWithProxy)
    .then((response) => {
      const parsedData = parse(response.data.contents);
      const feed = {
        url,
        id: uniqueId(),
        title: parsedData.feedTitle,
        description: parsedData.feedDescription,
      }
      state.feeds.unshift(feed);

      const posts = parsedData.posts.map((post) => ({ ...post, id: uniqueId() }));
      state.posts.unshift(...posts)
    })
}

export default () => {
  const i18n = i18next.createInstance();
  i18n.init({
    lng: 'ru',
    debug: false,
    resources,
  }).then(() => {

    const elements = {
      form: document.querySelector('.rss-form'),
      input: document.querySelector('.rss-form input'),
      feedback: document.querySelector('p.feedback'),
      feedsContainer: document.querySelector('.feeds'),
      postsContainer: document.querySelector('.posts'),  
    }

    const initState = {
      url: '',
      error: '',
      isValid: true,
      feeds: [],
      posts: [],
    };

    const state = onChange(initState, render(elements, initState, i18n));

    yup.setLocale({
      string: {
        url: 'validationError',
        required: 'required',
      },
    });

    const urlSchema = yup.string().url().required();

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(e.target);
      const url = data.get('url');

      urlSchema.validate(url)
        .then(() => {
          state.isValid = true;
          state.error = '';
          return downloadRss(url, state)
        })
        .catch(err => {
          console.log('ghhh', err)
          state.error = err.message;
          state.isValid = false;
        })
      }
    )  
  })
}
