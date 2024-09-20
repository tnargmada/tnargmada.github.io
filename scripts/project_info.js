// function to be called when back button is clicked
function goBack() {
  // animation
  document.querySelector("#back div").style.zIndex = 1;
  document.querySelector("#back div").style.animation =
    "grow 0.5s cubic-bezier(.57,.01,.81,.46) forwards";
  // navigate (after animation)
  setTimeout(() => {
    window.location.href = "/projects.html";
  }, 500);
}

// set back button onclick function
document.querySelector("#back").addEventListener("click", goBack);
