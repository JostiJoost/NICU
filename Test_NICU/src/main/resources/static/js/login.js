document.addEventListener("DOMContentLoaded", function (){
    const togglePassword = document.getElementById("togglePassword");
    const password = document.getElementById("password");

    togglePassword.addEventListener("click", function (){
        const isVisible = password.type == "text";
        password.type = isVisible ? "password" : "text";
        togglePassword.textContent = isVisible ? "Toon wachtwoord" : "Verberg wachtwoord";
    });
});