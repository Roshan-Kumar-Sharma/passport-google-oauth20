function goToLoginPage() {
    location.href = location.origin + "/login";
}

function goToRegisterPage() {
    location.href = location.origin + "/register";
}

async function googleLogin() {
    location.href = location.origin + "/auth/google?type=login";
}

function googleRegister() {
    location.href = location.origin + "/auth/google?type=register";
}

function callMe() {
    console.log("index.js");
}
