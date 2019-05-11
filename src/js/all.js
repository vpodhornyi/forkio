"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var wrapperMenu = document.querySelector(".btn-mobile-menu");
var dropDownMenu = document.querySelector(".navigation-menu");
wrapperMenu.addEventListener("click", function () {
  var show = dropDownMenu.classList.contains("navigation-menu_show");
  var hide = dropDownMenu.classList.contains("navigation-menu_hide");
  wrapperMenu.classList.toggle("btn-mobile-menu_open");

  switch (true) {
    case show:
      dropDownMenu.classList.toggle("navigation-menu_show");
      dropDownMenu.classList.toggle("navigation-menu_hide");
      break;

    case hide:
      dropDownMenu.classList.toggle("navigation-menu_show");
      dropDownMenu.classList.toggle("navigation-menu_hide");
      break;

    default:
      dropDownMenu.classList.toggle("navigation-menu_show");
  }
});
window.addEventListener('resize', function () {
  var width = document.querySelector('#header').offsetWidth;

  if (width > 750) {
    var show = dropDownMenu.classList.contains("navigation-menu_show");
    var hide = dropDownMenu.classList.contains("navigation-menu_hide");

    if (show) {
      dropDownMenu.classList.toggle("navigation-menu_show");
      wrapperMenu.classList.toggle("btn-mobile-menu_open");
      return;
    }

    if (hide) {
      dropDownMenu.classList.toggle("navigation-menu_hide");
    }
  }
});
var slider = new ContentSlider({
  carousel: true,
  flippingDirection: true
});
slider.activateSlider();

function ContentSlider(parameters) {
  var defaultParameters = {
    carousel: false,
    autoShow: true,
    noBtn: false,
    autoFlippingTime: 3,
    pauseAutoShow: 15,
    flippingDirection: false,
    // true - right, false - left
    mainId: 'slider',
    btnClassHide: 'arrow_hide',
    btnClassLeft: 'content-slider__arrow_left',
    btnClassRight: 'content-slider__arrow_right',
    contentClass: 'content-slider__item',
    activeContentClass: 'content-slider__item_active'
  };

  var arg = _objectSpread({}, defaultParameters, parameters);

  var intervalId = 0;
  var timeoutId = 0;
  var id = document.querySelector("#".concat(arg.mainId));
  var btnLeft = document.querySelector("#".concat(arg.mainId, " .").concat(arg.btnClassLeft));
  var btnRight = document.querySelector("#".concat(arg.mainId, " .").concat(arg.btnClassRight));
  var contents = document.querySelectorAll("#".concat(arg.mainId, " .").concat(arg.contentClass));
  var contentsLength = contents.length;
  var indexOfLastChild = contentsLength - 1;
  var indexOfFirstChild = 0;

  (function () {
    var i = activeContent();

    if (!arg.noBtn && !arg.carousel && (i === indexOfFirstChild || i === indexOfLastChild)) {
      if (i === indexOfFirstChild) {
        arg.flippingDirection = true;
        toggleBtnHide(btnLeft);
        btnLeft.classList.toggle(arg.btnClassLeft);
      } else {
        arg.flippingDirection = false;
        toggleBtnHide(btnRight);
        btnRight.classList.toggle(arg.btnClassRight);
      }
    }
  })();

  function toggleContentItem(i) {
    contents[i].classList.toggle(arg.activeContentClass);
    return i;
  }

  function toggleBtnHide(element) {
    element.classList.toggle(arg.btnClassHide);
  }

  function pressLeftBtn(ev) {
    return ev.target.classList.contains(arg.btnClassLeft);
  }

  function pressRightBtn(ev) {
    return ev.target.classList.contains(arg.btnClassRight);
  }

  function activeContent() {
    for (var i = 0; i < contentsLength; i++) {
      if (contents[i].classList.contains(arg.activeContentClass)) return i;
    }

    return false;
  }

  function flippingContentLeft() {
    var i = activeContent();

    if (i) {
      toggleContentItem(i);
      toggleContentItem(i - 1);

      if (i === indexOfLastChild && !arg.carousel && !arg.noBtn) {
        toggleBtnHide(btnRight);
        btnRight.classList.toggle(arg.btnClassRight);
      }

      if (i - 1 === indexOfFirstChild && !arg.carousel) {
        if (!arg.noBtn) {
          toggleBtnHide(btnLeft);
          btnLeft.classList.toggle(arg.btnClassLeft);
        }

        if (!arg.flippingDirection) arg.flippingDirection = !arg.flippingDirection;
      }

      return i - 1;
    }

    if (arg.carousel) {
      toggleContentItem(i);
      return toggleContentItem(indexOfLastChild);
    }
  }

  function flippingContentRight() {
    var i = activeContent();

    if (i < indexOfLastChild) {
      toggleContentItem(i);
      toggleContentItem(i + 1);

      if (i === indexOfFirstChild && !arg.carousel && !arg.noBtn) {
        toggleBtnHide(btnLeft);
        btnLeft.classList.toggle(arg.btnClassLeft);
      }

      if (i + 1 === indexOfLastChild && !arg.carousel) {
        if (!arg.noBtn) {
          toggleBtnHide(btnRight);
          btnRight.classList.toggle(arg.btnClassRight);
        }

        if (arg.flippingDirection) arg.flippingDirection = !arg.flippingDirection;
      }

      return i + 1;
    }

    if (arg.carousel) {
      toggleContentItem(i);
      return toggleContentItem(indexOfFirstChild);
    }
  }

  function autoFlipping() {
    return setInterval(function () {
      arg.flippingDirection ? flippingContentRight() : flippingContentLeft();
    }, arg.autoFlippingTime * 1000);
  }

  function restartAutoShow() {
    if (intervalId) {
      clearInterval(intervalId);
      if (timeoutId) clearInterval(timeoutId);
      timeoutId = setTimeout(function () {
        intervalId = autoFlipping();
      }, arg.pauseAutoShow * 1000);
    }
  }

  function main(ev) {
    switch (true) {
      case pressLeftBtn(ev):
        restartAutoShow();
        if (arg.flippingDirection) arg.flippingDirection = !arg.flippingDirection;
        flippingContentLeft();
        break;

      case pressRightBtn(ev):
        restartAutoShow();
        if (!arg.flippingDirection) arg.flippingDirection = !arg.flippingDirection;
        flippingContentRight();
        break;
    }
  }

  function activateSlider() {
    id.addEventListener('click', main);

    if (arg.autoShow) {
      intervalId = autoFlipping();
    }
  }

  this.activateSlider = activateSlider;
}