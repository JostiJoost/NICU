/**
 * Script wat het mogelijk maakt voor de gebruiker om wachtwoorden van accounts te resetten
 * @author Anne Beumer
 * @version 1.0, 22-05-2025
 * @since 22-05-2025
 * */

let selectedUser = null;

/**
 * Script wat alle huidige gebruikers ophaalt
 * */
document.addEventListener("DOMContentLoaded", async () => {
    try{
        const response = await fetch("/api/users",{
            method: "GET"
        });

        if(!response.ok){
            throw new Error("Gebruikers konden niet worden opgehaald.");
        }

        const users = await response.json();
        const userList = document.getElementById("userList");

        users.forEach(user => {
            const userBlock = document.createElement("div");
            userBlock.classList.add("user-row");
            userBlock.style.display = "flex";
            userBlock.style.justifyContent = "space-between";
            userBlock.style.alignItems = "center";
            userBlock.style.padding = "1rem 0";
            userBlock.style.borderBottom = "1px solid #ccc";
            userBlock.innerHTML = `
    <p><strong>${user.username}</strong> (${translateRole(user.role)})</p>
    <button onclick="resetPassword('${user.username}')">Reset wachtwoord</button>`;

            userList.appendChild(userBlock);
        });

        let resetPopupBevestigd = false;

        document.getElementById("resetPasswordCloseButton").addEventListener("click", function () {
            if (!resetPopupBevestigd) {
                alert("Let op: Het nieuwe wachtwoord is slechts eenmalig zichtbaar. Schrijf het ergens op voordat je sluit.");
                resetPopupBevestigd = true;
                return;
            }
            closePopup();
            resetPopupBevestigd = false;
        });

    } catch(error){
        console.error("Fout bij ophalen gebruikkers: ", error);
        alert("er ging iets mis bij het laden van de gebruikers.");
    }
});

/**
 * Functie die een nieuw wachtwoord genereerd
 * @param username - De gebruikersnaam waarvan het wachtwoord moet worden gereset
 * */
async function resetPassword(username){
    if(!confirm(`Weet u zeker dat u een nieuw wachtwoord wilt aanvragen voor ${username}?`)){
        return;
    }
    try{
        const response = await fetch(`/api/users/reset-password/${username}`,{
            method: "PUT"
        });

        if(!response.ok){
            throw new Error("Wachtwoord kon niet worden gereset.");
        }

        const result = await response.json();
        openPopup(username, result.newPassword);
    } catch (error){
        console.error("Fout bj wachtwoord resetten: ", error);
        alert("er ging iets mis bij het resetten van het wachtwoord.");
    }
}

/**
 * Functie die een pop up toont met het nieuwe wachtwoord
 * @param username - De gebruikersnaam van het account met een nieuw wachtwoord
 * @param newPassword - Het nieuwe wachtwoord
 * */
function openPopup(username, newPassword){
    selectedUser = username;
    document.getElementById("resetPasswordUsername").innerText = `Voor: ${username}`;
    document.getElementById("generatedPassword").innerText = newPassword;
    document.getElementById("resetPassword").style.display = "flex";
}

/**
 * Functie wat de pop up van het nieuwe wachtwoord weer sluit
 * */
function closePopup(){
    document.getElementById("resetPassword").style.display = "none";
    document.getElementById("resetPasswordUsername").innerText = "";
    document.getElementById("generatedPassword").innerText = "";
}

/**
 * Functie die de rol van de gebruiker terug geeft
 * @param role - De rol van de gebruiker
 * @returns - De rul in een tekst format
 * */
function translateRole(role){
    switch (role){
        case "ROLE_STUDIE": return "Studie";
        case "ROLE_PROTOCOLMAKER" : return "Protocolmaker";
        case "ROLE_ALGEMEEN" : return "Algemeen";
        case "ROLE_ADMIN" : return "Admin";
        default: return role;
    }
}
