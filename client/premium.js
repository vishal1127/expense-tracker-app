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
    for (listData of response.data.leaderboardList) {
      console.log(listData);
      leaderboardList.innerHTML += `<li class="list-group-item list-group-item-dark">Name: ${
        listData.name
      } Total Expense: ${listData.totalAmount ? listData.totalAmount : 0}</li>`;
    }
  } catch (error) {
    console.log("error during fetching leaderboard", error);
  }
}

function updateLinks() {
  const token = localStorage.getItem("Authorization");
  const tokenData = parseJwt(token);
  const membership = tokenData.isPremium;
  premiumStatus.style.display = membership ? "block" : "none";
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

function signOut() {
  localStorage.clear();
  location.href = "../index.html";
}
