const menuList = document.querySelector('.menu__list');
const searchInput = document.querySelector('.search__input');

searchInput.addEventListener('focus', () => {
    menuList.classList.toggle('menu__list_hidden', true);
});
searchInput.addEventListener('blur', () => {
    menuList.classList.toggle('menu__list_hidden', false);
});
