import { Engine } from './engine/Engine';
import { Body } from './engine/Body';
import { CanvasRenderer } from './renderer/CanvasRenderer';

// 1. Configurar canvas
const canvas = document.getElementById('app') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// Ajustar canvas al tamaño de la ventana
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 2. Crear motor y renderer
const engine = new Engine(canvas.width, canvas.height, {
//  margin: 0,
    enableWalls: true,
});

const renderer = new CanvasRenderer(ctx);

// 3. Crear cuerpos de prueba
const body1 = new Body('sidebar', 50, 50, 200, 300, {
    mass: 20,
    stiffness: 0.9,
    magnetism: 0.5,
    minWidth: 80,
    minHeight: 150,
});

const body2 = new Body('content', 200, 50, 400, 200, {
    mass: 30,
    stiffness: 0.6,
    magnetism: 0.4,
    minWidth: 150,
    minHeight: 100,
});

const body3 = new Body('card', 550, 50, 180, 120, {
    mass: 10,
    stiffness: 0.3,
    magnetism: 0.3,
    minWidth: 100,
    minHeight: 60,
});

engine.addBody(body1);
engine.addBody(body2);
engine.addBody(body3);

// 4. Bucle principal con paso fijo
let lastTime = performance.now();

function loop(currentTime: number): void {
    const realDeltaTime = (currentTime - lastTime) / 1000; // Convertir ms a segundos
    lastTime = currentTime;

    // Limitar delta para evitar espirales de muerte (ej: tab inactiva)
    const clampedDelta = Math.min(realDeltaTime, 0.1);

    engine.update(clampedDelta);
    const state = engine.getState();
    if (canvas.width !== state.containerWidth) {
        canvas.width = state.containerWidth;
    }
    if (canvas.height !== state.contentHeight) {
        canvas.height = state.contentHeight;
    }
    renderer.drawState(state);

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

// 5. Redimensionar al cambiar el viewport
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    engine.resize(canvas.width, canvas.height);
});