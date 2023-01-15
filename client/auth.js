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
    errMsg.innerText = err.response.data.message;
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
  try {
    let userData = {
      email: emailField.value,
      password: passwordField.value,
    };
    const response = await axios.post(
      "http://localhost:3000/signInUser",
      userData
    );
    console.log("reposne login", response.data.user[0]);
    const { name, email } = response.data.user[0];
    const userDetails = {
      name: name,
      email: email,
    };
    console.log("useruser", userDetails);
    localStorage.setItem("User Details", JSON.stringify(userDetails));
    localStorage.setItem("Authorization", response.data.token);
    location.href = "./pages/homepage.html";
  } catch (err) {
    console.log(err);
    errMsg.innerText = err.response.data.message;
    errMsg.style.display = "block";
    setTimeout(() => {
      errMsg.style.display = "none";
    }, 5000);
  }
}
