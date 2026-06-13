# ReForm

> Este repositorio no es una librería, ni tampoco es un framework (todavia¿?). Es una investigación en progreso, una hipótesis sobre cómo debería funcionar el layout en la web, y el proceso de intentar demostrarla.

---

## Manifiesto

Llevamos décadas construyendo interfaces con la misma metáfora: cajas dentro de cajas, reglas sobre reglas. CSS no está roto, hace exactamente lo que fue diseñado para hacer. El problema es que fue diseñado para un mundo donde las pantallas no cambiaban de tamaño.

Hoy el desarrollador tiene que imaginar cada contexto, escribir cada caso, y rezar para que nada colisione. Es un trabajo de predicción disfrazado de diseño.

Es un sistema frágil porque su modelo mental es el de **cajas con reglas fijas**. Alteras un elemento y desalineas tres componentes abajo. Agregas un breakpoint y introduces un conflicto nuevo. El sistema no sabe **ceder**, solo sabe **obedecer**, y cuando dos reglas se contradicen, falla. No es un problema de sintaxis, es más bien un problema de arquitectura.

Mientras pensaba en una solución, me vino a la mente la naturaleza. El agua no tiene `width`, `height` ni `flex` y sin embargo siempre encuentra la forma de ocupar el espacio disponible. ¿Existe alguna fuerza natural que explique cómo acomodar objetos dentro de un contenedor?

Empecé investigando mecánica de fluidos y terminé en otro lugar: soft body physics. A veces investigas una cosa y encuentras otra. (Aunque a veces me pregunto si esto no será una aberración innecesaria.)

---

## La hipótesis

> *Los sistemas de layout basados en reglas fallan en pantallas variables porque modelan el espacio como un problema de lógica. Un sistema basado en física modela el espacio como un problema de energía y los problemas de energía siempre tienen solución (o eso parece).*

ReForm investiga si ese principio puede aplicarse al layout de interfaces.

---

## Qué es ReForm

Un **motor de simulación física aplicado a layout 2D**.

No es una librería, y tampoco es un framework, es infraestructura. Lo que se construya encima queda fuera de su alcance.

La idea es tratar cada componente de interfaz como un cuerpo blando con propiedades físicas:

```json
{
  "id": "banner",
  "masa": 90,
  "rigidez": 0.9,
  "magnetismo": 15
}
```
> *Esto en realidad es solo una idea, ya veremos mas adelante cual serian las propiedades a tomar en cuenta.*


En teoria, si el motor simula las fuerzas entre objetos y encuentra el estado de menor energía, obtendremos el layout óptimo para el espacio disponible.

---

## El modelo físico

ReForm utiliza **soft body dynamics simplificado en 2D**.

O al menos esa es la idea. A diferencia de los cuerpos rígidos, los objetos en ReForm estan pensados para que puedan deformarse al colisionar. Cuánto ceden depende de su `rigidez`. Un objeto con rigidez alta defiende su espacio. Un objeto con rigidez baja se adapta a lo que queda disponible.

Esto de funcionar, resolveria el problema de los sistemas de constraints: no hay conflicto porque los objetos más rígidos dominan el espacio y los más flexibles se acomodan alrededor. La jerarquía emerge de las propiedades, no de reglas impuestas.

**Propiedades del modelo:**

| Propiedad | Descripción |
|-----------|-------------|
| `masa` | Cuánto espacio defiende el objeto |
| `rigidez` | Qué tan resistente es a deformarse |
| `magnetismo` | Fuerza de repulsión hacia otros objetos |

---

> *Si me preguntas hoy, estas tres propiedades son suficientes para modelar lo que necesito. Pero no lo sé con certeza, lo descubriré en el prototipo, tal vez incluso puede que reformule el significado de las propiedades.*

## Antecedentes

Este no es el primer intento de resolver el problema, y creo que vale la pena entender por qué los anteriores no escalaron:

**CCSS — Constraint CSS (Greg Badros, 1999)**
Propuso un sistema de constraints para layout web. Demostró layouts responsivos que los desarrolladores de hoy todavía no reproducen fácilmente. El W3C lo ignoró por más de una década.

**Apple AutoLayout (OS X Lion)**
Tomó las mismas ideas de CCSS e implementó el algoritmo Cassowary. Funciona en el ecosistema cerrado de Apple, pero nunca llegó a la web. Su problema: cuando las constraints se contradicen, el sistema no sabe qué regla romper.

**Grid Style Sheets (GSS)**
Intentó traer constraints a la web reemplazando el motor de layout del navegador. Funcionaba como un hack de posicionamiento absoluto. Mismo problema: conflictos de reglas sin resolución elegante.

**El patrón:** todos modelan el layout como un problema de lógica. ReForm lo modelaria como un problema de energía.

---

## Inspiración directa

**[Pretext — Cheng Lou](https://github.com/chenglou/pretext)**

La idea nació viendo un video de **Midudev** donde presentaba el trabajo de Cheng Lou con Pretext. Pretext resuelve el layout de texto sin tocar el DOM y me quedé pensando: ¿por qué nadie ha hecho lo mismo para los objetos en el espacio? De ahí nació la idea de ReForm. (Aunque honestamente de solo investigar ya vi por que.)

Pretext resuelve el layout y medición de texto sin tocar el DOM, usando matemáticas puras. Es muchisimas veces más rápido que los métodos tradicionales.

Pretext resuelve lo que hay **dentro** de los objetos y cómo fluye el texto. El trabajo con ReForm resolveria dónde van los objetos **en el espacio**.

---

## Fuera del alcance (por ahora y quien sabe si para siempre)

- Semántica y jerarquía visual humana
- Cómo se consume el motor (API, componentes, CLI)
- Integración con frameworks existentes

**Pregunta de expansión futura:** ¿Puede el motor incorporar semántica como propiedad física? ¿Puede `semantica: "destructivo"` traducirse en una fuerza de repulsión?

---

## Stack

**Fase 1 — Validación de hipótesis**
- TypeScript
- Canvas API
- Vite

Primero validamos que el modelo funciona. Sin frameworks, sin dependencias innecesarias. El motor es el protagonista.(Y yo, por ahora, solo quiero ver si funciona.)

**Fase 2 — Optimización**
- Rust → WebAssembly

Cuando la hipótesis esté demostrada, el núcleo migra a Rust para rendimiento real en el navegador.

---

## Bitácora de investigación

*Las entradas se ordenan de la más reciente a la más antigua. El proceso es el producto (creo que eso es liberador).*

---

*Por el momento no hay entradas, la investigación comienza aquí.*