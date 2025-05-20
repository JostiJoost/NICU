    const params = new URLSearchParams(window.location.search);
    const errorMessage = document.getElementById('error-message');

    if(params.has("error")){
        errorMessage.textContent = "Inloggenmislukt: controlleer je gebruikersnaam en wachtwoord "
        errorMessage.style.display = "block";
    }

document.addEventListener("DOMContentLoaded", function (){
    const togglePassword = document.getElementById("togglePassword");
    const password = document.getElementById("password");

    togglePassword.addEventListener("click", function (){
        const isVisible = password.type == "text";
        password.type = isVisible ? "password" : "text";
        togglePassword.textContent = isVisible ? "Toon wachtwoord" : "Verberg wachtwoord";
    });
});