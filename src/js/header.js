const wrapperMenu = document.querySelector(".btn-mobile-menu");
const dropDownMenu = document.querySelector(".navigation-menu");

wrapperMenu.addEventListener("click", function () {
  const show = dropDownMenu.classList.contains("navigation-menu_show");
  const hide = dropDownMenu.classList.contains("navigation-menu_hide");

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
  const width = document.querySelector('#header').offsetWidth;
  if (width > 750) {
    const show = dropDownMenu.classList.contains("navigation-menu_show");
    const hide = dropDownMenu.classList.contains("navigation-menu_hide");
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