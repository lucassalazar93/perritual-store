# Perritual — maqueta interactiva

Maqueta estática y privada para validar el recorrido completo de una tienda de tortas y regalos para perros. No procesa compras ni envía mensajes. Los datos del catálogo, recetas, precios, promociones y horarios son ilustrativos.

## Ejecutar
Servir `dist/` con cualquier servidor de archivos estáticos. No requiere dependencias ni compilación. `dist/index.html` es la entrada.

## Arquitectura implementada
- `index.html`: estructura semántica de la tienda y diálogos nativos.
- `styles.css`: identidad cálida y artesanal, responsive, foco visible, movimiento reducido y efecto spotlight con puntero.
- `core.js`: catálogo, precios por personalización, reglas de promoción, tarifas demo y validación de anticipación en UTC−05:00.
- `app.js`: catálogo filtrable, búsqueda, configurador ilustrativo, bolsa, entrega, revisión y mensaje de WhatsApp. Datos insertados en HTML escapados.
- Activos locales WebP: logo aportado y fotografía conceptual generada con imagegen. Prompt: beagle celebrando junto a torta y regalo en estudio crema, coral y terracota, editorial artesanal; sin texto ni logotipos. Seis fotografías conceptuales de producto generadas con imagegen. El configurador muestra las elecciones en una tarjeta, sin prometer que la fotografía reproduzca el acabado final.

## Flujo
Inicio → categoría/búsqueda → producto → personalización → bolsa → entrega/recogida → revisión → mensaje copiable de WhatsApp. Volver y editar conserva datos durante la sesión. La bolsa persiste en localStorage. Los datos del formulario de entrega se mantienen únicamente en memoria.

## Reglas de demostración
- Anticipación mínima de 24 horas exactas. Se comprueba al avanzar y al preparar el mensaje, con hora de Colombia.
- Horarios propuestos: 10:00, 14:00 y 17:00. No representan disponibilidad real.
- Descuento del 10% desde $150.000 de subtotal. Envío gratis desde $180.000 después del descuento. Son hipótesis para probar el flujo, no decisiones comerciales aprobadas.
- Recogida sin costo; punto por acordar. Domicilio: diez municipios del Valle de Aburrá, con tarifas de ejemplo.
- Impuestos incluidos en precios demo: sin afirmar una clasificación ni tarifa tributaria real.
- WhatsApp solo muestra/copia un mensaje; no hay número conectado ni envío real. Preparar el mensaje no equivale a pedido confirmado.

## Evolución recomendada
Separar frontend de servicios de catálogo, disponibilidad, promociones y pedidos. Para la tienda real, evaluar Shopify como administración comercial y un tema personalizado inicialmente; una interfaz Hydrogen solo si la personalización visual requiere ese grado de control. No hace falta elegir el stack definitivo para validar esta maqueta. Validar integraciones y límites del plan vigente antes de presupuestar checkout o extensiones.

1. Catálogo: productos, variantes, SKU, tamaños, sabores, extras, fotos reales e información alimentaria validada. Mantener regalos no alimentarios separados de recetas.
2. Personalización: objeto asociado a cada línea de pedido, con versión de opciones, precio calculado por servidor y validación de caracteres. El preview no debe prometer acabados exactos.
3. Agenda: capacidad por día, cupos por franja, anticipación, días de cierre y zona. Reserva atómica temporal al confirmar, con vencimiento. La selección de una fecha no basta para reservar capacidad.
4. Carrito y promociones: fuente única de reglas; recalcular precios, impuestos y envío en servidor. Persistencia anónima y reconciliación al iniciar sesión. Aplicar idempotencia a creación de pedidos.
5. WhatsApp: número comercial verificado, enlace con resumen mínimo y código de solicitud. Marcar como solicitud pendiente hasta confirmación del equipo. Evitar poner datos sensibles en URL. Recordatorios solo con consentimiento y mecanismos de baja; no están implementados en la maqueta.
6. Pago futuro: pasarela alojada/tokenizada, nunca almacenar tarjetas. Webhooks firmados, idempotentes y auditables; separar estados de pago, producción y entrega.
7. Seguridad: validar entradas en servidor, protección contra abuso, gestión de permisos, políticas de datos y retención. No confiar en localStorage para precios ni disponibilidad. Evitar guardar datos personales innecesarios.
8. Rendimiento: WebP/AVIF, dimensiones de imágenes explícitas, carga diferida fuera del primer pantallazo, caché/CDN. Servir fuentes locales en producción. Limitar animaciones a transform/opacity y respetar prefers-reduced-motion. Objetivos a medir: LCP ≤2,5 s, INP ≤200 ms y CLS ≤0,1.
9. Accesibilidad: diálogos nativos, etiquetas, estados y errores legibles, navegación con teclado, contraste, orden de foco y pruebas con lector de pantalla. La maqueta no certifica conformidad WCAG; falta auditoría en dispositivos reales.
10. Medición: view_item_list → select_item → view_item → customize_product → add_to_cart → begin_checkout → select_delivery → review_order → prepare_whatsapp → confirmed_order. Confirmed_order debe provenir del sistema operativo o del equipo, nunca del clic en WhatsApp. Medir abandono por paso, ticket promedio, adopción de kits y extras, margen después de incentivos, solicitudes y pedidos confirmados. No enviar nombres, teléfonos, direcciones ni notas a analítica.

