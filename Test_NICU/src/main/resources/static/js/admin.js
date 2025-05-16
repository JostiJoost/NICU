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
        document.getElementById('resultaatUsername').textContent = data.username;
        document.getElementById('resultaatPassword').textContent = data.password;
        document.getElementById('gegevensMelding').style.display = 'block';
        this.reset();
    } catch(err){
        alert("Fout: " + err.message);
    }
});
