export const isElementOverflowing = ({ offsetWidth, scrollWidth }) =>
  offsetWidth < scrollWidth;
