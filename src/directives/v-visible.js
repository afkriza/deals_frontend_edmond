export default (el, binding) => {
  const value = binding.value;

  if (value) {
    el.style.visibility = 'visible';
  } else {
    el.style.visibility = 'hidden';
  }
};
