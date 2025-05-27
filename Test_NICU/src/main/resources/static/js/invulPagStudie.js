/**
 * Het script waarmee de studie gegevens kunnen worden ingevuld. Daarnaast worden de reeds ingevulde gegevens getoond
 * @author Anne Beumer
 * @version 1.5, 24-05-2025
 * @since 14-05-2025
 * */

/**
 * Script wat aan de hand van rollen en rechten de juiste velden aan de gebruiker toont in het formulier
 * */
document.addEventListener('DOMContentLoaded', async function(){
    const studieSelectie = document.getElementById('studieSelectie');
    const centrumSelectie = document.getElementById('centrumSelectie');
    try{
        const response = await fetch('/api/user');
        if(!response.ok) throw new Error("Kon gebruikersinformatie niet ophalen");
        const gebruiker = await response.json();
        const role = gebruiker.role;
        window.ingelogdeStudie = gebruiker.studie;
        console.log("Ingelogde studie: ", gebruiker.studie);

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
            studieSelectie.addEventListener("change", updateFormVelden);
            centrumSelectie.addEventListener("change", updateFormVelden);

        }else if(role === 'ROLE_STUDIE'){
            document.getElementById('studieSelectie').style.display = 'none';
            document.getElementById('naamStudieLabel').style.display = 'none';
            studieSelectie.removeAttribute('required');

            const studieResultaten = await fetch('/api/user/studienaam');
            if(!studieResultaten.ok) throw new Error("Kon studienaamniet ophalen.")
            const{juridisch, apotheek, metc, laboratorium} = await studieResultaten.json();

            toggleFase('juridischeFase', juridisch);
            toggleFase('apotheekFase', apotheek);
            toggleFase('metcFase', metc);
            toggleFase('laboratoriumFase', laboratorium);

            centrumSelectie.addEventListener("change", function (){
                updateFormVelden({studieNaam: gebruiker.studie, vanuitStudie: true});
            });

        }
    }catch(err){
        console.error("Fout bij ophalen van studies: ", err);
        alert("Fout bij ophalen van studie gegevens: " + err.message);
    }

    function toggleFase(id, zichtbaar){
        document.getElementById(id).style.display = zichtbaar ? 'block' : 'none';
    }

    /**
     * Functie die het formulier vult met data die al in de database stond
     * @param studieNaam - De naam van de studie waarvoor het formulier wordt ingevuld
     * */
    async function updateFormVelden({studieNaam = null, vanuitStudie = false} ={}){
        try{
            if(!studieNaam) studieNaam = studieSelectie.value;
            const centrumNaam = centrumSelectie.value;
            if(!studieNaam || !centrumNaam) return;

            console.log("Fetch voo studie:", studieNaam, "en centrum:", centrumNaam);
            const fasenResponse = await fetch(`/api/studie-fasen?studie=${encodeURIComponent(studieNaam)}`);
            if(!fasenResponse.ok){throw new Error("Fout bij ophalen fasen")};
            const{juridisch, apotheek, metc, laboratorium} = await fasenResponse.json();

            toggleFase('juridischeFase', juridisch);
            toggleFase('apotheekFase', apotheek);
            toggleFase('metcFase', metc);
            toggleFase('laboratoriumFase', laboratorium);

            const response = await fetch(`/api/studie/laatste/${studieNaam}/${centrumNaam}`);
            if(response.ok){
                const inclusieResp = await fetch(`/api/aantal_geincludeerd/aantal_geincludeerd/${studieNaam}/${centrumNaam}`);
                if (inclusieResp.ok) {
                    const inclusie = await inclusieResp.json();
                    setFieldValue('geincludeerde_kinderen', inclusie.geincludeerd);
                    setFieldValue('inclusie_datum', inclusie.datum);
                }

                const data = await response.json();
                setFieldValue('start', data.startdatum);
                setFieldValue('initiatie', data.initiatiedatum);
                setFieldValue('juridisch_start', data.juridisch_start);
                setFieldValue('juridisch_eind', data.juridisch_eind);
                setFieldValue('apotheek_start', data.apotheek_start);
                setFieldValue('apotheek_eind', data.apotheek_eind);
                setFieldValue('metc_start', data.metc_start);
                setFieldValue('metc_eind', data.metc_eind);
                setFieldValue('lab_start', data.lab_start);
                setFieldValue('lab_eind', data.lab_eind);
                setFieldValue('inclusie_datum', data.inclusie_datum);
                setFieldValue('opgenomen_kinderen', data.opgenomen_kinderen);
                setFieldValue('reden', data.reden_weigering);
            }

        } catch(err){
            console.error("Fout bij inladen formuliergegevens: ", err);
            alert("Fout bij laden van bestaande studie gegevens.");
        }
    }

    /**
     * Functie die de waarde van een HTML item aanpast
     * @param id - Het HTML id van de aan te passen waarde
     * @param value - De waarde waarnaar het HTML item moet worden aangepast
     * */
    function setFieldValue(id, value){
        if(value !== null && value !== undefined){
            document.getElementById(id).value = value;
        }
    }
});

/**
 * Script om de database up te daten met data uit het formulier nadat deze is ingevuld
 * */
document.getElementById('studieForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const form = document.getElementById("studieForm");

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const inclusie_datum = document.getElementById('inclusie_datum').value;

    var formData = {
        centrum : document.getElementById('centrumSelectie').value,
        studie : document.getElementById('studieSelectie').value || window.ingelogdeStudie,
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
        inclusie_datum : inclusie_datum,
        opgenomen_kinderen : document.getElementById('opgenomen_kinderen').value,
        reden_weigering : document.getElementById('reden').value
    };
    formData.geincludeerde_kinderen = parseInt(formData.geincludeerde_kinderen);
    formData.opgenomen_kinderen = parseInt(formData.opgenomen_kinderen);
    if(isNaN(formData.geincludeerde_kinderen)) formData.geincludeerde_kinderen = null;
    if(isNaN(formData.opgenomen_kinderen)) formData.opgenomen_kinderen = null;

    const datumVelden = ['startdatum','initiatiedatum', 'juridisch_start', 'juridisch_eind', 'apotheek_start', 'apotheek_eind', 'metc_start', 'metc_eind', 'lab_start', 'lab_eind', 'inclusie_datum'];
    for(const veld of datumVelden){
        if(!formData[veld]){
            formData[veld] = null;
        }
    }

    const aantal = document.getElementById('geincludeerde_kinderen').value;
    if(aantal && !inclusie_datum){
        alert("Als je een aantal geïncludeerde kinderen invult, moet je ook de bijbehorende datum invullen.");
        return;
    } else if(!aantal && inclusie_datum){
        alert("Als je een datum invult, moet je ook de bijbehorende aantal inclusies invullen.");
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/studie', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(formData)});
        if(!response.ok) throw new Error("Fout bij opslaan...");
        alert("Studiegegevens succesvol opgeslagen!");
        this.reset();
    } catch(err){
        alert("Fout bij opslaan: " + err.message);
    }
});
