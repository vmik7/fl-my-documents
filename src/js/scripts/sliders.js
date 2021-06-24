const sliders = document.querySelectorAll('._swiper');

for (let i = 0; i < sliders.length; i++) {
    const slider = sliders[i];

    if (!slider.classList.contains('_swiper_builded')) {
        slider.classList.toggle('swiper-container');

        const slides = slider.children;
        for (let j = 0; j < slides.length; j++) {
            slides[j].classList.toggle('swiper-slide', true);
        }

        const sliderWrapper = document.createElement('div');
        sliderWrapper.classList.add('swiper-wrapper');

        sliderWrapper.innerHTML = slider.innerHTML;
        slider.innerHTML = '';

        slider.appendChild(sliderWrapper);
        slider.classList.toggle('_swiper_builded', true);
    }
}
