const switcherButton = document.querySelector(".theme-toggle-button");
const sunIcon = document.querySelector(".theme-toggle-button > .sun-icon");
const moonIcon = document.querySelector(".theme-toggle-button > .moon-icon");

const initialTheme = localStorage.getItem('theme')

if (initialTheme) {
  switchTheme(initialTheme == 'dark', false)
}

function switchTheme(dark, persist=true) {
  let darkTheme = dark;
  if (dark == null) {
    darkTheme = !document.body.classList.contains("dark");
  }
  if (darkTheme) {
    console.log('Now: Dark theme');
    document.body.classList.add("dark");
    sunIcon.classList.add("hide");
    moonIcon.classList.remove("hide");
    if (persist) {
      window.localStorage.setItem('theme', 'dark');      
    }
    return;
  }else{
    console.log('Now: Light theme');
    document.body.classList.remove("dark");
    sunIcon.classList.remove("hide");
    moonIcon.classList.add("hide");
    
    if (persist) {
      window.localStorage.setItem('theme', 'light');      
    }
    return;
  }
}

switcherButton.addEventListener("click", () => {
  switchTheme(null)
});

window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", ({ matches }) => {
      
      if (matches) {
        console.log("Sys: Dark");
      }else{
        console.log("Sys: Light");
      }
      switchTheme(matches, false)

    });
