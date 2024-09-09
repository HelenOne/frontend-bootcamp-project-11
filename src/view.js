const renderFeedback = (elements, state, i18next, value) => {
  if (value) {
    elements.feedback.textContent = '';
    elements.feedback.classList.remove('text-danger');
  } else {
    const errorMessage = state.error;
    elements.feedback.textContent = i18next.t(`errors.${errorMessage}`);
    elements.feedback.classList.add('text-danger');
  }
}

const renderFeeds = (elements, state, i18next) => {
  const { feeds } = state;
  const { feedsContainer } = elements;

  const feedElements = feeds.map(feed => {
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
}

const renderPosts = () => {
  
}


export default (elements, state, i18next) => (path, value, previousValue) => {
  switch (path) {
    case 'isValid':
      renderFeedback(elements, state, i18next, value);
      break;
    case 'feeds':
      renderFeeds(elements, state, i18next);
      break;
    case 'posts':
      renderPosts(state);
      break;
    default:
      break;
  }
}
