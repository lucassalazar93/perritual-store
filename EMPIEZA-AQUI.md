# Perritual: editar y desplegar

Esta entrega contiene el código de la versión publicada el 11 de octubre de 2026 (UTC), con la corrección de mensajes sobre diálogos y las nuevas transiciones de scroll.

## 1. Abrir y ejecutar
Descomprime el ZIP y abre la carpeta perritual en VS Code o tu editor.
Es HTML, CSS y JavaScript nativo: no requiere npm, dependencias ni compilación.
Con Python 3 instalado, abre una terminal en esta carpeta y ejecuta:

```sh
python -m http.server 8080 --bind 127.0.0.1 --directory dist
```

En Windows también puedes usar `py` en lugar de `python`; en macOS/Linux, `python3`.
Abre http://localhost:8080. Detén el servidor con Ctrl+C.
También puedes servir dist con la herramienta de servidor estático de tu editor.

## 2. Dónde editar
| Archivo | Contenido |
| --- | --- |
| dist/index.html | Secciones, textos y estructura de diálogos |
| dist/core.js | Catálogo, precios, promociones, recomendaciones y horarios |
| dist/app.js | Personalización, carrito, entrega y resumen de WhatsApp |
| dist/styles.css | Estilos base y responsive |
| dist/experience.css | Diseño final, transiciones y efectos visuales |
| dist/experience.js | Scroll, cambios de escena, animaciones y foco |
| dist/journey.css | Pantalla de carga, cintas, manifiesto, órbita y pie de página |
| dist/journey.js | Carga con el logo, escenas ligadas al scroll y profundidad con el puntero |
| dist/fonts.css | Fuentes locales |
| dist/*.webp | Logo y fotografías conceptuales |

Conserva el orden core.js → app.js → experience.js → journey.js. Los estilos van en el orden styles.css → experience.css → journey.css. Edita los archivos de dist directamente: en este proyecto también son el código fuente.

## 3. Desplegar en tu propio hosting
Usa un alojamiento de sitios estáticos con HTTPS. La carpeta a publicar es `dist` y la página de entrada es `index.html`.
- Si el alojamiento pide comando de build: ninguno.
- Si pide carpeta de salida o publicación: `dist`.
- Si subes archivos por un administrador de hosting: sube el CONTENIDO de dist a la raíz pública del sitio, conservando nombres y rutas.
- No necesitas un servidor Node, base de datos ni variables secretas para esta maqueta.
- El servidor Python de arriba es únicamente para desarrollo local.

La configuración privada de ChatGPT Sites y el historial .git no se incluyen: no son necesarios para desplegar esta copia. Este paquete no modifica el sitio ya publicado. El control de acceso del nuevo alojamiento debe configurarse allí; la privacidad del sitio original no se transfiere al ZIP.

## 4. Continuar con Git
Desde la carpeta perritual:

```sh
git init
git add .
git commit -m "Base de Perritual"
```

Crea un repositorio en el proveedor que uses y sigue sus instrucciones para conectar el remoto y subir tu proyecto.

## 5. Validación antes de publicar
Prueba en escritorio y móvil: buscar, personalizar, añadir, editar cantidades, eliminar, agregar recomendaciones, programar con 24 horas, alternar recogida/domicilio, revisar y copiar el mensaje. Comprueba mensajes sobre las ventanas, teclado, Escape, pausa de efectos y movimiento reducido.
Las pruebas funcionales anteriores se ejecutaron en DOM simulado. La inspección visual en navegador y dispositivos reales sigue pendiente.
El carrito se guarda en localStorage del dominio; al cambiar de dominio no se transfiere. Los datos de entrega solo permanecen en memoria durante la visita.

## 6. Alcance
Sigue siendo una maqueta: catálogo, precios, tarifas y beneficios de ejemplo. No hay cobro, reserva, disponibilidad real ni envío automático a WhatsApp. El flujo prepara/copia un mensaje; antes de operar hay que conectar el canal comercial y validar datos y reglas en servidor.
Incluye las imágenes locales y las licencias OFL de las fuentes. README.md, PRODUCT.md y DESIGN.md documentan decisiones y pendientes.
