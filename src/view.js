export default (elements, state, i18next) => (path, value, previousValue) => {
  switch (path) {
    case 'isValid': {
      if (value) {
        elements.feedback.textContent = '';
        elements.feedback.classList.remove('text-danger');
      } else {
        const errorMessage = state.error;
        elements.feedback.textContent = i18next.t(`errors.${errorMessage}`);
        elements.feedback.classList.add('text-danger');
      }
    }
  }
}
