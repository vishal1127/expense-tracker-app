window.addEventListener("DOMContentLoaded", getLeaderboard);
const leaderboardList = document.getElementById("leaderboard-list");
const userName = document.querySelector(".UserName");
const premiumStatus = document.getElementById("premium-status");
const signOutBtn = document.getElementById("signout-btn");

signOutBtn.addEventListener("click", signOut);

const userDetails = JSON.parse(localStorage.getItem("User Details"));
userName.innerHTML = `<p style="margin:0px">${userDetails.name}</p>`;

async function getLeaderboard() {
  updateLinks();
  try {
    leaderboardList.innerHTML = "";
    const response = await axios.get("http://localhost:3000/getLeaderboard", {
      headers: {
        authorization: localStorage.getItem("Authorization"),
      },
    });
    console.log("response leaderboard", response);
    response.data.leaderboardList.sort((a, b) => {
      return b.totalExpense - a.totalExpense;
    });
    for (listData of response.data.leaderboardList) {
      console.log(listData);
      leaderboardList.innerHTML += `<li class="list-group-item list-group-item-dark">Name: ${listData.name} Total Expense: ${listData.totalExpense}</li>`;
    }
  } catch (error) {
    console.log("error during fetching leaderboard", error);
  }
}

function updateLinks() {
  const userDetails = JSON.parse(localStorage.getItem("User Details"));
  if (userDetails) {
    premiumStatus.style.display =
      userDetails.subscribtion == "Free" ? "none" : "block";
  }
}

function signOut() {
  localStorage.clear();
  location.href = "../index.html";
}
