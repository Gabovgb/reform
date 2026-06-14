import type { Body as BodyInterface } from './Types';

/**
 * Implementación concreta de un cuerpo AABB mutable.
 * Usa integración Verlet para posición y tamaño.
 */
export class Body implements BodyInterface {
    id: string;

    // Posición
    x: number;
    y: number;
    prevX: number;
    prevY: number;

    // Tamaño actual
    width: number;
    height: number;
    prevWidth: number;
    prevHeight: number;

    // Tamaño ideal
    idealWidth: number;
    idealHeight: number;

    // Límites duros
    minWidth: number;
    minHeight: number;
    maxWidth?: number;
    maxHeight?: number;

    // Propiedades físicas
    mass: number;
    stiffness: number;
    magnetism: number;

    constructor(
        id: string,
        x: number,
        y: number,
        width: number,
        height: number,
        options: {
        mass?: number;
        stiffness?: number;
        magnetism?: number;
        minWidth?: number;
        minHeight?: number;
        maxWidth?: number;
        maxHeight?: number;
        } = {}
    ) {
        this.id = id;

        // Posición inicial (en reposo: prev = actual)
        this.x = x;
        this.y = y;
        this.prevX = x;
        this.prevY = y;

        // Tamaño inicial (en reposo)
        this.width = width;
        this.height = height;
        this.prevWidth = width;
        this.prevHeight = height;

        // Tamaño ideal = tamaño inicial
        this.idealWidth = width;
        this.idealHeight = height;

        // Límites
        this.minWidth = options.minWidth ?? 20;   // Mínimo por defecto: 20px
        this.minHeight = options.minHeight ?? 20;
        this.maxWidth = options.maxWidth;
        this.maxHeight = options.maxHeight;

        // Propiedades físicas con valores por defecto razonables
        this.mass = options.mass ?? 1;
        this.stiffness = options.stiffness ?? 0.5; // 0..1
        this.magnetism = options.magnetism ?? 0.3;
    }

    /**
     * Calcula la velocidad implícita (Verlet).
     * No se almacena; se deriva de la diferencia entre posición actual y anterior.
     */
    getVelocityX(): number {
        return this.x - this.prevX;
    }

    getVelocityY(): number {
        return this.y - this.prevY;
    }

    /**
     * Aplica una fuerza como desplazamiento directo (Verlet).
     * F = m * a => a = F / m. En Verlet, el desplazamiento extra es a * dt².
     * Como usamos dt fijo (1), simplificamos: desplazamiento = fuerza / masa.
     */
    applyForce(fx: number, fy: number): void {
        const invMass = 1 / this.mass;
        this.x += fx * invMass;
        this.y += fy * invMass;
    }

    /**
     * Guarda el estado actual como "anterior" para el siguiente paso de Verlet.
     * Se llama al final de cada paso de simulación.
     */
    storePrevious(): void {
        this.prevX = this.x;
        this.prevY = this.y;
        this.prevWidth = this.width;
        this.prevHeight = this.height;
    }

    /**
     * Aplica amortiguamiento (damping) para evitar oscilaciones infinitas.
     * factor: 0 = sin amortiguamiento, 1 = parada total.
     */
    damp(factor: number): void {
        const vx = this.getVelocityX();
        const vy = this.getVelocityY();
        this.x -= vx * factor;
        this.y -= vy * factor;
    }

    /**
     * Verifica si el cuerpo puede deformarse más (tiene margen hasta sus límites).
     */
    canShrink(): boolean {
        return this.width > this.minWidth || this.height > this.minHeight;
    }

    /**
     * Verifica si el cuerpo puede expandirse más.
     */
    canGrow(): boolean {
        const wOk = this.maxWidth === undefined || this.width < this.maxWidth;
        const hOk = this.maxHeight === undefined || this.height < this.maxHeight;
        return wOk || hOk;
    }
}