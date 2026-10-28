const searchTextDirection = value => {
  const first = String(value || '').match(/[\p{Script=Arabic}\p{Script=Latin}]/u)?.[0];
  return first && /\p{Script=Latin}/u.test(first) ? 'ltr' : 'rtl';
};
