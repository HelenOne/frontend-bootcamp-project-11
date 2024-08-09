export default (elements, initState) => (path, value, previousValue) => {
  console.log('path', path)
  switch (path) {
    case 'isValid': {
      if (value) {
        elements.feedback.textContent = '';
        elements.feedback.classList.remove('text-danger');
      } else {
        elements.feedback.textContent = 'Ссылка должна быть валидным URL';
        elements.feedback.classList.add('text-danger');
      }
    }
  }
}