## Validación realizada
Comprobación sintáctica de JavaScript y pruebas de lógica para tamaño/extras, descuentos, envío gratis, recogida y límites exactos de 24 horas con zona Colombia. No hubo herramienta de navegador compatible disponible para comprobar renderizado, teclado o dispositivos; esa verificación queda pendiente.

## Pendientes comerciales
Producción propia/proveedor; catálogo y costos reales; recetas y restricciones; porciones/conservación/vencimiento; fotos; capacidad y punto de recogida; cobertura por barrio; tarifas e impuestos; número WhatsApp; políticas de compra y privacidad; presupuesto y stack final.

## Actualización visual
`experience.css` y `experience.js` incorporan la composición y el sistema de movimiento documentados en DESIGN.md. Fuentes locales, fotografías WebP, historia del kit durante el scroll, transiciones de diálogos y control para pausar efectos. No cambia las reglas comerciales de demostración.

### Verificación de la actualización
- Sintaxis JavaScript, parseo CSS y existencia de activos locales: correctos.
- Pruebas DOM de interacción con condiciones simuladas de escritorio/móvil: filtros, personalización, cantidades, descuentos, fecha inválida y válida, revisión, mensaje, recogida, pausa y restauración de bolsa.
- Preferencia de movimiento reducido y cierre de diálogo mediante teclado verificados en DOM.
- Estas pruebas no renderizan la página ni miden fluidez; se mantiene pendiente la inspección visual en navegador.

## Recomendaciones para alcanzar envío gratis
La bolsa propone hasta dos combinaciones de complementos, con un máximo de tres unidades por combinación. Simula el subtotal y el descuento antes de prometer el beneficio; muestra el valor añadido y el total final de productos. Prioriza complementos y evita favorecer juguetes repetidos cuando el pedido ya tiene uno. Los cupcakes heredan nombre, edad, sabor y color del primer producto personalizado, con explicación visible y edición disponible. Si ninguna combinación limitada alcanza el umbral, muestra cuánto falta sin afirmar que ya se logra.

La brecha ahora indica cuánto agregar antes del descuento: en el ejemplo de $142.000 faltan $58.000 de productos para llegar a $180.000 netos. Dos cajas de cupcakes añaden $64.000, el descuento es $20.600 y el total de productos queda en $185.400. Pruebas de reglas y DOM verificaron las recomendaciones, adición de la combinación, conservación de detalles, mensaje de logro y recálculo al eliminar.

### October 11 · feedback layers and spatial journey
- Status messages live inside the active dialog for accessibility and use a manual native popover to render above its backdrop. Older browsers receive an in-dialog sticky fallback. Messages clear when a new dialog opens and remain visible for five seconds.
- Cart quantity changes preserve keyboard focus; invalid delivery slots focus the explanatory error. Interrupted modal exit animations cannot close a newly reopened dialog.
- Scroll choreography adds chapter-dependent colors, a masked photo reveal, orbit accents, a journey progress line, and progressive CSS depth entrances. Native scrolling stays intact. Short mobile screens avoid sticky scenes; reduced motion and the pause control suppress effects.
- DOM flow checked at 1280/375 fixtures: catalog, customization, cart, reward recommendations, date validation, pickup, review, clipboard feedback, persistence, pause and Escape. Popover hosting and invocation checked with DOM stubs. This is not browser rendering or frame-rate verification; browser QA unavailable in this environment.
