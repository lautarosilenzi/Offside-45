# 126Goals · Pendientes

Lista de trabajo. Cada punto se marca con [x] recién cuando está hecho y probado (en celular de 360 a 430 px y en compu).
Si la sesión se corta, se sigue desde el primer punto sin marcar.

Estados: [ ] por hacer · [x] hecho y probado · [~] a medias (ver nota) · [?] esperando respuesta · ❗ a verificar

Reglas: nada se publica en la web real sin OK · no se inventan datos · no se rompe lo que funciona · nada de cuentas, claves ni pagos sin pasos previos.

## Etapa 1 — Arreglos rápidos de diseño y datos
- [x] 1. Burbujas cortadas: que se vean completas (ej.: cuadro de eliminación cortado a la izquierda en celular).
- [x] 2. Buscador "¿Qué querés ver?": burbujas repetidas; dejar una sola versión.
- [x] 3. Centrar los botones "Anterior" y "Siguiente".
- [x] 4. Fila "En vivo" solo con partidos en juego; nueva fila "Próximos" abajo, que también corra.
- [x] 5. Alineaciones en celular: apellido completo, sin cortes ni "…".
- [x] 6. Escudos, copas y logos sin recuadro blanco (fondo transparente, buena calidad).
- [x] 7. Copa América: imagen de buena calidad.
- [x] 8. Trofeo de Campeones: mejor imagen; la etiqueta "Final" no tiene que tapar los goles.
- [x] 9. Libertadores > Campeones: números pegados a la línea; revisar en todas las competencias.
- [x] 10. Sacar los carteles internos (avisos para el creador, notas, textos de prueba).
- [x] 11. Créditos de las fuentes en un lugar discreto (pie de página / "Acerca de"), cumpliendo los términos de cada fuente.
- [x] 12. Finalissima: revisar y corregir todos los datos.
- [x] 13. Supercopa Internacional: completar todas las ediciones y sus datos.
- [x] 14. Copa Oro: "Concacaf" al lado del nombre.
- [x] 15. Amistosos internacionales: sin Equipos, Estadísticas ni Campeones.
- [x] 16. Donde estén Equipos y Estadísticas, Estadísticas primero.
- [x] 17. "Campeones": que se vean de una, sin apretar otro botón.
- [x] 18. Cuadro de arriba de cada torneo más chico; descripciones más cortas.

## Etapa 2 — Barra de arriba, secciones e inicio
- [x] 19. Barra de arriba: menú, logo, lupa, calendario, En vivo, campana, Historiales y "Tu cuenta". El resto, al menú.
- [x] 20. Calendario: elegir una fecha a mano más fácil.
- [x] 21. Inicio: activador para mostrar u ocultar las cuotas.
- [x] 22. Reemplazar el fondo animado de los cuadros de arriba (línea del offside + bandera a cuadros) por uno nuevo con el 126, animado y combinado con el logo.
- [x] 23. Escudo de Rosario Central: quedó feo; poner uno bueno.
- [x] 24. Destacados: Historiales arriba de todo; sumar Balón de Oro (sacarlo de Selecciones).
- [x] 25. Argentina: Historiales arriba de todo; mover acá "Clubes argentinos en copas internacionales".
- [x] 26. Leagues Cup: sacarla de Copas de clubes; solo en Estados Unidos y México.
- [x] 27. Copa Intercontinental de la FIFA: anexo con la Copa Intercontinental vieja (1960–2004), separadas.
- [x] 28. Especiales: sacar "Jugadores"; quedan Messi vs Ronaldo y Comparador de leyendas.
- [~] 29. Vista previa linda al compartir (imagen, título y descripción). Hecho: título y descripción por página e imagen propia para partidos, torneos, jugadores y clubes. Falta probar la imagen: la herramienta que la dibuja no corre en Windows; se prueba al publicar.
- [x] 30. Botón "Contacto", listo para poner el mail después.

## Etapa 3 — Más contenido y desgloses
- [x] 31. Campeones año a año: cuántos títulos llevaba cada campeón hasta ese año.
- [x] 32. Campeones: separar era amateur y era profesional.
- [x] 33. Al tocar una edición o campeón: cuadro visual, estadísticas (goleadores…) y partido por partido. (Respuesta: OK que las ediciones viejas muestren solo lo bien documentado.)
- [x] 34. Copa del Mundo: desglose de cada edición con muchos más datos.
- [ ] 35. Messi vs Ronaldo: más completo, con el cuadro de arriba más chico.
- [x] 36. Perfiles de clubes completos y profesionales, con sus partidos. El DT sale del encabezado y va arriba de todo en la lista del plantel.
- [?] 37. Valor de mercado de cada jugador (tipo Transfermarkt). → proponer fuentes con costo.
  - Hoy: no hay fuente. Transfermarkt no tiene API y sus condiciones prohíben copiar sus datos (ni a mano ni con programas).
  - Opciones: (a) no mostrarlo; (b) un proveedor pago con valores de mercado propios (por ejemplo Sportmonks o similares: hay que pedir cotización, suelen ser planes desde ~€100/mes); (c) acuerdo directo con Transfermarkt (licencia, a consultar).
