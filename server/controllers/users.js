const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserServices = require("../services/userServices");
const ResetPasswordServices = require("../services/resetPasswordServices");
const SECRET_KEY = "expense-app-secret-key";

exports.createUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await UserServices.findUser({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await UserServices.createUser({
      name: name,
      email: email,
      password: hashedPassword,
    });
    // const token = jwt.sign({ email: email, id: result.id }, SECRET_KEY);
    res.status(201).json({ user: result, success: true });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).send("Something went wrong.");
  }
};

exports.signinUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const existingUser = await UserServices.findUser({
      where: { email: email },
    });
    if (existingUser.length == 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword)
      return res.status(401).json({ message: "Invalid password" });
    const token = jwt.sign(
      {
        email: email,
        id: existingUser.id,
        isPremium: existingUser.isPremium,
      },
      SECRET_KEY
    );
    res.status(201).json({ user: existingUser, token: token });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Something went wrong!!" });
  }
};

exports.sendResetLink = async (req, res, next) => {
  try {
    const recipientEmail = req.body.email;
    const user = await UserServices.findUser({
      where: {
        email: req.body.email,
      },
    });
    const resetPassword = await user.createForgotPasswordRequest({
      isActive: true,
    });
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: recipientEmail, // Change to your recipient
      from: "vishal.pb.27@gmail.com", // Change to your verified sender
      subject: "Link to reset your password",
      text: "Click the link below",
      html: `<p>Click this link to <a href="http://localhost:3000/password/resetpassword/${resetPassword.id}">Reset password</a></p>`,
    };
    sgMail
      .send(msg)
      .then(() => {
        res.status(200).json({
          message: "Reset link successfully sent to registered email",
          success: true,
        });
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const resetId = req.params.resetId;
    const forgotPass = await ResetPasswordServices.findRequest({
      where: {
        id: resetId,
      },
    });
    forgotPass.isActive = false;
    const updatedForgotPass = await forgotPass.save();
    if (updatedForgotPass) {
      res.status(200).send(`<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Reset Password</title>
          <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD"
            crossorigin="anonymous"
          />
        </head>
        <body class="text-center main-bg">
          <main class="form-signin m-auto" style="width:700px">
            <div class="signup-form p-4 m-0">
            <img
            class="mb-4"
            src="https://media.istockphoto.com/id/1211308388/vector/sync.jpg?s=612x612&w=0&k=20&c=8vNLq-qIB7E9Bc08OQ7HXgmNH7rZ-pllo3CPwgV0lWg="
            alt=""
            width="100"
            height="100"
            />
            <h1 class="h3 mb-3 fw-normal">Reset Password</h1>
            <p id="errormsg" class="errormsg" style="display: none"></p>
            <form action="/password/updatepassword/${resetId}" method="POST">
                <div class="row">
                  <label for="name" class="col-sm-3 col-form-label">New Password</label>
                  <div class="col-sm-9">
                    <input
                      name="password"
                      type="password"
                      class="form-control"
                      id="password"
                      style="width:400px"
                    />
                  </div>
                </div>
                <button class="btn btn btn-primary mt-2" type="submit">
                  Reset password
                </button>
              </form>
            </div>
          </main>
        </body>
      </html>
      `);
      res.end();
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const resetId = req.params.resetId;
    const newPassword = req.body.password;
    const forgotPass = await ResetPasswordServices.findRequest({
      where: {
        id: resetId,
      },
    });
    const userId = forgotPass.userId;
    const user = await UserServices.findUser({
      where: {
        id: userId,
      },
    });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    const updatedUser = await user.save();
    if (updatedUser) {
      res
        .status(200)
        .send(
          `<html>Password updated successfully.Kindly close this window.</html>`
        );
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};
