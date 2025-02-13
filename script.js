document.addEventListener("DOMContentLoaded", async function() {
    const viewer = new IfcViewerAPI({ container: document.body, backgroundColor: new THREE.Color(0xffffff) });

    viewer.IFC.setWasmPath("https://unpkg.com/web-ifc@0.0.37/");

    // Controlli della telecamera
    await viewer.IFC.applyWebIfcConfig();
    await viewer.IFC.setupThreeScene();

    // Selezione del file IFC
    document.getElementById('ifc-file').addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        document.getElementById("status").innerText = `Caricamento di ${file.name} in corso...`;

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = async (e) => {
            try {
                const data = e.target.result;
                const model = await viewer.IFC.loadIfc(new Uint8Array(data));
                console.log("Modello IFC caricato:", model);
                document.getElementById("status").innerText = `Caricamento completato: ${file.name}`;
            } catch (error) {
                console.error("Errore nel caricamento IFC:", error);
                alert("Errore nel caricamento del file IFC.");
                document.getElementById("status").innerText = "Errore nel caricamento del file.";
            }
        };
    });
});
