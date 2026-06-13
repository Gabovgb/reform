# ReForm

> Este repositorio no es una librería, ni tampoco es un framework (todavía?). Es una investigación en progreso, una hipótesis sobre cómo debería funcionar el layout en la web, y el proceso de intentar demostrarla.

---

## Manifiesto

Llevamos décadas construyendo interfaces con la misma metáfora: cajas dentro de cajas, reglas sobre reglas. CSS no está roto, hace exactamente lo que fue diseñado para hacer. El problema es que fue diseñado para un mundo donde las pantallas no cambiaban de tamaño.

Hoy el desarrollador tiene que imaginar cada contexto, escribir cada caso, y rezar para que nada colisione. Es un trabajo de predicción disfrazado de diseño.

Es un sistema frágil porque su modelo mental es el de **cajas con reglas fijas**. Alteras un elemento y desalineas tres componentes abajo. Agregas un breakpoint y introduces un conflicto nuevo. El sistema no sabe **ceder**, solo sabe **obedecer**, y cuando dos reglas se contradicen, falla. No es un problema de sintaxis, es más bien un problema de arquitectura.

CSS ha intentado resolver esto. Flexbox, Grid y Container Queries permiten que los elementos cedan y se adapten sin breakpoints explícitos. Pero lo hacen dentro de la jerarquía del DOM: un padre controla a sus hijos. Lo que CSS no puede hacer es que dos elementos sin relación jerárquica negocien directamente su espacio en función de sus propias restricciones físicas.

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

En CSS, cuando dos reglas colisionan, una se impone y la otra se descarta. En ReForm, la idea es que, cuando dos objetos colisionan, negocian el espacio, ambos pueden ceder, aunque no en la misma medida.

En teoría, si el motor simula las fuerzas entre objetos y encuentra el estado de menor energía, obtendremos una distribución espacial equilibrada para el espacio disponible.

---

## El modelo físico

ReForm utiliza **soft body dynamics simplificado en 2D**.

O al menos esa es la idea. A diferencia de los cuerpos rígidos, los objetos en ReForm estan pensados para que puedan deformarse al colisionar. Cuánto ceden depende de su `rigidez`. Un objeto con rigidez alta defiende su espacio. Un objeto con rigidez baja se adapta a lo que queda disponible.

Esto de funcionar, resolveria el problema de los sistemas de constraints: no hay conflicto porque los objetos más rígidos dominan el espacio y los más flexibles se acomodan alrededor. La jerarquía emerge de las propiedades, no de reglas impuestas.

**Propiedades del modelo:**

| Propiedad | Descripción |
|-----------|-------------|
| `masa` | Cuánto espacio defiende el objeto |
| `rigidez` | Resistencia a la deformación |
| `magnetismo` | Fuerza de repulsión hacia otros objetos |

---

> *Si me preguntas hoy, estas tres propiedades son suficientes para modelar lo que necesito. Pero no lo sé con certeza, lo descubriré en el prototipo, tal vez incluso puede que reformule el significado de las propiedades.*

## Antecedentes

Este no es el primer intento de resolver el problema, y creo que vale la pena entender por qué los anteriores no lograron resolverlo para la web dinámica y multiplataforma:

