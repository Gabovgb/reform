/**
 * Vector 2D para matemáticas del motor.
 * Inmutable por diseño: cada operación devuelve un nuevo Vec2.
 */
export class Vec2 {
    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    // --- Operaciones básicas ---

    add(v: Vec2): Vec2 {
        return new Vec2(this.x + v.x, this.y + v.y);
    }

    sub(v: Vec2): Vec2 {
        return new Vec2(this.x - v.x, this.y - v.y);
    }

    scale(s: number): Vec2 {
        return new Vec2(this.x * s, this.y * s);
    }

    dot(v: Vec2): number {
        return this.x * v.x + this.y * v.y;
    }

    // --- Magnitud y dirección ---

    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    distanceTo(v: Vec2): number {
        return this.sub(v).length();
    }

    normalize(): Vec2 {
        const len = this.length();
        return len > 0 ? this.scale(1 / len) : new Vec2(0, 0);
    }

    // --- Interpolación ---

    /** Interpolación lineal entre este vector y otro. t=0 devuelve this, t=1 devuelve v */
    lerp(v: Vec2, t: number): Vec2 {
        return new Vec2(
        this.x + (v.x - this.x) * t,
        this.y + (v.y - this.y) * t
        );
    }

    // --- Utilidades ---

    toString(): string {
        return `Vec2(${this.x}, ${this.y})`;
    }
}

// --- Vectores predefinidos ---
export const VEC2_ZERO = new Vec2(0, 0);
export const VEC2_UP = new Vec2(0, -1);
export const VEC2_DOWN = new Vec2(0, 1);
export const VEC2_LEFT = new Vec2(-1, 0);
export const VEC2_RIGHT = new Vec2(1, 0);