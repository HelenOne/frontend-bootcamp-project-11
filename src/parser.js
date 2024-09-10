export default (rssString) => {
  const parser = new DOMParser();
  const parsedRSS = parser.parseFromString(rssString, 'text/xml');

  const parseError = parsedRSS.querySelector('parsererror');

  if (parseError) {
    throw new Error('parseError');
  }

  const feedTitle = parsedRSS.querySelector('channel > title').textContent;
  const feedDescription = parsedRSS.querySelector('channel > description').textContent;

  const postElements = parsedRSS.querySelectorAll('item');
  const posts = Array.from(postElements).map((postElement) => {
    const title = postElement.querySelector('title').textContent;
    const description = postElement.querySelector('description').textContent;
    const link = postElement.querySelector('link').textContent;
    return { title, description, link };
  });

  return ({
    feedTitle,
    feedDescription,
    posts,
  });
};
