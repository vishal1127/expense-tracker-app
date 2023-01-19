const expenseModal = document.querySelector("#expenseModal");
const userName = document.querySelector(".UserName");
const addExpenseBtn = document.getElementById("add-expense");
const amountField = document.getElementById("amount-text");
const categoryField = document.getElementById("category-text");
const descriptionField = document.getElementById("description-text");
const premiumBtn = document.getElementById("premium-btn");
const signOutBtn = document.getElementById("signout-btn");
const premiumStatus = document.getElementById("premium-status");
const leaderboardBtn = document.getElementById("leaderboard-btn");

let expenseTable;
let expenseList;

window.addEventListener("DOMContentLoaded", listAllExpenses);
addExpenseBtn.addEventListener("click", addExpense);
premiumBtn.addEventListener("click", buyPremium);
signOutBtn.addEventListener("click", signOut);

const userDetails = JSON.parse(localStorage.getItem("User Details"));

userName.innerHTML = `<p style="margin:0px">${userDetails.name}</p>`;

async function addExpense(e) {
  e.preventDefault();
  amountField.reportValidity();
  categoryField.reportValidity();
  descriptionField.reportValidity();
  if (amountField.value && categoryField.value && descriptionField.value) {
    const expenseData = {
      amount: amountField.value,
      category: categoryField.value,
      description: descriptionField.value,
    };
    try {
      const result = await axios.post(
        "http://localhost:3000/addExpense",
        expenseData,
        {
          headers: {
            authorization: localStorage.getItem("Authorization"),
          },
        }
      );
      if (result) {
        listExpense(expenseData, expenseList.data.length);
        amountField.value = "";
        categoryField.value = "Groceries";
        descriptionField.value = "";
        //   expenseModal.hide();
      }
    } catch (error) {
      console.log("Error:", error);
    }
  }
}

async function listAllExpenses() {
  updateLinks();
  expenseList = await axios.get("http://localhost:3000/getExpenseList", {
    headers: {
      authorization: localStorage.getItem("Authorization"),
    },
  });
  expenseTable = document.getElementById("expense-list-table");
  expenseTable.innerHTML = "";
  expenseList.data.forEach((expense, id) => {
    listExpense(expense, id);
  });
}

async function deleteExpense(id) {
  const deletedExpense = await axios.delete(
    `http://localhost:3000/deleteExpense/${id}`,
    {
      headers: {
        authorization: localStorage.getItem("Authorization"),
      },
    }
  );
  if (deletedExpense) {
    const expenseToDelete = document.getElementById(id);
    expenseToDelete.remove();
  }
}

function listExpense(expense, id) {
  expenseTable.innerHTML += `<tr id="${expense.id}"><td>${id + 1}</td>
  <td>${expense.amount}</td>
    <td>${expense.category}</td>
    <td>${expense.description}</td>
    <td>
      <button 
      id="edit-expense"
      onclick="editExpense(${expense.id})"
      type="button"
      class="btn btn-warning btn-sm">
        Edit
      </button>
      <button
        id="delete-expense"
        onclick="deleteExpense(${expense.id})"
        type="button"
        class="btn btn-danger btn-sm"
      >
        Delete
      </button>
    </td></tr>`;
}

async function buyPremium(e) {
  try {
    const payment = await axios.get(
      "http://localhost:3000/purchase/buyPremium",
      {
        headers: {
          authorization: localStorage.getItem("Authorization"),
        },
      }
    );
    var options = {
      key: payment.data.key_id,
      order_id: payment.data.order.id,
      handler: async function (payment) {
        await axios
          .post(
            "http://localhost:3000/purchase/updatePaymentStatus",
            {
              order_id: options.order_id,
              payment_id: payment.razorpay_payment_id,
            },
            {
              headers: {
                authorization: localStorage.getItem("Authorization"),
              },
            }
          )
          .then((response) => {
            alert("You are a premium user");
            localStorage.setItem("Authorization", response.data.token);
            updateLinks();
          });
      },
    };
    const rzp = new Razorpay(options);
    rzp.open();
    e.preventDefault();

    rzp.on("payment.failed", function (payment) {
      alert("Payment unsuccessful");
    });
  } catch (error) {
    console.log("Error:", error);
  }
}

function signOut() {
  localStorage.clear();
  location.href = "../index.html";
}

function updateLinks() {
  const token = localStorage.getItem("Authorization");
  const tokenData = parseJwt(token);
  const membership = tokenData.isPremium;
  premiumBtn.style.display = membership ? "none" : "block";
  premiumStatus.style.display = membership ? "block" : "none";
  leaderboardBtn.style.display = membership ? "block" : "none";
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
