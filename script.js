const APP_ID = "70074"; // Replace with your Deriv App ID
const API_URL = "wss://ws.deriv.com/websockets/v3";
const REDIRECT_URL = "https://your-username.github.io/deriv-wallet/callback.html"; // Update with your GitHub Pages URL

let userDetails = document.getElementById("userDetails");
let userInfo = document.getElementById("userInfo");
let loginBtn = document.getElementById("loginBtn");
let logoutBtn = document.getElementById("logoutBtn");

const authToken = localStorage.getItem("deriv_token");

if (authToken) {
    let ws = new WebSocket(API_URL);

    ws.onopen = () => {
        ws.send(JSON.stringify({ authorize: authToken }));
    };

    ws.onmessage = (event) => {
        let data = JSON.parse(event.data);

        if (data.msg_type === "authorize") {
            let user = data.authorize;

            userInfo.innerHTML = `
                <p><strong>Name:</strong> ${user.full_name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Balance:</strong> $${user.balance}</p>
                <p><strong>Country:</strong> ${user.country}</p>
                <p><strong>Account Type:</strong> ${user.account_list[0].account_type}</p>
            `;

            userDetails.style.display = "block";
            loginBtn.style.display = "none";
            logoutBtn.style.display = "block";
        }
    };

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("deriv_token");
        window.location.reload();
    });
} else {
    loginBtn.addEventListener("click", () => {
        window.location.href = `https://oauth.deriv.com/oauth2/authorize?app_id=${APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URL)}`;
    });
}
