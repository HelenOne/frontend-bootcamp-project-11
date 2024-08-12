export default (elements, initState, i18next) => (path, value, previousValue) => {
  console.log('path', path)
  switch (path) {
    case 'isValid': {
      if (value) {
        elements.feedback.textContent = '';
        elements.feedback.classList.remove('text-danger');
      } else {
        elements.feedback.textContent = i18next.t('errors.validationError');
        elements.feedback.classList.add('text-danger');
      }
    }
  }
}
