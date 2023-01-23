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
const dailyPrevPageBtn = document.querySelector(".daily-previous");
const dailyNextPageBtn = document.querySelector(".daily-next");
const dailyPrevPageNoBtn = document.querySelector(".daily-prev-page");
const dailyCurrPageNoBtn = document.querySelector(".daily-curr-page");
const dailyNextPageNoBtn = document.querySelector(".daily-next-page");
const dailyLastPageNoBtn = document.querySelector(".daily-last-page");
const monthlyPrevPageBtn = document.querySelector(".monthly-previous");
const monthlyNextPageBtn = document.querySelector(".monthly-next");
const monthlyPrevPageNoBtn = document.querySelector(".monthly-prev-page");
const monthlyCurrPageNoBtn = document.querySelector(".monthly-curr-page");
const monthlyNextPageNoBtn = document.querySelector(".monthly-next-page");
const monthlyLastPageNoBtn = document.querySelector(".monthly-last-page");
const dailyTableTitle = document.getElementById("daily-title");
const monthlyTableTitle = document.getElementById("monthly-title");
const downloadReportBtn = document.getElementById("download-report");

let dailyExpenseTable, monthlyExpenseTable, yearlyExpenseTable;
let expenseList, dailyExpenseList, monthlyExpenseList;
let dailyPageNumber = 1;
let monthlyPageNumber = 1;

window.addEventListener("DOMContentLoaded", listAllExpenses);
window.addEventListener("DOMContentLoaded", getPagination);
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

//daily table data listing
async function dailyDateList(startDate, endDate) {
  let dailyTotalExp = 0;
  dailyExpenseTable = document.getElementById("daily-expense-list-table");
  dailyExpenseTable.innerHTML = "";
  try {
    const response = await axios.get(
      `http://localhost:3000/getExpenseList/${startDate}/${endDate}`,
      {
        params: {
          pageSize: dailyPageSizeSelect.value,
          page: dailyPageNumber,
        },
        headers: {
          authorization: localStorage.getItem("Authorization"),
        },
      }
    );
    const dailyData = response.data.expenseList;
    datewiseListing(
      dailyData,
      dailyExpenseTable,
      dailyTotalExp,
      dailyTotalExpenseVal
    );
    if (response.data.hasPrevPage) {
      dailyPrevPageBtn.innerHTML = `<a onclick="goToDailyPage(${response.data.prevPage})" class="page-link" href="#daily-title" aria-label="Previous">
    <span aria-hidden="true">&laquo;</span>
  </a>`;
    } else {
      dailyPrevPageBtn.innerHTML = `<a class="page-link disabled" href="#" aria-label="Previous">
      <span aria-hidden="true">&laquo;</span>
    </a>`;
    }
    if (response.data.hasPrevPage) {
      dailyPrevPageNoBtn.style.display = "block";
      dailyPrevPageNoBtn.innerHTML = `<a onclick="goToDailyPage(${response.data.prevPage})" class="page-link" href="#daily-title">${response.data.prevPage}</a>`;
    } else {
      dailyPrevPageNoBtn.style.display = "none";
    }
    dailyCurrPageNoBtn.innerHTML = `<a class="page-link active" href="#">${response.data.currentPage}</a>`;
    if (
      response.data.nextPage != response.data.lastPage &&
      response.data.hasNextPage
    ) {
      dailyNextPageNoBtn.style.display = "block";
      dailyNextPageNoBtn.innerHTML = `<a onclick="goToDailyPage(${response.data.nextPage})" class="page-link" href="#daily-title">${response.data.nextPage}</a>`;
    } else {
      dailyNextPageNoBtn.style.display = "none";
    }
    if (response.data.lastPage != dailyPageNumber) {
      dailyLastPageNoBtn.style.display = "block";
      dailyLastPageNoBtn.innerHTML = `<a onclick="goToDailyPage(${response.data.lastPage})" class="page-link" href="#daily-title">${response.data.lastPage}</a>`;
    } else {
      dailyLastPageNoBtn.style.display = "none";
    }
    if (response.data.hasNextPage) {
      dailyNextPageBtn.innerHTML = `<a onclick="goToDailyPage(${response.data.nextPage})" class="page-link" href="#daily-title" aria-label="Next">
      <span aria-hidden="true">&raquo;</span>
    </a>`;
    } else {
      dailyNextPageBtn.innerHTML = `<a class="page-link disabled" href="#" aria-label="Next">
      <span aria-hidden="true">&raquo;</span>
    </a>`;
    }
  } catch (error) {
    console.log("Error:", error);
  }
}

