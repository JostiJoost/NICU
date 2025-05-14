document.addEventListener('DOMContentLoaded', async function(){
    const selectElement = document.getElementById('protocolSelectie');
    const nieuwProtocol = document.getElementById('nieuwProtocol');
    const nieuweProtocolNaam = document.getElementById('nieuweProtocolNaam')
    const verwijderButton = document.getElementById('verwijderProtocol');
//Todo mogelijk nog zorgen voor bevestiging als je een protocol aan het overschrijven bent
    try{
        const response = await fetch("http://localhost:8080/api/protocollen");
        if(!response.ok){
            const text = await response.text();
            throw new Error("Serverfout bij ophalen protocollen: " + response.status + ":" + text);
        }

        const text = await response.text();

        console.log("Ruwe response:", text);

        let data
        try{
            data = JSON.parse(text);
        }catch(e){
            console.error("Kon geen JSON parse:", e)
            throw e;
        }
        console.log("Parsed JSON:", data);


        if(data.length === 0){
            selectElement.style.display = 'none';
            nieuwProtocol.style.display = 'block';
            nieuweProtocolNaam.required = true;
        } else{
            data.forEach(protocol => {
                const option = document.createElement('option');
                option.value = protocol;
                option.textContent = protocol;
                selectElement.appendChild(option);
            });

            const nieuweOptie = document.createElement('option');
            nieuweOptie.value = 'nieuw';
            nieuweOptie.textContent = 'Nieuw protocol toevoegen';
            selectElement.appendChild(nieuweOptie);
        }

        selectElement.addEventListener('change', async() => {
            if(selectElement.value === 'nieuw'){
                nieuwProtocol.style.display = 'block';
                nieuweProtocolNaam.required = true;
                verwijderButton.style.display = 'none';
                clearForm();
            } else{
                nieuwProtocol.style.display = 'none';
                nieuweProtocolNaam.required = false;
                verwijderButton.style.display = 'inline-block';

                const naam = selectElement.value;
                const response = await fetch(`http://localhost:8080/api/protocollen/${naam}`,{credentials:"include"});
                const json = await response.json();
                fillForm(json);
            }
        });
    } catch(error){ console.error('Fout bij ophalen protocollen:', error)}

    document.getElementById('protocolForm').addEventListener('submit', async function(e){
        e.preventDefault();
        let naamProtocol;

        if (selectElement.style.display === 'none' || selectElement.value === 'nieuw') {
            naamProtocol = nieuweProtocolNaam.value.trim();
        } else {
            naamProtocol = selectElement.value;
        }
        if(!naamProtocol){
            alert("Vul de naam van het protocol in of selecteer er een.");
            return;
        }

        const protocol = {
            naamProtocol: naamProtocol,
            naamCentrum: getValueOrNull('centrumSelectie'),
            datumAanvraag: getValueOrNull('datumAanvraag'),
            primairePenvoerder: getValueOrNull('naamPenvoerder'),
            functiePrimairePenvoerder: getValueOrNull('functiePenvoerder'),
            datumEersteVersie: getValueOrNull('datumEersteVersie'),
            datumAccordering: getValueOrNull('datumAccordering')
        };
        const tegenlezer = {
            naamProtocol: naamProtocol,
            naamCentrum: getValueOrNull('centrumTegenlezer'),
            naamTegenlezer: getValueOrNull('naamTegenlezer'),
            functieTegenlezer: getValueOrNull('functieTegenlezer')
        };
        const payload = {protocol, tegenlezer};

        try{
            const response = await fetch("http://localhost:8080/api/protocollen", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify(payload)
            });
            if(!response.ok) throw new Error("Fout bij opslaan");
            alert("Protocol is opgeslagen!")
            location.reload();
        } catch(error){
            console.error("Fout bij opslaan:", error);
            alert("Opslaan mislukt.");
        }
    });

    verwijderButton.addEventListener('click', async function(){
        const naam = selectElement.value;

        if(!naam || naam === 'nieuw') return;
        if(confirm(`Weet je zeker dat je protocol "${naam}" wilt verwijderen?`)){
            try{
                const response = await fetch(`http://localhost:8080/api/protocollen/${naam}`, {
                    method: "DELETE",
                    credentials: "include"
                });
                if(!response.ok) throw new Error("Verwijderen mislukt");
                alert("Protocol verwijderd.");
                location.reload();
            } catch(error){
                console.error("Fout bij verwijderen:" + error);
                alert("Verwijderen mislukt.")
            }
        }
    });

    function getValueOrNull(id){
        const el = document.getElementById(id);
        return el && el.value.trim() !== "" ? el.value : null;
    }

    function clearForm(){
        [
            'centrumSelectie', 'datumAanvraag', 'naamPenvoerder', 'functiePenvoerder', 'datumEersteVersie', 'datumAccordering', 'centrumTegenlezer', 'naamTegenlezer', 'functieTegenlezer'
        ].forEach(id=> {
            const el = document.getElementById(id);
            if(el) el.value = "";
        });
    }

    function fillForm(data){
        const p = data.protocol;
        const t = data.tegenlezer || {};

        setValue('centrumSelectie', p.naamCentrum);
        setValue('datumAanvraag', p.datumAanvraag);
        setValue('naamPenvoerder', p.primairePenvoerder);
        setValue('functiePenvoerder', p.functiePrimairePenvoerder);
        setValue('datumEersteVersie', p.datumEersteVersie);
        setValue('datumAccordering', p.datumAccordering);
        setValue('centrumTegenlezer', t.naamCentrum);
        setValue('naamTegenlezer', t.naamTegenlezer);
        setValue('functieTegenlezer', t.functieTegenlezer);
    }

    function setValue(id, value){
        const el = document.getElementById(id);
        if(el) el.value = value ?? "";
    }
});