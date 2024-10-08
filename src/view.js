/* eslint-disable no-case-declarations */

const renderFeedback = (elements, state, i18next) => {
  const {
    feedback, input, submit, form,
  } = elements;

  switch (state.loading.status) {
    case 'success':
      submit.disabled = false;
      input.removeAttribute('readonly');
      feedback.textContent = i18next.t('loading.success');
      input.classList.remove('is-invalid');
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      form.reset();
      input.focus();
      break;
    case 'loading':
      submit.disabled = true;
      input.setAttribute('readonly', true);
      input.classList.remove('is-invalid');
      feedback.classList.remove('text-success');
      feedback.classList.remove('text-danger');
      feedback.innerHTML = '';
      break;
    case 'failed':
      submit.disabled = false;
      input.removeAttribute('readonly');
      input.classList.add('is-invalid');
      const errorMessage = state.loading.error;

      feedback.textContent = i18next.t(`errors.${errorMessage}`);
      feedback.classList.add('text-danger');
      feedback.classList.remove('text-success');
      break;
    default:
      break;
  }
};

const renderFeeds = (elements, state, i18next) => {
  const { feeds } = state;
  const { feedsContainer } = elements;

  const feedElements = feeds.map((feed) => {
    const { title, description, id } = feed;
    const feedItem = document.createElement('li');
    feedItem.classList.add('list-group-item', 'border-0', 'border-end-0');
    feedItem.dataset.id = id;

    const titleEl = document.createElement('h3');
    titleEl.classList.add('h6', 'm-0');
    titleEl.textContent = title;

    const descriptionEl = document.createElement('p');
    descriptionEl.classList.add('m-0', 'small', 'text-black-50');
    descriptionEl.textContent = description;

    feedItem.appendChild(titleEl);
    feedItem.appendChild(descriptionEl);

    return feedItem;
  });

  const feedCardBorder = document.createElement('div');
  feedCardBorder.classList.add('card', 'border-0');

  const feedCardBody = document.createElement('div');
  feedCardBody.classList.add('card-body');

  const feedsTitle = document.createElement('h2');
  feedsTitle.classList.add('card-title', 'h4');
  feedsTitle.textContent = i18next.t('feeds');

  feedCardBody.appendChild(feedsTitle);
  feedCardBorder.appendChild(feedCardBody);

  const feedsList = document.createElement('ul');
  feedsList.classList.add('list-group', 'border-0', 'rounded-0');

  feedsList.append(...feedElements);

  feedCardBorder.appendChild(feedsList);
  feedsContainer.innerHTML = '';
  feedsContainer.appendChild(feedCardBorder);
};

const renderPosts = (elements, state, i18next) => {
  const { posts } = state;
  const { postsContainer } = elements;

  const postCardBorder = document.createElement('div');
  postCardBorder.classList.add('card', 'border-0');

  const postCardBody = document.createElement('div');
  postCardBody.classList.add('card-body');

  const postsTitle = document.createElement('h2');
  postsTitle.classList.add('card-title', 'h4');
  postsTitle.textContent = i18next.t('posts');
  postCardBody.appendChild(postsTitle);
  postCardBorder.appendChild(postCardBody);

  const postsList = document.createElement('ul');
  postsList.classList.add('list-group', 'border-0', 'rounded-0');

  const postElements = posts.map((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const a = document.createElement('a');
    a.setAttribute('href', post.link);
    if (state.ui.viewedPosts.has(post.id)) {
      a.classList.add('fw-normal', 'link-secondary');
    } else {
      a.classList.add('fw-bold');
    }
    a.dataset.id = post.id;
    a.textContent = post.title;
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');

    li.appendChild(a);

    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.dataset.id = post.id;
    button.dataset.bsToggle = 'modal';
    button.dataset.bsTarget = '#modal';
    button.textContent = i18next.t('preview');

    li.appendChild(button);
    return li;
  });

  postsList.append(...postElements);
  postCardBorder.appendChild(postsList);
  postsContainer.innerHTML = '';
  postsContainer.appendChild(postCardBorder);
};

const renderModal = (elements, state) => {
  const post = state.posts.find(({ id }) => id === state.modal.postId);
  const title = elements.modal.querySelector('.modal-title');
  const body = elements.modal.querySelector('.modal-body');
  const readButton = elements.modal.querySelector('.full-article');

  title.textContent = post.title;
  body.textContent = post.description;
  readButton.href = post.link;
};

const renderForm = (elements, state, i18next) => {
  const { form: { isValid, error } } = state;
  const { input, feedback } = elements;
  if (isValid) {
    input.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
    feedback.textContent = i18next.t('loading.success');
  } else {
    input.classList.add('is-invalid');
    feedback.classList.add('text-danger');
    feedback.textContent = i18next.t([`errors.${error}`]);
  }
};

export default (elements, state, i18next) => (path, value) => {
  switch (path) {
    case 'loading.status':
      renderFeedback(elements, state, i18next, value);
      break;
    case 'feeds':
      renderFeeds(elements, state, i18next);
      break;
    case 'posts':
      renderPosts(elements, state, i18next);
      break;
    case 'ui.viewedPosts':
      renderPosts(elements, state, i18next);
      break;
    case 'modal.postId':
      renderModal(elements, state);
      break;
    case 'form.isValid':
      renderForm(elements, state, i18next);
      break;
    default:
      break;
  }
};