- [?] 38. Por dónde pasan cada partido (TV / streaming) según el país. → proponer fuentes con costo.
  - Hoy: ESPN solo trae los canales de Estados Unidos; de Argentina, nada.
  - Opciones: (a) cargar a mano los canales de los torneos argentinos (ESPN/TNT Sports/TyC/Telefe según el torneo), gratis pero hay que mantenerlo; (b) Sportmonks, que tiene "TV Stations" por partido y país (planes desde ~€29/mes; confirmar si los canales están en el plan); (c) LiveSoccerTV (licencia paga, a consultar).
- [?] 39. Jugadores con foto de Primera Nacional, Primera B Metropolitana y Primera C. → revisar fuentes.
  - Hoy: Primera Nacional (36 equipos) y B Metro (22) tienen planteles en ESPN (nombre, edad, número), casi sin fotos. Primera C: ESPN tiene partidos pero no planteles.
  - Opciones: (a) mostrar los planteles sin foto (gratis, ya funciona en la página de cada club); (b) API-Football (desde ~US$19/mes) tiene fotos de muchos jugadores del ascenso: hay que confirmar la cobertura de B Metro y C con una clave de prueba gratis.
- [x] 40. Torneos de Inglaterra, España, Francia, Italia y Alemania (ya están en el menú). Respuesta: revisar y mejorar los perfiles de jugadores.

## Etapa 4 — Revisión general
- [ ] 41. Recorrer toda la app en celular y compu; arreglar y anotar acá cada error encontrado.

Errores encontrados en la revisión general:
- (se completa en la etapa 4)

## Etapa 5 — Cuentas y servicios externos (necesitan algo del dueño)
- [~] 42. Botón "Crear cuenta" (Supabase) + página de privacidad. Hecho: ícono "Tu cuenta" en la barra, alta/entrar/olvidé la contraseña, página /privacidad. Falta (dueño): crear el proyecto de Supabase, correr supabase/schema.sql y supabase/cuentas.sql, y cargar las 2 claves en Vercel. Sin eso, la cuenta se guarda en el navegador.
- [~] 43. Censo del Hincha: buscador de cualquier club del mundo, uno solo; se guarda en la cuenta. Página pública /censo con los totales por club (nunca quién es quién). Se activa con Supabase.
- [~] 44. Favoritos: botón "☆ Seguir" en cada club y torneo; en Mi cuenta, cada favorito con su partido en juego o próximo y su último resultado. Funciona ya en el navegador; con Supabase, en la cuenta.
- [~] 45. Notificaciones: hoy avisa con la página abierta (Alertas). Propuesta para avisos reales en el celular, abajo. Necesita decisión y un servicio que revise los partidos cada minuto.
- [~] 46. Mercado Pago para donaciones: la página /colaborar muestra botones de $1.000, $3.000 y $5.000 (y "Otro monto"). Falta (dueño): crear los "Link de pago" en Mercado Pago y pegarlos en lib/site.ts.
- [x] 47. Otros países: base armada. En el menú se elige el país (Argentina, Uruguay, Chile, Colombia, México, España, Estados Unidos) y cambian los Destacados del menú y de la portada. Idioma: todo en castellano por ahora (queda preparado el campo de idioma).
- [~] 48. Dominio propio: 126goals.com, 126goals.net y 126goals.app figuran libres (octubre de 2026). Pasos y costo en el resumen final.

### Propuesta de notificaciones (punto 45)
- Avisos: gol de tu equipo (o de un partido que seguís), empieza el partido (15 minutos antes), alineaciones confirmadas, entretiempo y resultado final, tarjeta roja y penal.
- Qué hace falta: (1) cuentas activas (Supabase); (2) un "service worker" y claves de notificación (las genero yo, son gratis); (3) un servicio que mire los partidos cada minuto y mande los avisos. En el plan gratis de Vercel las tareas programadas corren una vez por día: alcanzaría con Supabase (gratis, con tareas cada minuto) o con Vercel Pro (US$20/mes).
- En iPhone los avisos llegan solo si la página se agrega a la pantalla de inicio (iOS 16.4 o más nuevo).

## Datos verificados en esta tanda
- Supercopa Internacional, 4 ediciones (Wikipedia en inglés + prensa): 2022 Racing 2-1 Boca (Al Ain, ene-2023) · 2023 Talleres 0-0 River, 3-2 pen. (Asunción, 5-3-2025) · 2024 Vélez 2-0 Estudiantes (Avellaneda, jul-2025) · 2025 Rosario Central 3-1 Estudiantes (Santiago del Estero, 26-9-2026).
- Finalissima 2026 España-Argentina (Lusail, 27-3-2026): CANCELADA por la UEFA el 15-3-2026; no se jugó. Ediciones jugadas: 1985 Francia 2-0 Uruguay · 1993 Argentina 1-1 Dinamarca (5-4 pen.) · 2022 Argentina 3-0 Italia.
- Trofeo de Campeones 2025: Estudiantes 2-1 Platense (San Nicolás, 20-12-2025).

## Datos a verificar
- ❗ Supercopa Argentina 2025 (Estudiantes vs Independiente Rivadavia): la lista llega hasta 2024; confirmar si ya se jugó y el resultado.
- ❗ Fecha exacta de la Supercopa Internacional 2022 (enero de 2023) y 2024 (7 u 8 de julio de 2025: las fuentes no coinciden). Se muestra solo el mes.
