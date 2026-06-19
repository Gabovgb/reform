import type { Body, EngineState } from '../engine/Types';

/**
 * Renderizador del motor sobre un elemento Canvas.
 * Lee el estado del motor y lo dibuja. No contiene lógica de simulación.
 */
export class CanvasRenderer {
    private ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    /** Limpia todo el canvas */
    clear(width: number, height: number): void {
        this.ctx.clearRect(0, 0, width, height);
    }

    /** Dibuja un cuerpo individual como un rectángulo */
    drawBody(body: Body): void {
        this.ctx.save();

        // Color según rigidez: más rígido = más claro
        const intensity = Math.floor(body.stiffness * 200);
        this.ctx.fillStyle = `rgb(${intensity}, ${intensity}, ${intensity})`;
        this.ctx.strokeStyle = '#333333';
        this.ctx.lineWidth = 1;

        // Dibujar rectángulo
        this.ctx.fillRect(body.x, body.y, body.width, body.height);
        this.ctx.strokeRect(body.x, body.y, body.width, body.height);

        // Etiqueta con el ID y tamaño actual (depuración)
        this.ctx.fillStyle = '#000000';
        this.ctx.font = '10px monospace';
        this.ctx.fillText(
        `${body.id} (${Math.round(body.width)}×${Math.round(body.height)})`,
        body.x + 4,
        body.y + 14
        );

        this.ctx.restore();
    }

    /** Dibuja el estado completo del motor */
    drawState(state: EngineState): void {
        this.clear(state.containerWidth, state.contentHeight);
        for (const body of state.bodies) {
        this.drawBody(body);
        }
    }
}