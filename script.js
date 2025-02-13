// Importa librerie corrette
import { Color } from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';
import { IfcViewerAPI } from 'https://cdn.jsdelivr.net/npm/@ifcjs/viewer@0.0.142';

document.addEventListener("DOMContentLoaded", async function() {
    // Ottieni il contenitore per la visualizzazione
    const container = document.getElementById("viewer-container");

    // Inizializza il visualizzatore IFC
    const viewer = new IfcViewerAPI({ container, backgroundColor: new Color(0xffffff) });
    await viewer.IFC.setWasmPath("https://unpkg.com/web-ifc@0.0.42/");

    // Attiva assi e griglia
    viewer.axes.setAxes();
    viewer.grid.setGrid();

    // Aggiunge evento per caricare un file IFC
    const input = document.getElementById("file-input");
    input.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = async (e) => {
            const data = e.target.result;
            const model = await viewer.IFC.loadIfc(data);
            console.log("Modello IFC caricato:", model);
        };
    });
});
