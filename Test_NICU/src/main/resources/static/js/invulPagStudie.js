document.addEventListener('DOMContentLoaded', async function(){
    const studieSelectie = document.getElementById('studieSelectie');
    try{
        const response = await fetch('/api/user');
        if(!response.ok) throw new Error("Kon gebruikersinformatie niet ophalen");

        const gebruiker = await response.json();
        const role = gebruiker.role;
        const username = gebruiker.username;

        if(role === 'ROLE_ADMIN'){
            document.getElementById('studieSelectie').style.display = 'block';
            const studiesResultaten = await fetch('/api/user-studies');
            if(!studiesResultaten.ok) {throw new Error("Kon studies niet ophalen.")}
            const studies = await studiesResultaten.json();
            for(const s of studies){
                const optie = document.createElement('option')
                optie.value = s;
                optie.textContent = s;
                studieSelectie.appendChild(optie);
            }
        }else if(role === 'ROLE_STUDIE'){
            document.getElementById('studieSelectie').style.display = 'none';
            document.getElementById('naamStudieLabel').style.display = 'none';
            studieSelectie.removeAttribute('required');

            const studieResultaten = await fetch('/api/user/studienaam');
            if(!studieResultaten.ok) throw new Error("Kon studienaamniet ophalen.")
            const{juridisch, apotheek, metc, laboratorium} = await studieResultaten.json();
            if(!juridisch) document.getElementById('juridischeFase').style.display = 'none';
            if(!apotheek) document.getElementById('apotheekFase').style.display = 'none';
            if(!metc) document.getElementById('metcFase').style.display = 'none';
            if(!laboratorium) document.getElementById('laboratoriumFase').style.display = 'none';


        }
    }catch(err){
        console.error("Fout bij ophalen van studies: ", err);
        alert("Fout bij ophalen van studie gegevens: " + err.message);
    }
})

document.getElementById('studieForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    var formData = {
        centrum : document.getElementById('centrumSelectie').value,
        studie : document.getElementById('studieSelectie').value,
        startdatum : document.getElementById('start').value,
        initiatiedatum : document.getElementById('initiatie').value,
        juridisch_start : document.getElementById('juridisch_start').value,
        juridisch_eind : document.getElementById('juridisch_eind').value,
        apotheek_start : document.getElementById('apotheek_start').value,
        apotheek_eind : document.getElementById('apotheek_eind').value,
        metc_start : document.getElementById('metc_start').value,
        metc_eind : document.getElementById('metc_eind').value,
        lab_start : document.getElementById('lab_start').value,
        lab_eind : document.getElementById('lab_eind').value,
        geincludeerde_kinderen : document.getElementById('geincludeerde_kinderen').value,
        opgenomen_kinderen : document.getElementById('opgenomen_kinderen').value,
        reden_weigering : document.getElementById('reden').value
    }

    const datumVelden = ['startdatum_studie','initiatiedatum', 'juridisch_start', 'juridisch_eind', 'apotheek_start', 'apotheek_eind', 'metc_start', 'metc_eind', 'lab_start', 'lab_eind'];
    for(const veld of datumVelden){
        if(!formData[veld]){
            formData[veld] = null;
        }
    }

    formData.geincludeerde_kinderen = parseInt(formData.geincludeerde_kinderen);
    formData.opgenomen_kinderen = parseInt(formData.opgenomen_kinderen);

    try {
        const response = await fetch('http://localhost:8080/api/studie', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(formData)});
        if(!response.ok) throw new Error("Fout bij opslaan...");
        alert("Studiegegevens succesvol opgeslagen!");
        this.reset();
    } catch(err){
        alert("Fout bij opslaan: " + err.message);
    }
});
