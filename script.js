import { Color } from 'https://cdn.skypack.dev/three@0.132.2';
import { IfcViewerAPI } from 'https://cdn.skypack.dev/ifc-viewer-api@1.0.0';

const container = document.getElementById('viewer-container');
const viewer = new IfcViewerAPI({ container, backgroundColor: new Color(0xffffff) });

viewer.axes.setAxes();
viewer.grid.setGrid();

const input = document.getElementById('file-input');
input.addEventListener('change', async (changed) => {
    const file = changed.target.files[0];
    const ifcURL = URL.createObjectURL(file);
    await viewer.IFC.loadIfcUrl(ifcURL);
});
