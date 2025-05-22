let selectedUser = null;

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
    } catch(error){
        console.error("Fout bij ophalen gebruikkers: ", error);
        alert("er ging iets mis bij het laden van de gebruikers.");
    }
});

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

function openPopup(username, newPassword){
    selectedUser = username;
    document.getElementById("resetPasswordUsername").innerText = `Voor: ${username}`;
    document.getElementById("generatedPassword").innerText = newPassword;
    document.getElementById("resetPassword").style.display = "flex";
}

function closePopup(){
    document.getElementById("resetPassword").style.display = "none";
    document.getElementById("resetPasswordUsername").innerText = "";
    document.getElementById("generatedPassword").innerText = "";
}

function translateRole(role){
    switch (role){
        case "ROLE_STUDIE": return "Studie";
        case "ROLE_PROTOCOLMAKER" : return "Protocolmaker";
        case "ROLE_ALGEMEEN" : return "Algemeen";
        case "ROLE_ADMIN" : return "Admin";
        default: return role;
    }
}