**CCSS — Constraint CSS (Greg Badros, 1999)**
Propuso un sistema de constraints para layout web. Demostró layouts responsivos que los desarrolladores de hoy todavía no reproducen fácilmente.  La propuesta permaneció ignorada fuera del ámbito académico durante [más de una década](https://gss.github.io/guides/ccss), hasta que Apple rescató el algoritmo Cassowary para su motor AutoLayout.

**Apple AutoLayout (OS X Lion)**
Tomó las mismas ideas de CCSS e implementó el algoritmo Cassowary. Funciona muy bien en el ecosistema de Apple, pero nunca llegó a la web. Su limitación: resuelve conflictos mediante prioridades numéricas, lo que traslada la responsabilidad al desarrollador de predecir qué restricción debe ceder. En la práctica, sigues modelando el espacio como un problema de lógica.

**Grid Style Sheets (GSS)**
Intentó traer constraints a la web reemplazando el motor de layout del navegador mediante un hack de posicionamiento absoluto. Mismo modelo mental de prioridades, rendimiento limitado y nula integración con el flujo natural del DOM.

**El patrón**
Todos los intentos anteriores trataron el espacio como un problema de lógica e inecuaciones matemáticas rígidas. Aunque Cassowary es ingenioso y funciona en entornos controlados, históricamente ha demostrado ser una experiencia hostil para el desarrollador cuando se aplica a interfaces dinámicas y multiplataforma: en los inicios de React Native, el equipo intentó usar Cassowary y descubrió que definir flujos dinámicos (como texto) con ecuaciones lineales rígidas era [insostenible](https://news.ycombinator.com/item?id=13125093). ReForm propone modelarlo como un problema de energía, donde la solución emerge de la negociación entre fuerzas, no de la imposición de una regla sobre otra.

---

## Inspiración directa

**[Pretext — Cheng Lou](https://github.com/chenglou/pretext)**

La idea nació viendo un video de **Midudev** donde presentaba el trabajo de Cheng Lou con Pretext. Pretext resuelve el layout de texto sin tocar el DOM y me quedé pensando: ¿por qué nadie ha hecho lo mismo para los objetos en el espacio? De ahí nació la idea de ReForm. (Aunque honestamente de solo investigar ya vi por qué.)

Pretext resuelve el layout y medición de texto sin tocar el DOM, usando matemáticas puras. Es muchísimas veces más rápido que los métodos tradicionales.

Pretext resuelve lo que hay **dentro** de los objetos y cómo fluye el texto. El trabajo con ReForm resolveria dónde van los objetos **en el espacio**.

---

## Fuera del alcance (por ahora y quien sabe si para siempre)

- Semántica y jerarquía visual humana
- Cómo se consume el motor (API, componentes, CLI)
- Integración con frameworks existentes

El motor encuentra la configuración de menor energía física, no necesariamente la más usable para un humano. La intención, la jerarquía visual y la semántica son capas superiores que este "motor" no resuelve (por ahora).

El motor debe ser determinista: mismos inputs, mismo layout. Esto se puede garantizar usando un paso de simulación fijo, independiente de la tasa de refresco del dispositivo.

**Pregunta de expansión futura:** ¿Puede el motor incorporar semántica como propiedad física? ¿Puede `semantica: "destructivo"` traducirse en una fuerza de repulsión?

---

## Las grietas en la hipótesis

Esto sería deshonesto si no admitiera los problemas que veo en mi propia idea.

**¿Es realmente diferente a ajustar prioridades?**
En Cassowary, el desarrollador asigna prioridades numéricas para resolver conflictos. En ReForm, se asignaria masa, rigidez y magnetismo (por ejemplo). La pregunta incómoda es: ¿cuál es la diferencia real? ¿Es más intuitivo pensar en "masa 90" que en "prioridad 750"? No lo sé todavía. Esto es como las matrioskas, una hipótesis dentro de la hipótesis, y el experimento debería responderla.

**La física no tiene sentido estético.**
El estado de menor energía no es necesariamente un layout usable. Dos objetos en equilibrio físico pueden quedar en una posición matemáticamente correcta pero visualmente inútil. El motor resuelve el espacio, no el diseño. Hasta dónde puede llegar sin intervención humana es algo que solo el prototipo puede responder.

**El jittering.**
Si dos objetos tienen propiedades similares y compiten por el mismo espacio, podrían nunca llegar a un equilibrio estable, oscilando indefinidamente. Es un problema conocido en motores de física y necesita una solución explícita en el motor.

**El determinismo.**
Un motor de física en tiempo real puede producir resultados ligeramente distintos dependiendo del dispositivo o la tasa de refresco. Para que ReForm sea útil, el layout debe ser reproducible: mismos inputs, mismo output. La solución propuesta es usar un paso de simulación fijo, pero queda por demostrar que funciona en la práctica.

---

## Pensamientos

No sé si esto es el camino correcto.

No soy investigador, ni científico, ni experto en motores de física. Solo soy alguien que tuvo una idea y quiere ponerla a prueba. Y soy muy consciente de que esta hipótesis puede estar completamente equivocada.

Me pregunto si el problema no es CSS en sí, sino la naturaleza misma del diseño visual que necesita ser rígido, controlable y orquestado para ser útil. Que la intención humana no se puede delegar a un sistema físico. Que el layout siempre va a requerir predicción porque el diseño es, por definición, un acto de control. Más que un defecto del sistema parece ser parte del oficio.

¿Y si el camino correcto no es un motor nuevo sino extender lo que ya existe? ¿Como quitarle al programador el trabajo de predecir sin cambiar el modelo completo?

Pero otras veces pienso... ¿y si no fuese así? ¿Y si el layout pudiera ser más fácil? ¿Y si pudiéramos quitarnos de encima parte del trabajo de predecir cómo se comportará cada elemento en cada pantalla?

Tal vez solo estoy divagando mucho.

No tengo las respuestas. Solo tengo la incomodidad de las preguntas y un canvas en blanco.

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
## 2026-06-13 — El problema de rendimiento como pista arquitectónica

Mientras pensaba en optimización y que los dispositivos no exploten intentando hacer cálculos, me di cuenta de algo que no esperaba.

El problema de O(n²), tener que calcular interacciones entre todos los objetos simultáneamente no es solo un problema de rendimiento. Es una señal de que el motor no debería operar globalmente sobre todos los objetos a la vez.

Y eso me dio una pista sobre la arquitectura correcta y es que sí: **necesitas niveles**.

- **Nivel micro** — física local dentro de un dominio. Pocos objetos, O(n²) manejable.
- **Nivel macro** — dominios que negocian entre sí. También pocos, también manejable.

Nunca calculas todo contra todo globalmente. La jerarquía no es solo una decisión de diseño, es la solución natural al problema de rendimiento.

O bueno... por ahora lo veo así.

---