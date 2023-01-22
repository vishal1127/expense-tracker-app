// $("#expenseModal").modal("show");
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
const downloadsBtn = document.getElementById("downloads-btn");
const dailyTotalExpenseVal = document.getElementById("daily-total-expenditure");
const monthlyTotalExpenseVal = document.getElementById(
  "monthly-total-expenditure"
);
const dailyPageSizeSelect = document.getElementById("daily-page-size");
dailyPageSizeSelect.addEventListener("change", pageSizeChange);
const monthlyPageSizeSelect = document.getElementById("monthly-page-size");
monthlyPageSizeSelect.addEventListener("change", pageSizeChange);
const downloadReportBtn = document.getElementById("download-report");

let dailyExpenseTable, monthlyExpenseTable, yearlyExpenseTable;
let expenseList, dailyExpenseList, monthlyExpenseList;

window.addEventListener("DOMContentLoaded", listAllExpenses);
window.addEventListener("DOMContentLoaded", getPageSizes);
addExpenseBtn.addEventListener("click", addExpense);
premiumBtn.addEventListener("click", buyPremium);
signOutBtn.addEventListener("click", signOut);
downloadReportBtn.addEventListener("click", downloadReport);

const userDetails = JSON.parse(localStorage.getItem("User Details"));
let editId = 0;

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
      if (!editId) {
        const result = await axios.post(
          "http://localhost:3000/addExpense",
          expenseData,
          {
            headers: {
              authorization: localStorage.getItem("Authorization"),
            },
          }
        );
      } else {
        const response = await axios.post(
          `http://localhost:3000/updateExpense/${editId}`,
          expenseData,
          {
            headers: {
              authorization: localStorage.getItem("Authorization"),
            },
          }
        );
        editId = 0;
      }
      setTimeout(() => {
        listAllExpenses();
      }, 1000);
      amountField.value = "";
      categoryField.value = "Groceries";
      descriptionField.value = "";
      hideModal();
    } catch (error) {
      console.log("Error:", error);
    }
  }
}
// daily table pagination
let dailyPageSize = 4;
let dailyCurPage = 1;
document
  .querySelector(".daily-next")
  .addEventListener("click", dailyNextPage, false);
document
  .querySelector(".daily-previous")
  .addEventListener("click", dailyPreviousPage, false);

function dailyPreviousPage() {
  if (dailyCurPage > 1) dailyCurPage--;
  listAllExpenses();
}

function dailyNextPage() {
  if (dailyCurPage * dailyPageSize < dailyExpenseList.length) dailyCurPage++;
  listAllExpenses();
}

// monthly table pagination
let monthlyPageSize = 4;
let monthlyCurPage = 1;
document
  .querySelector(".monthly-next")
  .addEventListener("click", monthlyNextPage, false);
document
  .querySelector(".monthly-previous")
  .addEventListener("click", monthlyPreviousPage, false);

function monthlyPreviousPage() {
  if (monthlyCurPage > 1) monthlyCurPage--;
  listAllExpenses();
}

function monthlyNextPage() {
  if (monthlyCurPage * monthlyPageSize < monthlyExpenseList.length)
    monthlyCurPage++;
  listAllExpenses();
}

async function listAllExpenses() {
  let dailyTotalExp = 0;
  let monthlyTotalExp = 0;
  let yearlyMonthTotalExp = 0;
  try {
    updateLinks();
    expenseList = await axios.get("http://localhost:3000/getExpenseList", {
      headers: {
        authorization: localStorage.getItem("Authorization"),
      },
    });
    dailyExpenseTable = document.getElementById("daily-expense-list-table");
    dailyExpenseTable.innerHTML = "";
    monthlyExpenseTable = document.getElementById("monthly-expense-list-table");
    monthlyExpenseTable.innerHTML = "";
    yearlyExpenseTable = document.getElementById("yearly-expense-list-table");
    yearlyExpenseTable.innerHTML = "";
    //daily listing
    dailyExpenseList = expenseList.data.filter((expense) => {
      if (
        new Date().toLocaleDateString() ==
        new Date(expense.createdAt).toLocaleDateString()
      )
        return expense;
    });
    datewiseListing(
      dailyExpenseList,
      dailyExpenseTable,
      dailyTotalExp,
      dailyTotalExpenseVal,
      dailyCurPage,
      dailyPageSize
    );
    //monthly listing
    monthlyExpenseList = expenseList.data.filter((expense) => {
      if (new Date().getMonth() == new Date(expense.createdAt).getMonth()) {
        return expense;
      }
    });
    datewiseListing(
      monthlyExpenseList,
      monthlyExpenseTable,
      monthlyTotalExp,
      monthlyTotalExpenseVal,
      monthlyCurPage,
      monthlyPageSize
    );
    // dailyExpenseTable.innerHTML = result;

    //yearly listing
    expenseList.data.forEach((expense) => {
      if (
        new Date().getFullYear() == new Date(expense.createdAt).getFullYear()
      ) {
        let month = new Date(expense.createdAt).toLocaleDateString("default", {
          month: "long",
        });
        let yearlyMonthTotalExpense = document.getElementById(month);
        if (!yearlyMonthTotalExpense) {
          yearlyExpenseTable.innerHTML += yearlyListing(month, expense);
        }
        yearlyMonthTotalExpense = document.getElementById(month);
        yearlyMonthTotalExp += parseInt(expense.amount);
        yearlyMonthTotalExpense.innerHTML = yearlyMonthTotalExp;
        // yearlyTotalExp += parseInt(expense.amount);
        // monthlyTotalExpenseVal.innerHTML = yearlyTotalExp;
      }
    });
  } catch (error) {
    console.log("Error:", error);
  }
}

