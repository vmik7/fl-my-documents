/* eslint-disable spaced-comment */

//=include scripts/sliders.js

/* eslint-enable spaced-comment */

const page = document.querySelector('.page');
const menu = document.querySelector('.menu');
const menuBurger = document.querySelector('.menu__burger');
const menuCloseButton = document.querySelector('.menu__close');
const menuBody = document.querySelector('.menu__body');
const searchInput = document.querySelector('.search__input');
const searchShowButton = document.querySelector('.menu__show-search');
const heroSlider = document.querySelector('.hero-slider');

searchInput.addEventListener('focus', () => {
    menu.classList.toggle('menu_state_search', true);
});
searchInput.addEventListener('blur', () => {
    menu.classList.toggle('menu_state_search', false);
});
searchShowButton.addEventListener('click', () => {
    searchInput.focus();
});

menuBurger.addEventListener('click', () => {
    menu.classList.toggle('menu_expanded', true);
    page.classList.toggle('page_locked', true);
});
menuCloseButton.addEventListener('click', () => {
    menu.classList.toggle('menu_expanded', false);
    page.classList.toggle('page_locked', false);
});
menuBody.addEventListener('click', (e) => {
    if (e.target === menuBody) {
        menu.classList.toggle('menu_expanded', false);
        page.classList.toggle('page_locked', false);
    }
});

if (heroSlider) {
    /* eslint-disable-next-line no-undef */
    const swiper = new Swiper(heroSlider, {
        speed: 400,
        spaceBetween: 100,
    });
}
