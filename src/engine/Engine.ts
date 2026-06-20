import type { Body, EngineOptions, EngineState } from './Types';
import { Solver } from './Solver';

export class Engine {
    bodies: Body[] = [];
    containerWidth: number;
    containerHeight: number;
    contentHeight: number;
    private options: Required<EngineOptions>;
    private stepAccumulator = 0;

    constructor(width: number, height: number, options: EngineOptions = {}) {
        this.containerWidth = width;
        this.containerHeight = height;
        this.contentHeight = height;
        this.options = {
            constraintIterations: options.constraintIterations ?? 5,
            repulsionIterations: options.repulsionIterations ?? 3,
            deltaTime: options.deltaTime ?? 1 / 60,
            enableWalls: options.enableWalls ?? true,
            margin: options.margin ?? 0,
        };
    }

    addBody(body: Body): void {
        this.bodies.push(body);
    }

    removeBody(body: Body): void {
        const index = this.bodies.indexOf(body);
        if (index !== -1) this.bodies.splice(index, 1);
    }

    resize(width: number, height: number): void {
        this.containerWidth = width;
        this.containerHeight = height;
    }

    /** Avanza la simulación un paso fijo. */
    step(): void {
        // 1. Resolver colisiones entre todos los pares
        this.resolveAllCollisions();

        // Restaurar tamaños hacia el ideal
        for (const body of this.bodies) {
            Solver.restoreSize(body);
        }

        // Paredes del contenedor (ahora con compresión proporcional)
        if (this.options.enableWalls) {
            this.applyContainerConstraints();
        }

        // 2. Segunda pasada: deja que la compresión contra las paredes
        // se propague entre los cuerpos restantes antes de cerrar el paso.
        this.resolveAllCollisions();

        this.recalculateContentHeight();

        // Guardar estado anterior para Verlet
        for (const body of this.bodies) {
            body.storePrevious();
        }
    }

    /** Corre el solver de fuerzas entre todos los pares, repulsionIterations veces. */
    private resolveAllCollisions(): void {
        for (let iter = 0; iter < this.options.repulsionIterations; iter++) {
            for (let i = 0; i < this.bodies.length; i++) {
                for (let j = i + 1; j < this.bodies.length; j++) {
                    Solver.resolve(this.bodies[i], this.bodies[j]);
                }
            }
        }
    }

    update(realDeltaTime: number): void {
        this.stepAccumulator += realDeltaTime;
        while (this.stepAccumulator >= this.options.deltaTime) {
            this.step();
            this.stepAccumulator -= this.options.deltaTime;
        }
    }

    /**
     * Aplica las restricciones del contenedor.
     * Cuando un cuerpo excede el límite, primero cede en tamaño
     * (si aún puede) y el remanente se resuelve como desplazamiento.
     * Es física real contra la pared, no solo un clamp de posición.
     */
    private applyContainerConstraints(): void {
        const margin = this.options.margin;
        const maxX = this.containerWidth - margin;
        const maxY = this.containerHeight - margin;

        for (const body of this.bodies) {
            // Pared derecha
            if (body.x + body.width > maxX) {
                const overflowX = (body.x + body.width) - maxX;
                if (body.width > body.minWidth) {
                    const originalWidth = body.width;
                    body.width = Math.max(body.minWidth, body.width - overflowX);
                    const remaining = overflowX - (originalWidth - body.width);
                    if (remaining > 0) body.x -= remaining;
                } else {
                    body.applyForce((maxX - (body.x + body.width)) * 2, 0);
                    body.x = maxX - body.width;
                }
            }

            // Pared izquierda
            if (body.x < margin) {
                const overflowLeft = margin - body.x;
                if (body.width > body.minWidth) {
                    const originalWidth = body.width;
                    body.width = Math.max(body.minWidth, body.width - overflowLeft);
                    body.x += (originalWidth - body.width);
                } else {
                    body.applyForce((margin - body.x) * 2, 0);
                    body.x = margin;
                }
            }

            // Pared superior
            if (body.y < margin) {
                const overflowTop = margin - body.y;
                if (body.height > body.minHeight) {
                    const originalHeight = body.height;
                    body.height = Math.max(body.minHeight, body.height - overflowTop);
                    body.y += (originalHeight - body.height);
                } else {
                    body.applyForce(0, (margin - body.y) * 2);
                    body.y = margin;
                }
            }

            // Pared inferior — si ya está en minHeight, se deja escapar (scroll)
            if (body.y + body.height > maxY) {
                if (body.height <= body.minHeight) {
                    this.contentHeight = Math.max(this.contentHeight, body.y + body.height + margin);
                } else {
                    const overflowBottom = (body.y + body.height) - maxY;
                    body.height = Math.max(body.minHeight, body.height - overflowBottom);
                    body.applyForce(0, (maxY - (body.y + body.height)) * 2);
                    body.y = maxY - body.height;
                }
            }
        }
    }

    private recalculateContentHeight(): void {
        const margin = this.options.margin;
        let maxBottom = this.containerHeight;

        for (const body of this.bodies) {
            maxBottom = Math.max(maxBottom, body.y + body.height + margin);
        }

        this.contentHeight = Math.max(this.contentHeight, maxBottom);
    }

    getState(): EngineState {
        return {
            bodies: this.bodies,
            containerWidth: this.containerWidth,
            containerHeight: this.containerHeight,
            contentHeight: this.contentHeight,
            margin: this.options.margin,
        };
    }
}