document.addEventListener("DOMContentLoaded", function() {
    // Creazione della scena
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Controlli orbitali
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    camera.position.set(5, 5, 5);
    controls.update();

    // Luce ambientale
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // Inizializza il loader IFC
    const ifcLoader = new IfcThree.IfcLoader();
    ifcLoader.ifcManager.setWasmPath("https://unpkg.com/web-ifc@0.0.41/");

    // Gestione caricamento file IFC
    document.getElementById('ifc-file').addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        console.log("File selezionato:", file.name);

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = async (e) => {
            console.log("File caricato, dimensione:", e.target.result.byteLength);
            try {
                const data = e.target.result;
                const model = await ifcLoader.load(data);
                console.log("Modello IFC caricato:", model);
                scene.add(model);
                renderer.render(scene, camera);
            } catch (error) {
                console.error("Errore nel caricamento IFC:", error);
                alert("Impossibile caricare il file IFC. Assicurati che sia valido.");
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
