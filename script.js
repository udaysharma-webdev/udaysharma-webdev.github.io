
const text = "I build modern websites, eCommerce stores, UX/UI, CRM & automation.";
let i = 0;
const typing = document.getElementById("typing");

function type() {
  if (i < text.length) {
    typing.textContent += text.charAt(i);
    i++;
    setTimeout(type, 50);
  }
}

type();
