import type { Body, EngineOptions, EngineState } from './Types';
import { Solver } from './Solver';

export class Engine {
    bodies: Body[] = [];
    containerWidth: number;
    containerHeight: number;
    private options: Required<EngineOptions>;
    private stepAccumulator = 0;

    constructor(width: number, height: number, options: EngineOptions = {}) {
        this.containerWidth = width;
        this.containerHeight = height;
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
        // Resolver colisiones entre todos los pares
        for (let iter = 0; iter < this.options.repulsionIterations; iter++) {
        for (let i = 0; i < this.bodies.length; i++) {
            for (let j = i + 1; j < this.bodies.length; j++) {
            Solver.resolve(this.bodies[i], this.bodies[j]);
            }
        }
        }
        // Restaurar tamaños hacia el ideal
        for (const body of this.bodies) {
        Solver.restoreSize(body);
        }
        // Paredes del contenedor
        if (this.options.enableWalls) {
        this.applyContainerConstraints();
        }
        // Guardar estado anterior para Verlet
        for (const body of this.bodies) {
        body.storePrevious();
        }
    }

    update(realDeltaTime: number): void {
        this.stepAccumulator += realDeltaTime;
        while (this.stepAccumulator >= this.options.deltaTime) {
        this.step();
        this.stepAccumulator -= this.options.deltaTime;
        }
    }

    private applyContainerConstraints(): void {
        const margin = this.options.margin;
        const maxX = this.containerWidth - margin;
        const maxY = this.containerHeight - margin;
        for (const body of this.bodies) {
        if (body.x < margin) {
            body.applyForce((margin - body.x) * 2, 0);
            body.x = margin;
        }
        if (body.x + body.width > maxX) {
            body.applyForce((maxX - (body.x + body.width)) * 2, 0);
            body.x = maxX - body.width;
        }
        if (body.y < margin) {
            body.applyForce(0, (margin - body.y) * 2);
            body.y = margin;
        }
        if (body.y + body.height > maxY) {
            body.applyForce(0, (maxY - (body.y + body.height)) * 2);
            body.y = maxY - body.height;
        }
        }
    }

    getState(): EngineState {
        return {
        bodies: this.bodies,
        containerWidth: this.containerWidth,
        containerHeight: this.containerHeight,
        margin: this.options.margin,
        };
    }
}