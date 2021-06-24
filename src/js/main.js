/* eslint-disable spaced-comment */

//=include scripts/dinamic-adaptive.js
//=include scripts/sliders.js
//=include scripts/spollers.js

/* eslint-enable spaced-comment */

const page = document.querySelector('.page');
const menu = document.querySelector('.menu');
const menuBurger = document.querySelector('.menu__burger');
const menuCloseButton = document.querySelector('.menu__close');
const menuBody = document.querySelector('.menu__body');
const searchInput = document.querySelector('.search__input');
const searchShowButton = document.querySelector('.menu__show-search');
const heroSliderBody = document.querySelector('.hero-slider__body');
const topBar = document.querySelector('.top-bar');
const header = document.querySelector('.header');

function setPageMargin() {
    const vw = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0,
    );
    if (vw <= 991) {
        page.style.marginTop = `${topBar.clientHeight}px`;
    } else {
        page.style.marginTop = '0px';
    }
}
setPageMargin();
window.addEventListener('resize', setPageMargin);

let scrollTop = window.pageYOffset;
function controlTopBar() {
    const vw = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0,
    );
    if (vw <= 991) {
        const top = window.pageYOffset;
        if (top > scrollTop) {
            header.style.top = `-${topBar.clientHeight}px`;
        } else {
            header.style.top = '0px';
        }
        scrollTop = top;
    }
}
controlTopBar();
window.addEventListener('scroll', controlTopBar);

searchInput.addEventListener('focus', () => {
    menu.classList.toggle('menu_state_search', true);
    page.classList.toggle('page_locked', true);
});
searchInput.addEventListener('blur', () => {
    menu.classList.toggle('menu_state_search', false);
    page.classList.toggle('page_locked', false);
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

if (heroSliderBody) {
    /* eslint-disable-next-line no-undef */
    const swiper = new Swiper(heroSliderBody, {
        // speed: 400,
        // spaceBetween: 100,
        // loop: true,
        effect: 'fade',
        navigation: {
            nextEl: '.hero-slider__next',
            prevEl: '.hero-slider__prev',
        },
    });
}
