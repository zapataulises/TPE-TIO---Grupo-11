const subm = document.getElementById("submit");
const verify = document.getElementById("verif");
const capt = document.getElementById("captcha");
const number1 = document.getElementById("n1");
const number2 = document.getElementById("n2");

function checkCaptcha(n1, n2) {
  return n1 == n2;
}
function random() {
  return Math.floor(Math.random() * 10 + 1);
}
document.addEventListener("DOMContentLoaded", function () {
  number1.innerHTML = random();
  number2.innerHTML = random();
});
capt.addEventListener("input", function () {
  const n1 = parseInt(number1.innerHTML) + parseInt(number2.innerHTML);
  const result = checkCaptcha(n1, capt.value);
  if (result) {
    subm.disabled = false;
    verify.innerHTML = "Este captcha es Correcto";
  } else {
    subm.disabled = true;
    verify.innerHTML = "El captcha es invalido";
  }
});
