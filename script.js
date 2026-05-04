// LOAD THEME
const theme = localStorage.getItem("theme");

if (theme === "dark") {
    document.body.classList.add("dark");
}
// CHECK LOGIN
const user = localStorage.getItem("loggedInUser");

if (!user) {
    window.location.href = "login.html";
}

// USER-WISE STORAGE
let transactions = JSON.parse(localStorage.getItem(user + "_transactions")) || [];
let budget = localStorage.getItem(user + "_budget") || 0;

let pieChart, barChart;

// ADD TRANSACTION
function addTransaction() {

    const text = document.getElementById("text").value;
    const amount = document.getElementById("amount").value;
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    if (!text || !amount || !date) return;

    transactions.push({
        id: Date.now(),
        text,
        amount: +amount,
        type,
        category,
        date
    });

    updateLocalStorage();
    updateUI();
}

function deleteTransaction(id) {

    const item = document.querySelector(`button[onclick="deleteTransaction(${id})"]`).closest("li");

    item.style.transition = "0.3s";
    item.style.opacity = "0";
    item.style.transform = "translateX(50px)";

    setTimeout(() => {
        transactions = transactions.filter(t => t.id !== id);
        updateLocalStorage();
        updateUI();
    }, 300);
}

// CLEAR ALL
function clearAll() {
    localStorage.removeItem(user + "_transactions");
    transactions = [];
    updateUI();
}

// LOGOUT
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}

// SET BUDGET
function setBudget() {
    const value = document.getElementById("budgetInput").value;
    if (!value) return;

    budget = value;
    localStorage.setItem(user + "_budget", budget);
    updateUI();
}

// UPDATE UI
function updateUI() {

    const list = document.getElementById("list");
    list.innerHTML = "";

    let income = 0, expense = 0;
    let categoryData = {};

    transactions.forEach(t => {

        const li = document.createElement("li");
        li.classList.add(t.type);

        li.innerHTML = `
            <span>
                <b>${t.text}</b><br>
                <small>${t.category} • ${t.date}</small>
            </span>
            <span>
                ₹${t.amount}
                <button onclick="deleteTransaction(${t.id})">❌</button>
            </span>
        `;

        list.appendChild(li);

        if (t.type === "income") income += t.amount;
        else {
            expense += t.amount;
            categoryData[t.category] = (categoryData[t.category] || 0) + t.amount;
        }
    });

    // UPDATE SUMMARY
    document.getElementById("balance").innerText = income - expense;
    document.getElementById("income").innerText = income;
    document.getElementById("expense").innerText = expense;

        updateCharts(categoryData);
}

// CHARTS
function updateCharts(data) {

    const labels = Object.keys(data);
    const values = Object.values(data);

    if (pieChart) pieChart.destroy();
    if (barChart) barChart.destroy();

    pieChart = new Chart(document.getElementById("pieChart"), {
        type: "doughnut",
        data: { labels, datasets: [{ data: values }] }
    });

    barChart = new Chart(document.getElementById("barChart"), {
        type: "bar",
        data: { labels, datasets: [{ data: values }] }
    });
}

// STORAGE
function updateLocalStorage() {
    localStorage.setItem(user + "_transactions", JSON.stringify(transactions));
}
// DARK MODE TOGGLE
function toggleDarkMode() {

    document.body.classList.toggle("dark");

    // save preference
    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
}

// ML PREDICTION
function getPrediction() {

    const days = document.getElementById("days").value;

    if (!days) return;

    fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ days: parseInt(days) })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("prediction").innerText =
            "Predicted Expense: ₹" + data.prediction.toFixed(2);
    });
}

// INIT
updateUI();