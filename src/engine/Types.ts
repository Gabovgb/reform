import type { Vec2 } from './Vec2';

/**
 * Un cuerpo físico con tamaño mutable (AABB).
 * Es la unidad fundamental del motor.
 */
export interface Body {
    /** Identificador único (para depuración y render) */
    id: string;

    // --- Posición (esquina superior izquierda) ---
    x: number;
    y: number;
    /** Posición en el frame anterior (necesario para integración Verlet) */
    prevX: number;
    prevY: number;

    // --- Tamaño actual ---
    width: number;
    height: number;
    /** Tamaño en el frame anterior */
    prevWidth: number;
    prevHeight: number;

    // --- Tamaño ideal (al que tiende por su rigidez) ---
    idealWidth: number;
    idealHeight: number;

    // --- Límites duros (no puede ser más chico que esto) ---
    minWidth: number;
    minHeight: number;

    // --- Límites de expansión (opcional, sin límite si no se define) ---
    maxWidth?: number;
    maxHeight?: number;

    // --- Propiedades físicas ---
    /** Resistencia al movimiento (inercia) */
    mass: number;
    /** Resistencia a la deformación (0 = sin resistencia, 1 = máxima rigidez) */
    stiffness: number;
    /** Fuerza de repulsión hacia otros cuerpos */
    magnetism: number;

    applyForce(fx: number, fy: number): void;
    storePrevious(): void;
    damp(factor: number): void;
    canShrink(): boolean;
    canGrow(): boolean;
}

/**
 * Resultado de la detección de solapamiento entre dos cuerpos.
 */
export interface Overlap {
    bodyA: Body;
    bodyB: Body;
    /** Profundidad del solapamiento en el eje X */
    overlapX: number;
    /** Profundidad del solapamiento en el eje Y */
    overlapY: number;
    /** Dirección normal de la colisión (apunta de A hacia B) */
    normal: Vec2;
}

/**
 * Estado completo del motor en un momento dado.
 * Útil para el renderer y para depuración.
 */
export interface EngineState {
    bodies: Body[];
    containerWidth: number;
    containerHeight: number;
    contentHeight: number;
    margin: number;
}

/**
 * Opciones de configuración del motor.
 */
export interface EngineOptions {
    /** Número de iteraciones del solver de restricciones por paso (más = más estable, más caro) */
    constraintIterations?: number;
    /** Número de iteraciones del solver de repulsión por paso */
    repulsionIterations?: number;
    /** Paso de tiempo fijo para la simulación (por defecto: 1/60) */
    deltaTime?: number;
    /** Si el contenedor ejerce fuerzas de pared (por defecto: true) */
    enableWalls?: boolean;
    /** Márgenes del contenedor */
    margin?: number;
}