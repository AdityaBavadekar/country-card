const style = getComputedStyle(document.documentElement);
const navbar = document.getElementById('navbar');
const spacer = document.getElementsByClassName('navbar-spacer')[0];
setInterval(() => {
    if (document.documentElement.scrollTop > spacer.scrollHeight/5) {
        navbar.style.backgroundColor = style.getPropertyValue('--app-navbar-bg-color')
    }else{
        navbar.style.backgroundColor = style.getPropertyValue('--app-navbar-bg-color-initial')
    }
}, 100)