const signUpBtn = document.getElementById("create");
const signInBtn = document.getElementById("signin");
const nameField = document.getElementById("name");
const emailField = document.getElementById("email");
const passwordField = document.getElementById("password");
const errMsg = document.getElementById("errormsg");

if (signUpBtn) signUpBtn.addEventListener("click", createAccount);
if (signInBtn) signInBtn.addEventListener("click", accountLogin);

// signup
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

//signin
async function accountLogin(e) {
  console.log("values", emailField.value, passwordField.value);
  e.preventDefault();
  //   try {
  //     let userData = {
  //       email: emailField.value,
  //       password: passwordField.value,
  //     };
  //     await axios.post("http://localhost:3000/signInUser", userData);
  //   } catch (err) {
  //     errMsg.style.display = "block";
  //     setTimeout(() => {
  //       errMsg.style.display = "none";
  //     }, 5000);
  //   }
}
