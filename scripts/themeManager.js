
const THEME_LIGHT = "light";
const THEME_DARK = "dark";
const THEME_HIGH_CONTRAST = "high-contrast"

// Starting parameters
let curTheme = THEME_LIGHT;

function initTheme() {
    let storedTheme = localStorage.getItem("theme");
    if (storedTheme == null) {
        curTheme = THEME_LIGHT;
    } else {
        curTheme = storedTheme;
    }
    setTheme(curTheme);
}

function setTheme(theme) {
    localStorage.setItem("theme", theme);
    document.getElementById("theme-switcher").href = "../css/themes/" + theme + ".css";
}

function changeTheme() {
    if (curTheme == THEME_LIGHT) {
        curTheme = THEME_DARK;
    } else if (curTheme == THEME_DARK) {
        curTheme = THEME_HIGH_CONTRAST;
    } else {
        curTheme = THEME_LIGHT;
    }
    setTheme(curTheme);
}