function goToLoginPage() {
    location.href = location.origin + "/login";
}

function goToRegisterPage() {
    location.href = location.origin + "/register";
}

async function googleLogin() {
    location.href = location.origin + "/auth/google/login";
}

function googleRegister() {
    location.href = location.origin + "/auth/google/register";
}

function logout() {
    location.href = location.origin + "/logout";
}

function callMe() {
    console.log("index.js");
}
