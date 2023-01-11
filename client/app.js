console.log("in signup page");
const submitBtn = document.getElementById("create");
const nameField = document.getElementById("name");
const emailField = document.getElementById("email");
const passwordField = document.getElementById("password");
const errMsg = document.getElementById("errormsg");

submitBtn.addEventListener("click", createAccount);

async function createAccount(e) {
  e.preventDefault();
  try {
    let userData = {
      name: nameField.value,
      email: emailField.value,
      password: passwordField.value,
    };
    await axios.post("http://localhost:3000/createUser", userData);
  } catch (err) {
    errMsg.style.display = "block";
    setTimeout(() => {
      errMsg.style.display = "none";
    }, 5000);
  }
}