//monthly table data listing
async function monthlyDateList(startDate, endDate) {
  let monthlyTotalExp = 0;
  monthlyExpenseTable = document.getElementById("monthly-expense-list-table");
  monthlyExpenseTable.innerHTML = "";
  const response = await axios.get(
    `http://localhost:3000/getExpenseList/${startDate}/${endDate}`,
    {
      params: {
        pageSize: monthlyPageSizeSelect.value,
        page: monthlyPageNumber,
      },
      headers: {
        authorization: localStorage.getItem("Authorization"),
      },
    }
  );
  const monthlyData = response.data.expenseList;
  datewiseListing(
    monthlyData,
    monthlyExpenseTable,
    monthlyTotalExp,
    monthlyTotalExpenseVal
  );
  if (response.data.hasPrevPage) {
    monthlyPrevPageBtn.innerHTML = `<a onclick="goToMonthlyPage(${response.data.prevPage})" class="page-link" href="#monthly-title" aria-label="Previous">
  <span aria-hidden="true">&laquo;</span>
</a>`;
  } else {
    monthlyPrevPageBtn.innerHTML = `<a class="page-link disabled" href="#" aria-label="Previous">
    <span aria-hidden="true">&laquo;</span>
  </a>`;
  }
  if (response.data.hasPrevPage) {
    monthlyPrevPageNoBtn.style.display = "block";
    monthlyPrevPageNoBtn.innerHTML = `<a onclick="goToMonthlyPage(${response.data.prevPage})" class="page-link" href="#monthly-title">${response.data.prevPage}</a>`;
  } else {
    monthlyPrevPageNoBtn.style.display = "none";
  }
  monthlyCurrPageNoBtn.innerHTML = `<a class="page-link active" href="#">${response.data.currentPage}</a>`;
  if (
    response.data.nextPage != response.data.lastPage &&
    response.data.hasNextPage
  ) {
    monthlyNextPageNoBtn.style.display = "block";
    monthlyNextPageNoBtn.innerHTML = `<a onclick="goToMonthlyPage(${response.data.nextPage})" class="page-link" href="#monthly-title">${response.data.nextPage}</a>`;
  } else {
    monthlyNextPageNoBtn.style.display = "none";
  }
  if (response.data.lastPage != monthlyPageNumber) {
    monthlyLastPageNoBtn.style.display = "block";
    monthlyLastPageNoBtn.innerHTML = `<a onclick="goToMonthlyPage(${response.data.lastPage})" class="page-link" href="#monthly-title">${response.data.lastPage}</a>`;
  } else {
    monthlyLastPageNoBtn.style.display = "none";
  }
  if (response.data.hasNextPage) {
    monthlyNextPageBtn.innerHTML = `<a onclick="goToMonthlyPage(${response.data.nextPage})" class="page-link" href="#monthly-title" aria-label="Next">
    <span aria-hidden="true">&raquo;</span>
  </a>`;
  } else {
    monthlyNextPageBtn.innerHTML = `<a class="page-link disabled" href="#" aria-label="Next">
    <span aria-hidden="true">&raquo;</span>
  </a>`;
  }
}

async function listAllExpenses() {
  try {
    //current date,month,year
    const date = new Date(),
      m = date.getMonth(),
      y = date.getFullYear();

    //current day midnight and next day midnight
    let nextDateM = new Date(new Date().setDate(new Date().getDate() + 1));
    nextDateM.setHours(0, 0, 0, 0);
    let currDateM = date;
    currDateM.setHours(0, 0, 0, 0);

    //first day of current year and next year
    const currentYear = new Date().getFullYear();
    const firstDayCY = new Date(currentYear, 0, 1);
    const firstDayNY = new Date(currentYear + 1, 0, 1);

    //daily data listing function call
    dailyDateList(currDateM, nextDateM);

    //monthly data listing function call
    monthlyDateList(new Date(y, m, 1), new Date(y, m + 1, 0));

    //yearly data listing function call
    yearlyListing(firstDayCY, firstDayNY);

    updateLinks();
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
  expenseList.forEach((expense) => {
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
async function yearlyListing(startDate, endDate) {
  let yearlyMonthTotalExp = 0;
  yearlyExpenseTable = document.getElementById("yearly-expense-list-table");
  yearlyExpenseTable.innerHTML = "";
  const response = await axios.get(
    `http://localhost:3000/getExpenseList/${startDate}/${endDate}`,
    {
      // params: {
      //   pageSize: 2,
      //   page: 1,
      // },
      headers: {
        authorization: localStorage.getItem("Authorization"),
      },
    }
  );
  const yearlyData = response.data.expenseList;
  yearlyData.forEach((expense) => {
    if (new Date().getFullYear() == new Date(expense.createdAt).getFullYear()) {
      let month = new Date(expense.createdAt).toLocaleDateString("default", {
        month: "long",
      });
      let yearlyMonthTotalExpense = document.getElementById(month);
      if (!yearlyMonthTotalExpense) {
        yearlyExpenseTable.innerHTML += `<tr>
        <td>${month}</td>
        <td id="${month}">${expense.amount}</td>
        </tr>`;
      }
      yearlyMonthTotalExpense = document.getElementById(month);
      yearlyMonthTotalExp += parseInt(expense.amount);
      yearlyMonthTotalExpense.innerHTML = yearlyMonthTotalExp;
    }
  });
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
      let a = document.createElement("a");
      a.href = response.data.fileUrl;
      a.download = "myexpense.csv";
      a.click();
    }
  } catch (error) {
    console.log("Error downloading report:", error);
  }
}

function goToDailyPage(pageNumber) {
  dailyPageNumber = pageNumber;
  listAllExpenses();
}

function goToMonthlyPage(pageNumber) {
  monthlyPageNumber = pageNumber;
  listAllExpenses();
}

function pageSizeChange(e) {
  const pageSizes = {
    dailyPageSize: dailyPageSizeSelect.value,
    monthlyPageSize: monthlyPageSizeSelect.value,
  };
  localStorage.setItem("Page size", JSON.stringify(pageSizes));
  updatePageSizes(dailyPageSizeSelect.value, monthlyPageSizeSelect.value);
  if (e.target.id == "daily-page-size") dailyTableTitle.scrollIntoView();
  else monthlyTableTitle.scrollIntoView();
}

function getPagination() {
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
