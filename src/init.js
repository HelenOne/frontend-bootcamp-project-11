import _ from 'lodash';
import * as yup from 'yup';
import onChange from 'on-change';
import render from './view';
import i18next from 'i18next';
import resources from './locales/index.js';
import axios from 'axios';
import parse from './parser.js';

const addProxy = (url) => {
  const urlWithProxy = new URL('/get', 'https://allorigins.hexlet.app');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', 'true');
  return urlWithProxy.toString();
}

const downloadRss = (url) => {
  const urlWithProxy = addProxy(url);
  axios.get(urlWithProxy)
    .then((response) => {
      console.log('response', response.data.contents);
      const posts = parse(response.data.contents);
    })
    .catch(error => console.log(error))
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
    }

    const initState = {
      url: '',
      error: '',
      isValid: true,
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
          downloadRss(url)
        })
        .catch(err => {
          state.error = err.message;
          state.isValid = false;
        })
      }
    )  
  })
}
