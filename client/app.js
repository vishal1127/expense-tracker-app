// const expenseModal = new bootstrap.Modal("#expenseModal", {
//   keyboard: false,
// });
// console.log("bootstrap", bootstrap);

// import "bootstrap";
const expenseModal = document.querySelector("#expenseModal");
const userName = document.querySelector(".UserName");
const addExpenseBtn = document.getElementById("add-expense");
const amountField = document.getElementById("amount-text");
const categoryField = document.getElementById("category-text");
const descriptionField = document.getElementById("description-text");
let expenseTable;
let expenseList;
window.addEventListener("DOMContentLoaded", listAllExpenses);
addExpenseBtn.addEventListener("click", addExpense);

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
      console.log("error fe", error);
    }
  }
}

async function listAllExpenses() {
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
  console.log("expense delete btn clicked ith id", id);
  const deletedExpense = await axios.delete(
    `http://localhost:3000/deleteExpense/${id}`,
    {
      headers: {
        authorization: localStorage.getItem("Authorization"),
      },
    }
  );
  if (deletedExpense) {
    console.log("Expense deleted");
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

function hideeModal() {
  expenseModal.modal("hide");
}
