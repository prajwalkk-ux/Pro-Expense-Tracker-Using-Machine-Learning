// REGISTER FUNCTION
function register() {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Please fill all fields");
        return;
    }

    // Get existing users
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if user already exists
    const exists = users.find(u => u.username === username);

    if (exists) {
        alert("User already exists");
        return;
    }

    // Add new user
    users.push({ username, password });

    // Save
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful!");

    // Redirect to login
    window.location.href = "login.html";
}


// LOGIN FUNCTION
function login() {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Please fill all fields");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Validate user
    const user = users.find(u =>
        u.username === username && u.password === password
    );

    if (!user) {
        alert("Invalid username or password");
        return;
    }

    // Save logged in user
    localStorage.setItem("loggedInUser", username);

    alert("Login successful!");

    // Redirect to dashboard
    window.location.href = "index.html";
}