// // Initialization for ES Users
// import {
//     Carousel,
//     initTWE,
//   } from "tw-elements";
  
//   initTWE({ Carousel });



document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.querySelector('#carouselExampleCaptions');
    const indicators = carousel.querySelectorAll('[data-twe-slide-to]');
    const items = carousel.querySelectorAll('[data-twe-carousel-item]');
    const prevButton = carousel.querySelector('[data-twe-slide="prev"]');
    const nextButton = carousel.querySelector('[data-twe-slide="next"]');

    let currentSlide = 0;
    const totalSlides = items.length;
    const intervalTime = 3000; // 3 seconds for auto-slide
    let autoSlideInterval = setInterval(nextSlide, intervalTime);

    // Update the active slide
    function updateSlide(index) {
        items.forEach((item, i) => {
            if (i === index) {
                item.classList.remove('hidden');
                indicators[i].classList.add('opacity-100');
            } else {
                item.classList.add('hidden');
                indicators[i].classList.remove('opacity-100');
            }
        });
        currentSlide = index;
    }

    // Show next slide
    function nextSlide() {
        let nextIndex = (currentSlide + 1) % totalSlides;
        updateSlide(nextIndex);
    }

    // Show previous slide
    function prevSlide() {
        let prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlide(prevIndex);
    }

    // Next button click event
    nextButton.addEventListener('click', function () {
        clearInterval(autoSlideInterval); // Stop auto-sliding temporarily on manual interaction
        nextSlide();
        autoSlideInterval = setInterval(nextSlide, intervalTime); // Restart auto-sliding
    });

    // Previous button click event
    prevButton.addEventListener('click', function () {
        clearInterval(autoSlideInterval); // Stop auto-sliding temporarily on manual interaction
        prevSlide();
        autoSlideInterval = setInterval(nextSlide, intervalTime); // Restart auto-sliding
    });

    // Indicators click event
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function () {
            clearInterval(autoSlideInterval); // Stop auto-sliding temporarily on manual interaction
            updateSlide(index);
            autoSlideInterval = setInterval(nextSlide, intervalTime); // Restart auto-sliding
        });
    });

    // Start the carousel with the first slide active
    updateSlide(currentSlide);
});
