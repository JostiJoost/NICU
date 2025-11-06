/**
 * Het script waarmee de studie gegevens kunnen worden ingevuld. Daarnaast worden de reeds ingevulde gegevens getoond
 * @author Anne Beumer
 * @version 1.6, 30-10-2025
 * @since 14-05-2025
 */

/**
 * Script wat aan de hand van rollen en rechten de juiste velden aan de gebruiker toont in het formulier
 */
document.addEventListener('DOMContentLoaded', async function(){
    const studieSelectie = document.getElementById('studieSelectie');
    const centrumSelectie = document.getElementById('centrumSelectie');

    // ✅ Excel-uploadsectie
    const excelInput = document.getElementById("excelFile");
    const loadExcelBtn = document.getElementById("loadExcelBtn");
    const excelOutput = document.getElementById("excelOutput");
    let selectedExcelFile = null;

    if (excelInput && loadExcelBtn) {
        excelInput.addEventListener("change", (e) => {
            selectedExcelFile = e.target.files[0];
            if (selectedExcelFile) {
                loadExcelBtn.disabled = false;
                excelOutput.innerHTML = `<p><strong>Geselecteerd bestand:</strong> ${selectedExcelFile.name}</p>`;
            } else {
                loadExcelBtn.disabled = true;
                excelOutput.innerHTML = "<em>Geen bestand geselecteerd.</em>";
            }
        });

        loadExcelBtn.addEventListener("click", () => {
            if (!selectedExcelFile) return;
            loadExcelBtn.disabled = true;
            excelOutput.innerHTML = "<em>Bezig met inladen...</em>";
            readExcel(selectedExcelFile, excelOutput, loadExcelBtn);
        });
    }

    try {
        const response = await fetch('/api/user');
        if (!response.ok) throw new Error("Kon gebruikersinformatie niet ophalen");
        const gebruiker = await response.json();
        const role = gebruiker.role;
        window.ingelogdeStudie = gebruiker.studie;
        console.log("Ingelogde studie:", gebruiker.studie);

        // haal één keer referenties op (niet opnieuw binnen blok)
        const adminContent = document.getElementById('adminContent');
        const adminGateMsg = document.getElementById('adminGateMsg');
        const loadExcelBtn = document.getElementById('loadExcelBtn');

        if (role === 'ROLE_ADMIN') {
            // Toon de studiekeuze dropdown
            document.getElementById('studieSelectie').style.display = 'block';

            // Haal alle beschikbare studies op
            const studiesResultaten = await fetch('/api/user-studies');
            if (!studiesResultaten.ok) throw new Error("Kon studies niet ophalen.");
            const studies = await studiesResultaten.json();

            // Vul de dropdown met opties
            for (const s of studies) {
                const optie = document.createElement('option');
                optie.value = s;
                optie.textContent = s;
                studieSelectie.appendChild(optie);
            }

            // --- Form verbergen tot er een studie is gekozen ---
            if (adminContent) adminContent.style.display = 'none';
            if (loadExcelBtn) loadExcelBtn.disabled = true;

            // Wanneer admin een studie kiest → form zichtbaar maken
            studieSelectie.addEventListener('change', () => {
                const gekozen = studieSelectie.value && studieSelectie.value.trim().length > 0;
                window.geselecteerdeStudie = gekozen ? studieSelectie.value : null;

                if (gekozen) {
                    // Toon de inhoud
                    if (adminContent) adminContent.style.display = 'block';
                    if (loadExcelBtn) loadExcelBtn.disabled = false;

                    // Laad direct bestaande data voor deze studie
                    if (typeof updateFormVelden === 'function') {
                        updateFormVelden({studieNaam: studieSelectie.value, vanuitStudie: true});
                    }
                } else {
                    // Verberg weer alles als dropdown leeg is
                    if (adminContent) adminContent.style.display = 'none';
                    if (loadExcelBtn) loadExcelBtn.disabled = true;
                }
            });

            // Laad ook direct de form als de admin al een studie geselecteerd had
            if (studieSelectie.value) {
                const evt = new Event('change');
                studieSelectie.dispatchEvent(evt);
            }

            // Deze listeners blijven zoals ze waren
            studieSelectie.addEventListener("change", updateFormVelden);
            if (centrumSelectie) {
                centrumSelectie.addEventListener("change", updateFormVelden);
            }


    }else if(role === 'ROLE_STUDIE'){
            document.getElementById('studieSelectie').style.display = 'none';
            document.getElementById('naamStudieLabel').style.display = 'none';
            studieSelectie.removeAttribute('required');

            const studieResultaten = await fetch('/api/user/studienaam');
            if(!studieResultaten.ok) throw new Error("Kon studienaam niet ophalen.")
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
        alert("Fout bij ophalen van studiegegevens: " + err.message);
    }

    function toggleFase(id, zichtbaar){
        document.getElementById(id).style.display = zichtbaar ? 'block' : 'none';
    }

    /**
     * Functie die het formulier vult met data die al in de database stond
     * @param studieNaam - De naam van de studie waarvoor het formulier wordt ingevuld
     */
    async function updateFormVelden({studieNaam = null, vanuitStudie = false} ={}){
        try{
            if(!studieNaam) studieNaam = studieSelectie.value;
            const centrumNaam = centrumSelectie.value;
            if(!studieNaam || !centrumNaam) return;

            console.log("Fetch voor studie:", studieNaam, "en centrum:", centrumNaam);
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
            alert("Fout bij laden van bestaande studiegegevens.");
        }
    }

    /**
     * Functie die de waarde van een HTML item aanpast
     * @param id - Het HTML id van de aan te passen waarde
     * @param value - De waarde waarnaar het HTML item moet worden aangepast
     */
    function setFieldValue(id, value){
        if(value !== null && value !== undefined){
            const el = document.getElementById(id);
            if (el) el.value = value;
        }
    }

    // ========== Excel helperfuncties ==========

    function readExcel(file, output, loadExcelBtn) {
        const reader = new FileReader();
        const fileExt = file.name.split('.').pop().toLowerCase();

        reader.onload = function (e) {
            try {
                let workbook;

                if (fileExt === "csv") {
                    // CSV-bestand: lees als tekst
                    const text = e.target.result;
                    workbook = XLSX.read(text, { type: "string" });
                } else {
                    // Excel-bestand: lees als arraybuffer
                    const data = new Uint8Array(e.target.result);
                    workbook = XLSX.read(data, { type: "array" });
                }

                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                loadExcelBtn.disabled = false;

                // Verwerk data (bijvoorbeeld inclusies)
                const inclusies = processExcelData(jsonData, window.ingelogdeStudie);
                if (inclusies.length > 0) {
                    sendExcelDataToBackend(inclusies);
                } else {
                    console.warn("Geen inclusies gevonden in het bestand.");
                    output.innerHTML = `<em>Bestand geladen, maar geen inclusies gevonden.</em>`;
                }

            } catch (err) {
                console.error("Fout bij lezen Excel/CSV:", err);
                output.innerHTML = "<strong>Fout:</strong> kan bestand niet verwerken.";
                loadExcelBtn.disabled = false;
            }
        };

        if (fileExt === "csv") {
            reader.readAsText(file);           // CSV → tekst
        } else {
            reader.readAsArrayBuffer(file);    // Excel → arraybuffer
        }
    }

    function processExcelData(jsonData, studieNaam) {
        if (!jsonData || jsonData.length < 2) {
            console.warn("Geen bruikbare data in Excel.");
            return [];
        }

        console.log("Gelezen JSON-data:", jsonData);
        console.log("Header-rij:", jsonData[0]);
        // Zoek kolomnamen
        const headers = jsonData[0].map(h => h.toString().trim().toLowerCase());
        const dateIdx = headers.findIndex(h => h.includes("participant") && h.includes("date"));
        const siteIdx = headers.findIndex(h => h.includes("site") && h.includes("abbreviation"));

        if (dateIdx === -1 || siteIdx === -1) {
            alert("Excel mist vereiste kolommen: 'participant creation date' of 'site abbreviation'");
            return [];
        }

        // Verzamel tellingen per centrum+datum
        const counts = {};

        for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            const dateVal = row[dateIdx];
            const siteVal = row[siteIdx];
            if (!dateVal || !siteVal) continue;

            let datum;
            try {
                if (typeof dateVal === "number") {
                    // Excel stores dates as number of days since 1900-01-01
                    const excelEpoch = new Date(1899, 11, 30); // Excel zero date
                    datum = new Date(excelEpoch.getTime() + dateVal * 86400000);
                } else if (typeof dateVal === "string") {
                    // Handle strings like "8-8-2025" or "02-02-2025"
                    const parts = dateVal.split(/[-/]/);
                    if (parts.length === 3) {
                        const [d, m, y] = parts.map(p => parseInt(p, 10));
                        datum = new Date(y, m - 1, d);
                    } else {
                        datum = new Date(Date.parse(dateVal));
                    }
                } else {
                    continue;
                }

                if (isNaN(datum.getTime())) continue; // skip invalid dates
            } catch (e) {
                console.warn("Kon datum niet lezen:", dateVal);
                continue;
            }

            const formattedDate = datum.toISOString().split("T")[0];
            const centrum = siteVal.toString().trim();

            const key = `${centrum}|${formattedDate}`;
            counts[key] = (counts[key] || 0) + 1;
        }

        // Zet om naar lijst van inclusies
        const inclusies = Object.entries(counts).map(([key, geincludeerd]) => {
            const [centrum, datum] = key.split("|");
            return {
                naamStudie: studieNaam,
                naamCentrum: centrum,
                datum,
                geincludeerd
            };
        });

        console.log("Verwerkte inclusies:", inclusies);
        return inclusies;
    }

    async function sendExcelDataToBackend(inclusies, output) {
        try {
            const response = await fetch("/api/aantal_geincludeerd/fromExcel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(inclusies)
            });
            if (!response.ok) throw new Error("Upload mislukt");
            const text = await response.text();
            alert("Inclusies opgeslagen! " + text);
            excelOutput.innerHTML = `<span style="color:green;">Data succesvol ingeladen (${inclusies.length} regels) </span>`;
            loadExcelBtn.disabled = false;
        } catch (err) {
            console.error("Fout bij upload:", err);
            alert("Fout bij upload: " + err.message);
            excelOutput.innerHTML = `<span style="color:red;">Fout bij upload: ${err.message}</span>`;
            loadExcelBtn.disabled = false;
        }
    }

    function renderExcelTable(data, sheetName, output) {
        if (!data || data.length === 0) {
            output.innerHTML = "<em>Geen data gevonden in het werkblad.</em>";
            return;
        }

        let html = `<h3>Inhoud van werkblad: ${sheetName}</h3><table class='table'>`;
        data.forEach((row, i) => {
            html += "<tr>";
            row.forEach((cell) => {
                html += i === 0 ? `<th>${cell ?? ""}</th>` : `<td>${cell ?? ""}</td>`;
            });
            html += "</tr>";
        });
        html += "</table>";
        output.innerHTML = html;
    }

    /*
    function sendExcelData(data) {
        fetch('/api/uploadExcel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(res => res.ok ? console.log("Excel-data succesvol verzonden") : console.error("Upload mislukt"))
        .catch(err => console.error("Fout bij upload:", err));
    }
    */
});

// =============================================================
//  Formulierverzending blijft identiek
// =============================================================
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
        const response = await fetch('http://localhost:8080/api/studie', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        });
        if(!response.ok) throw new Error("Fout bij opslaan...");
        alert("Studiegegevens succesvol opgeslagen!");
        this.reset();
    } catch(err){
        alert("Fout bij opslaan: " + err.message);
    }
});
