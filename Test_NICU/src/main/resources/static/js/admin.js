/**
 * Script om nieuwe studies aan te maken als Admin. Mogelijkheid om zelf een studienaam te kiezen en te kiezen welke
 * soorten doorlooptijden er zijn voor deze studie. Vervolgens wordt er automatisch een gebruikersnaam en wachtwoord
 * aangemaakt voor deze studie.
 * @author Anne Beumer
 * @version 1.3, 17-05-2025
 * @since 15-05-2025
 * */


document.getElementById('nieuwStudieForm').addEventListener('submit', async function(e){
    e.preventDefault();

    const studienaam = document.getElementById('naamNieuweStudie').value.trim();
    const doorlooptijdCheckboxen = document.querySelectorAll('input[name="doorlooptijden"]:checked');
    const doorlooptijden = Array.from(doorlooptijdCheckboxen).map(cb => cb.value.toLowerCase());

    const doorlooptijdJuridisch = doorlooptijden.includes('juridisch');
    const doorlooptijdApotheek = doorlooptijden.includes('apotheek');
    const doorlooptijdMetc = doorlooptijden.includes('metc');
    const doorlooptijdLaboratorium = doorlooptijden.includes('laboratorium');

    const payload = {
        studieNaam: studienaam,
        doorlooptijdJuridisch,
        doorlooptijdApotheek,
        doorlooptijdMetc,
        doorlooptijdLaboratorium
    };

    try{
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(payload)
        });

        if(response.status === 409){
            const foutmelding = await response.text();
            alert("Fout:" + foutmelding);
            return;
        }

        if(!response.ok) {throw new Error("Gebruiker kon niet worden aangemaakt.");}
        const data = await response.json();
        document.getElementById('popupMessage').innerHTML = `Nieuwe studiegebruiker aangemaakt<br><br>
Gebruikersnaam: <strong>${data.username}</strong> <br>
\nWachtwoord: <strong>${data.password}</strong>`;
        document.getElementById('popup').style.display = 'flex';
        document.getElementById('popupCloseButton').addEventListener('click', function(){
            document.getElementById('popup').style.display = 'none';
        });
        this.reset();
    } catch(err){
        alert("Fout: " + err.message);
    }
});
