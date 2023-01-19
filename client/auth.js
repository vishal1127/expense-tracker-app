const signUpBtn = document.getElementById("create");
const signInBtn = document.getElementById("signin");
const sendResetLinkBtn = document.getElementById("send-link");
const nameField = document.getElementById("name");
const emailField = document.getElementById("email");
const passwordField = document.getElementById("password");
const errMsg = document.getElementById("errormsg");
const successMsg = document.getElementById("successmsg");

if (signUpBtn) signUpBtn.addEventListener("click", createAccount);
if (signInBtn) signInBtn.addEventListener("click", accountLogin);
sendResetLinkBtn.addEventListener("click", sendResetLink);

// signup
async function createAccount(e) {
  e.preventDefault();
  nameField.reportValidity();
  emailField.reportValidity();
  passwordField.reportValidity();
  if (nameField.value && emailField.value && passwordField.value) {
    try {
      let userData = {
        name: nameField.value,
        email: emailField.value,
        password: passwordField.value,
      };
      const response = await axios.post(
        "http://localhost:3000/createUser",
        userData
      );
      if (response) {
        nameField.value = "";
        emailField.value = "";
        passwordField.value = "";
        successMsg.innerText = "Account created successfuly";
        successMsg.style.display = "block";
        setTimeout(() => {
          successMsg.style.display = "none";
        }, 5000);
      }
    } catch (err) {
      errMsg.innerText = err.response.data.message;
      errMsg.style.display = "block";
      setTimeout(() => {
        errMsg.style.display = "none";
      }, 5000);
    }
  }
}

//signin
async function accountLogin(e) {
  console.log("values", emailField.value, passwordField.value);
  e.preventDefault();
  emailField.reportValidity();
  passwordField.reportValidity();
  if (emailField.value && passwordField.value) {
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
      const { name, email, isPremium } = response.data.user[0];
      const userDetails = {
        name: name,
        email: email,
        subscribtion: isPremium ? "Premium" : "Free",
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
}

//reset password
async function sendResetLink(e) {
  e.preventDefault();
  try {
    emailField.reportValidity();
    if (emailField.checkValidity()) {
      const userEmail = {
        email: emailField.value,
      };
      const resetLink = await axios.post(
        "http://localhost:3000/password/forgotpassword",
        userEmail
      );
    }
  } catch (error) {
    console.log("error while sending reset link", error);
  }
}
