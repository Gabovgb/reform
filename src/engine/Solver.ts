import { Vec2 } from './Vec2';
import type { Body, Overlap } from './Types';

// Constantes de ajuste (experimentales — se tunearán con el prototipo)
const DEFORMATION_SCALE = 0.1;  // Cuánto se deforma un cuerpo por unidad de fuerza
const RESTORATION_RATE = 0.05;  // Qué tan rápido vuelve al tamaño ideal

export class Solver {
    static detectOverlap(a: Body, b: Body): Overlap | null {
        const ax2 = a.x + a.width;
        const ay2 = a.y + a.height;
        const bx2 = b.x + b.width;
        const by2 = b.y + b.height;

        const overlapX = Math.min(ax2, bx2) - Math.max(a.x, b.x);
        const overlapY = Math.min(ay2, by2) - Math.max(a.y, b.y);

        if (overlapX <= 0 || overlapY <= 0) return null;

        const dx = b.x + b.width / 2 - (a.x + a.width / 2);
        const dy = b.y + b.height / 2 - (a.y + a.height / 2);

        return {
        bodyA: a,
        bodyB: b,
        overlapX,
        overlapY,
        normal: new Vec2(Math.sign(dx), Math.sign(dy)), // Vec2 real, no as any
        };
    }

    static resolve(a: Body, b: Body): void {
        const overlap = Solver.detectOverlap(a, b);
        if (!overlap) return;

        const magnetismAvg = (a.magnetism + b.magnetism) / 2;
        const repulsionForce = Math.min(overlap.overlapX, overlap.overlapY) * magnetismAvg;

        const aDeformRatio = 1 - a.stiffness;
        const bDeformRatio = 1 - b.stiffness;

        const aMoveRatio = a.stiffness;
        const bMoveRatio = b.stiffness;
        const totalMoveRatio = aMoveRatio + bMoveRatio || 1;
        const aMoveForce = repulsionForce * (aMoveRatio / totalMoveRatio);
        const bMoveForce = repulsionForce * (bMoveRatio / totalMoveRatio);

        // Se pasa el overlap ya calculado
        Solver.applyRepulsion(a, b, aMoveForce, bMoveForce, overlap);
        Solver.applyDeformation(a, overlap, aDeformRatio, repulsionForce);
        Solver.applyDeformation(b, overlap, bDeformRatio, repulsionForce);
    }

    private static applyRepulsion(
        a: Body,
        b: Body,
        forceA: number,
        forceB: number,
        overlap: Overlap  // Recibido, no recalculado
    ): void {
        if (overlap.overlapX < overlap.overlapY) {
        const dir = overlap.normal.x >= 0 ? 1 : -1;
        a.applyForce(-dir * forceA, 0);
        b.applyForce(dir * forceB, 0);
        } else {
        const dir = overlap.normal.y >= 0 ? 1 : -1;
        a.applyForce(0, -dir * forceA);
        b.applyForce(0, dir * forceB);
        }
    }

    private static applyDeformation(
        body: Body,
        overlap: Overlap,
        deformRatio: number,
        totalForce: number
    ): void {
        if (deformRatio <= 0) return;

        const deformationAmount = totalForce * deformRatio * DEFORMATION_SCALE;

        if (overlap.overlapX > overlap.overlapY) {
        const newWidth = body.width - deformationAmount;
        body.width = Math.max(newWidth, body.minWidth);
        } else {
        const newHeight = body.height - deformationAmount;
        if (newHeight < body.minHeight) {
            const overflow = body.minHeight - newHeight;
            body.height = body.minHeight;
            body.y += overflow;
        } else {
            body.height = newHeight;
        }
        }
    }

    static restoreSize(body: Body): void {
        // Restaurar ancho
        const dw = body.idealWidth - body.width;
        if (Math.abs(dw) > 0.1) {
        const newWidth = body.width + dw * RESTORATION_RATE;
        if (dw > 0 && body.maxWidth !== undefined && newWidth > body.maxWidth) {
            body.width = body.maxWidth;
        } else if (dw < 0 && newWidth < body.minWidth) {
            body.width = body.minWidth;
        } else {
            body.width = newWidth;
        }
        }

        // Restaurar alto
        const dh = body.idealHeight - body.height;
        if (Math.abs(dh) > 0.1) {
        const newHeight = body.height + dh * RESTORATION_RATE;
        if (dh > 0 && body.maxHeight !== undefined && newHeight > body.maxHeight) {
            body.height = body.maxHeight;
        } else if (dh < 0 && newHeight < body.minHeight) {
            body.height = body.minHeight;
        } else {
            body.height = newHeight;
        }
        }
    }
}