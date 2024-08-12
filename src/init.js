import _ from 'lodash';
import * as yup from 'yup';
import onChange from 'on-change';
import render from './view';
import i18next from 'i18next';
import resources from './locales/index.js';

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
  
    const urlSchema = yup.string().url().required();
  
    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(e.target);
      const url = data.get('url');
  
      urlSchema.validate(url)
        .then(() => {
          state.isValid = true;
          state.error = '';
        })
        .catch(err => {
          console.log(err.message);
          state.error = err.message;
          state.isValid = false;
        })
      }
    )  
  })
}
