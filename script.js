// Importa le librerie necessarie
import { IFCLoader } from "https://unpkg.com/web-ifc-three@0.0.41/dist/web-ifc-three.module.js";
import * as THREE from "https://unpkg.com/three@0.133.1/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.133.1/examples/jsm/controls/OrbitControls.js";

document.addEventListener("DOMContentLoaded", function() {
    // Creazione della scena Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Controlli orbitali
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    camera.position.set(5, 5, 5);
    controls.update();

    // Luce ambientale
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // Inizializza il loader IFC
    const ifcLoader = new IFCLoader();
    ifcLoader.ifcManager.setWasmPath("https://unpkg.com/web-ifc@0.0.41/");

    // Selezione elementi UI
    const status = document.getElementById("status");
    const progressBarContainer = document.getElementById("progress-container");
    const progressBar = document.getElementById("progress-bar");

    // Gestione caricamento file IFC
    document.getElementById('ifc-file').addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        console.log("File selezionato:", file.name);
        status.innerText = `Caricamento di ${file.name} in corso...`;
        progressBarContainer.style.display = "block";
        progressBar.style.width = "0%";

        const reader = new FileReader();

        // Aggiornamento barra di avanzamento
        reader.onprogress = function(e) {
            if (e.lengthComputable) {
                let percentLoaded = (e.loaded / e.total) * 100;
                progressBar.style.width = percentLoaded + "%";
            }
        };

        reader.readAsArrayBuffer(file);

        reader.onload = async (e) => {
            console.log("File caricato, dimensione:", e.target.result.byteLength);
            try {
                progressBar.style.width = "100%"; // Completato

                const data = e.target.result;
                const model = await ifcLoader.parse(data); // Metodo corretto per caricare il modello
                console.log("Modello IFC caricato:", model);
                scene.add(model);
                renderer.render(scene, camera);

                status.innerText = `Caricamento completato: ${file.name}`;
                setTimeout(() => { progressBarContainer.style.display = "none"; }, 2000);
            } catch (error) {
                console.error("Errore nel caricamento IFC:", error);
                alert("Impossibile caricare il file IFC. Assicurati che sia valido.");
                status.innerText = "Errore nel caricamento del file.";
                progressBarContainer.style.display = "none";
            }
        };
    });

    // Animazione continua
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
});
