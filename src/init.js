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

const downloadRss = (url, state) => {
  state.loadingStatus = 'loading'; 
  const urlWithProxy = addProxy(url);
  return axios.get(urlWithProxy)
    .then((response) => {
      const parsedData = parse(response.data.contents);
      const feed = {
        url,
        id: _.uniqueId(),
        title: parsedData.feedTitle,
        description: parsedData.feedDescription,
      }
      state.feeds.unshift(feed);

      const posts = parsedData.posts.map((post) => ({ ...post, id: _.uniqueId() }));
      state.posts.unshift(...posts);
      state.loadingStatus = 'success'; 
    })
}

const runPostUpdatingProcess = (state) => {
  const period = 5000;
  const promises = state.feeds.map((feed) => {
    const urlWithProxy = addProxy(feed.url);
    return axios.get(urlWithProxy)
      .then((response) => {
        const parsedData = parse(response.data.contents);
        const newPosts = parsedData.posts.map((post) => ({ ...post, feedId: feed.id }));
        const oldPosts = state.posts.filter((post) => post.feedId === feed.id);

        const posts = _.differenceWith(newPosts, oldPosts, (post1, post2) => post1.title === post2.title)
          .map((post) => ({ ...post, id: _.uniqueId() }));
        state.posts.unshift(...posts);
      })
      .catch((e) => {
        console.error(e);
      });
  });

  Promise.all(promises)
    .then(() => setTimeout(() => runPostUpdatingProcess(state), period));
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
      modal: document.querySelector('#modal'),
      submit: document.querySelector('.rss-form button[type="submit"]'),
    }

    const initState = {
      loadingStatus: '', // success/loading/failed
      error: '', // '' or validationError/parseError/required
      isValid: true, // true/false
      feeds: [], // { description, id, title, url }
      posts: [], // { title, description, id, link }
      ui: {
        viewedPosts: new Set(), // Set [1, 342432, 8899]
      },
      modal: {
        postId: null,
      },
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
          state.loadingStatus = 'success'; 
          state.error = '';
          return downloadRss(url, state)
        })
        .catch(err => {
          state.error = err.message;
          state.loadingStatus = 'failed'; 
          // state.isValid = false;
        })
      }
    )

    elements.postsContainer.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      const postId = button.dataset.id;
      state.ui.viewedPosts.add(postId);
      state.modal.postId = postId;
    })

    runPostUpdatingProcess(state);
  })
}
