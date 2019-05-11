function ContentSlider(parameters) {
  const defaultParameters = {
    carousel: false,
    autoShow: true,
    noBtn: false,
    autoFlippingTime: 3,
    pauseAutoShow: 15,
    flippingDirection: false, // true - right, false - left
    mainId: 'slider',
    btnClassHide: 'arrow_hide',
    btnClassLeft: 'content-slider__arrow_left',
    btnClassRight: 'content-slider__arrow_right',
    contentClass: 'content-slider__item',
    activeContentClass: 'content-slider__item_active',
  };
  const arg = {...defaultParameters, ...parameters};

  let intervalId = 0;
  let timeoutId = 0;

  const id = document.querySelector(`#${arg.mainId}`);
  const btnLeft = document.querySelector(`#${arg.mainId} .${arg.btnClassLeft}`);
  const btnRight = document.querySelector(`#${arg.mainId} .${arg.btnClassRight}`);

  const contents = document.querySelectorAll(`#${arg.mainId} .${arg.contentClass}`);
  const contentsLength = contents.length;
  const indexOfLastChild = contentsLength - 1;
  const indexOfFirstChild = 0;

  (function () {
      const i = activeContent();
      if (!arg.noBtn && !arg.carousel && (i === indexOfFirstChild || i ===  indexOfLastChild)) {
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
    }
  )();


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
    for (let i = 0; i < contentsLength; i++) {
      if (contents[i].classList.contains(arg.activeContentClass))
        return i;
    }
    return false;
  }

  function flippingContentLeft() {
    const i = activeContent();

    if (i) {
      toggleContentItem(i);
      toggleContentItem(i - 1);

      if (i === indexOfLastChild && !arg.carousel && !arg.noBtn) {
        toggleBtnHide(btnRight);
        btnRight.classList.toggle(arg.btnClassRight);
      }

      if (i - 1 === indexOfFirstChild && !arg.carousel) {
        if(!arg.noBtn) {
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
    const i = activeContent();

    if (i < indexOfLastChild) {
      toggleContentItem(i);
      toggleContentItem(i + 1);

      if (i === indexOfFirstChild && !arg.carousel && !arg.noBtn) {
        toggleBtnHide(btnLeft);
        btnLeft.classList.toggle(arg.btnClassLeft);
      }

      if (i + 1 === indexOfLastChild && !arg.carousel) {
        if(!arg.noBtn){
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
    }, arg.autoFlippingTime * 1000)
  }

  function restartAutoShow() {
    if (intervalId) {
      clearInterval(intervalId);

      if (timeoutId) clearInterval(timeoutId);

      timeoutId = setTimeout(function () {
        intervalId = autoFlipping();
      }, arg.pauseAutoShow * 1000)
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