//daily and monthly table listing
function datewiseListing(
  expenseList,
  tableName,
  totalExpVal,
  totalExpValElement,
  curPage,
  pageSize
) {
  let result = "";
  expenseList
    .filter((row, index) => {
      let start = (curPage - 1) * pageSize;
      let end = curPage * pageSize;
      if (index >= start && index < end) return true;
    })
    .forEach((expense) => {
      let date = new Date(expense.createdAt).toLocaleDateString().split("/");
      date = date[1] + "-" + date[0] + "-" + date[2];

      result += `<tr id="${expense.id}">
  <td>${date}</td>
  <td>${expense.description}</td>
  <td>${expense.category}</td>
  <td>${expense.amount}</td>
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
      totalExpVal += parseInt(expense.amount);
      totalExpValElement.innerHTML = totalExpVal;
    });
  tableName.innerHTML = result;
}

//yearly table listing
function yearlyListing(month, expense) {
  return `<tr>
  <td>${month}</td>
  <td id="${month}">${expense.amount}</td>
  </tr>`;
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
  downloadsBtn.style.display = membership ? "block" : "none";
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

async function editExpense(id) {
  console.log("edit clicked with id:", id);
  editId = id;
  const response = await axios.get(`http://localhost:3000/getExpense/${id}`, {
    headers: {
      authorization: localStorage.getItem("Authorization"),
    },
  });
  const expenseData = response.data.expenseData[0];
  amountField.value = expenseData.amount;
  categoryField.value = expenseData.category;
  descriptionField.value = expenseData.description;
  console.log("expense data for edit", expenseData);
  openModal();
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
    setTimeout(() => {
      listAllExpenses();
    }, 1000);
  }
}

async function downloadReport() {
  try {
    const response = await axios.get(
      "http://localhost:3000/expense/downloadAllExpenses",
      {
        headers: {
          authorization: localStorage.getItem("Authorization"),
        },
      }
    );
    if (response) {
      console.log("report downloaded", response.data);
      let a = document.createElement("a");
      a.href = response.data.fileUrl;
      a.download = "myexpense.csv";
      a.click();
    }
  } catch (error) {
    console.log("Error downloading report:", error);
  }
}

function pageSizeChange() {
  const pageSizes = {
    dailyPageSize: dailyPageSizeSelect.value,
    monthlyPageSize: monthlyPageSizeSelect.value,
  };
  localStorage.setItem("Page size", JSON.stringify(pageSizes));
  updatePageSizes(dailyPageSizeSelect.value, monthlyPageSizeSelect.value);
}

function getPageSizes() {
  const allPageSizes = JSON.parse(localStorage.getItem("Page size"));
  if (allPageSizes) {
    dailyPageSizeSelect.value = allPageSizes.dailyPageSize;
    monthlyPageSizeSelect.value = allPageSizes.monthlyPageSize;
    updatePageSizes(allPageSizes.dailyPageSize, allPageSizes.monthlyPageSize);
  }
}

function updatePageSizes(dailyPageSizeVal, monthlyPageSizeVal) {
  dailyPageSize = dailyPageSizeVal;
  monthlyPageSize = monthlyPageSizeVal;
  listAllExpenses();
}
