const navbar = document.getElementById('header-navbar')
const stickyScrollThreshold = navbar.offsetTop

const softwareMenu = document.getElementById('navbar-software')

function scrollCallback() {
    if (window.pageYOffset >= stickyScrollThreshold) {
        navbar.classList.add('sticky')
    } else {
        navbar.classList.remove('sticky')
    }
}

function navbarHiddenMenu(navbarLinkParentId, hiddenMenuId, doShow=true) {
    const menu = document.getElementById(hiddenMenuId)

    if (doShow) {
        const parent = document.getElementById(navbarLinkParentId)
        menu.classList.remove('navbar-hidden')
        menu.style.width = parent.style.width
        menu.style.top = parent.style.bottom
        menu.style.left = parent.style.left
    }
    else {
        menu.style.display = 'none'
        menu.classList.add('navbar-hidden')
    }

    console.log(menu.classList)
}

window.onscroll = () => scrollCallback()

softwareMenu.onmouseenter = () => navbarHiddenMenu('navbar-software', 'software-menu')
softwareMenu.onmouseleave = () => navbarHiddenMenu('navbar-softwar', 'software-menu', false)

window.onresize = () => {
    // keep footer on the bottom of the page
}