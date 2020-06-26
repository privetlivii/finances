//= lib/jquery-3.5.1.min.js
//= lib/slick.min.js

$(document).ready(function () {
    $('.init__slick').slick({

    });

});

window.addEventListener("DOMContentLoaded", function () {

    /* BEGIN: Menu toggle */
    let hamburger = document.querySelector('.nav-menu__toggle');
    let menu = document.querySelector('.nav-menu');


    const toggleMenu = function () {
        menu.classList.toggle('active');
        hamburger.classList.toggle('active');
    };

    hamburger.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleMenu();
    });

    document.addEventListener('click', function (e) {
        let target = e.target;
        let its_menu = target === menu || menu.contains(target);
        let its_hamburger = target === hamburger;
        let menu_is_active = menu.classList.contains('active');

        if (!its_menu && !its_hamburger && menu_is_active) {
            toggleMenu();
        }
    });
    /* END: Menu toggle */

    // let search = document.querySelector('.search');
    // const searchOpen = function () {
    //     search.classList.toggle('active');
    // };







});




