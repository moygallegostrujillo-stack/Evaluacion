/**
 * Auto-generate evaluation templates and questions for a position.
 * Every position gets: PSICOMETRICA (Big Five) + PSICOLOGICA + INTEGRIDAD
 * If hasKnowledgeTest: also CONOCIMIENTOS with category-specific questions
 */

import { getUnscopedClient } from '@/lib/rls'

// ── Big Five personality questions (shared across all positions) ──
const BIG_FIVE_QUESTIONS = [
  { text: 'Disfruto probar nuevas formas de hacer las cosas en el trabajo', category: 'OPENNESS', order: 1 },
  { text: 'Me considero una persona creativa e imaginativa', category: 'OPENNESS', order: 2 },
  { text: 'Siempre organizo mis tareas antes de empezar a trabajar', category: 'CONSCIENTIOUSNESS', order: 3 },
  { text: 'Cuando me propongo algo, lo completo sin importar los obstáculos', category: 'CONSCIENTIOUSNESS', order: 4 },
  { text: 'Me siento cómodo/a iniciando conversaciones con personas que no conozco', category: 'EXTRAVERSION', order: 5 },
  { text: 'Disfruto trabajar en equipo más que de forma individual', category: 'EXTRAVERSION', order: 6 },
  { text: 'Me preocupa que mis compañeros de trabajo se sientan bien', category: 'AGREEABLENESS', order: 7 },
  { text: 'Prefiero llegar a un acuerdo que ganar una discusión', category: 'AGREEABLENESS', order: 8 },
  { text: 'Me estreso fácilmente cuando tengo mucho trabajo por hacer', category: 'NEUROTICISM', order: 9, reverseScored: true },
  { text: 'Me cuesta controlar mis emociones cuando algo sale mal', category: 'NEUROTICISM', order: 10, reverseScored: true },
]

// ── Psychological competence questions (shared across all positions) ──
const PSICOLOGICA_QUESTIONS = [
  { text: 'Me siento abrumado/a cuando tengo múltiples tareas pendientes', category: 'STRESS', order: 1, reverseScored: true },
  { text: 'Me cuesta desconectar del trabajo después de mi jornada', category: 'STRESS', order: 2, reverseScored: true },
  { text: 'Puedo entender cómo se sienten mis compañeros aunque no lo digan', category: 'EMPATHY', order: 3 },
  { text: 'Me resulta fácil ponerme en el lugar del cliente cuando tiene un problema', category: 'EMPATHY', order: 4 },
  { text: 'Me adapto rápidamente a cambios en mi rutina de trabajo', category: 'ADAPTABILITY', order: 5 },
  { text: 'Cuando cambian las reglas o procedimientos, me ajusto sin problema', category: 'ADAPTABILITY', order: 6 },
  { text: 'Cuando hay un problema, suelo tomar la iniciativa para resolverlo', category: 'LEADERSHIP', order: 7 },
  { text: 'Mis compañeros me piden ayuda para organizar el trabajo', category: 'LEADERSHIP', order: 8 },
  { text: 'Prefiero colaborar con otros para alcanzar una meta que hacerlo solo/a', category: 'TEAMWORK', order: 9 },
  { text: 'Escucho y respeto las opiniones de mis compañeros aunque no esté de acuerdo', category: 'TEAMWORK', order: 10 },
]

// ── Integrity questions (shared across all positions — orientative, never auto-filter) ──
const INTEGRIDAD_QUESTIONS = [
  // INTEGRITY_HONESTY (3 questions)
  { text: 'Si cometo un error en el trabajo, lo comunico a mi supervisor de inmediato', category: 'INTEGRITY_HONESTY', order: 1 },
  { text: 'Considero que decir la verdad es más importante que evitar un problema temporal', category: 'INTEGRITY_HONESTY', order: 2 },
  { text: 'En situaciones de presión, he ocultado información para evitar consecuencias', category: 'INTEGRITY_HONESTY', order: 3, reverseScored: true },
  // INTEGRITY_RULES (3 questions)
  { text: 'Sigo los procedimientos establecidos aunque nadie me esté observando', category: 'INTEGRITY_RULES', order: 4 },
  { text: 'Respeto las políticas de la empresa aunque considere que alguna no es necesaria', category: 'INTEGRITY_RULES', order: 5 },
  { text: 'He justificado no cumplir una norma porque "no hacía daño a nadie"', category: 'INTEGRITY_RULES', order: 6, reverseScored: true },
  // INTEGRITY_THEFT (2 questions)
  { text: 'Considero que tomar pequeños artículos del trabajo sin permiso es aceptable si son de bajo valor', category: 'INTEGRITY_THEFT', order: 7, reverseScored: true },
  { text: 'He utilizado recursos de la empresa (tiempo, materiales) para fines personales sin autorización', category: 'INTEGRITY_THEFT', order: 8, reverseScored: true },
  // INTEGRITY_RESPONSIBILITY (2 questions)
  { text: 'Cuando algo sale mal en mi área, asumo mi parte de responsabilidad sin buscar culpables', category: 'INTEGRITY_RESPONSIBILITY', order: 9 },
  { text: 'Si un compañero comete una falta, prefiero no involucrarme para evitar conflictos', category: 'INTEGRITY_RESPONSIBILITY', order: 10, reverseScored: true },
]

// ── Knowledge questions by category ──
const KNOWLEDGE_QUESTIONS_BY_CATEGORY: Record<string, Array<{ text: string; options: string; order: number; correctAnswer?: number }>> = {
  MESERO: [
    { text: '¿Cuál es la temperatura adecuada para servir vino tinto?', options: JSON.stringify(['4-6°C', '14-18°C', '20-24°C', '8-10°C']), order: 1, correctAnswer: 1 },
    { text: '¿Qué debe hacer un mesero antes de entregar la cuenta al cliente?', options: JSON.stringify(['Verificar que todo esté correcto', 'Preguntar si quiere postre', 'Recoger los platos', 'Traer más agua']), order: 2, correctAnswer: 0 },
    { text: 'Si un cliente reclama que su comida está fría, ¿qué debe hacer primero?', options: JSON.stringify(['Discutir con el cliente', 'Ofrecerse a calentarla o cambiarla', 'Ignorar el reclamo', 'Culpar a la cocina']), order: 3, correctAnswer: 1 },
    { text: '¿Cuál es el orden correcto para servir los platillos?', options: JSON.stringify(['Postre, plato fuerte, entrada', 'Entrada, plato fuerte, postre', 'Platos simultáneos', 'Solo plato fuerte']), order: 4, correctAnswer: 1 },
    { text: '¿Qué significa "mise en place"?', options: JSON.stringify(['Limpiar las mesas', 'Preparar y organizar todo antes del servicio', 'Decorar el restaurante', 'Cocinar los platillos']), order: 5, correctAnswer: 1 },
    { text: '¿Cómo debe llevar los platos un mesero al salir de la cocina?', options: JSON.stringify(['En las manos', 'En charola siempre', 'Como sea más rápido', 'Solo los más pesados en charola']), order: 6, correctAnswer: 1 },
    { text: '¿Qué es el "upselling" en un restaurante?', options: JSON.stringify(['Vender platos más baratos', 'Sugerir platillos adicionales o de mayor valor', 'Regalar postres', 'Dar descuentos sin autorización']), order: 7, correctAnswer: 1 },
    { text: '¿Cuándo debe un mesero acercarse a una mesa por primera vez?', options: JSON.stringify(['Inmediatamente al sentarse', 'Después de 5 minutos', 'Cuando el cliente levante la mano', 'Después de entregar el menú y dar un momento']), order: 8, correctAnswer: 3 },
    { text: '¿Qué debe hacer si un cliente tiene una alergia alimentaria?', options: JSON.stringify(['Ignorar la solicitud', 'Informar inmediatamente a cocina y verificar ingredientes', 'Sugerir otro platillo sin verificar', 'Decir que no hay problema']), order: 9, correctAnswer: 1 },
    { text: '¿Cuál es la regla general para servir bebidas?', options: JSON.stringify(['Servir por la derecha', 'Servir por la izquierda', 'Servir por donde sea más accesible', 'Dejar que el cliente se sirva solo']), order: 10, correctAnswer: 0 },
  ],
  COCINERO: [
    { text: '¿Cuál es la temperatura interna mínima segura para el pollo cocido?', options: JSON.stringify(['55°C', '63°C', '74°C', '85°C']), order: 1 },
    { text: '¿Qué es la contaminación cruzada?', options: JSON.stringify(['Cuando los alimentos se queman', 'Transferencia de bacterias de un alimento a otro', 'Cuando la comida se enfría', 'Mezclar sabores']), order: 2 },
    { text: '¿Qué es una "brunoise"?', options: JSON.stringify(['Un tipo de salsa', 'Un corte en cubos pequeños', 'Una técnica de cocción', 'Un tipo de carne']), order: 3 },
    { text: '¿Cuál es el orden correcto de almacenamiento en el refrigerador?', options: JSON.stringify(['Pollo arriba, vegetales abajo', 'Vegetales arriba, pollo abajo', 'Todo en el mismo estante', 'No importa el orden']), order: 4 },
    { text: '¿Qué hacer si un alimento se cae al suelo?', options: JSON.stringify(['Levantarlo rápidamente y usarlo', 'Desecharlo', 'Enjuagarlo', 'Depende del alimento']), order: 5 },
    { text: '¿Qué es la "mise en place" en cocina?', options: JSON.stringify(['Limpiar la cocina', 'Tener todo preparado y organizado antes de cocinar', 'Cocinar a fuego alto', 'Servir los platillos']), order: 6 },
    { text: '¿Cuánto tiempo máximo puede estar un alimento fuera de refrigeración?', options: JSON.stringify(['1 hora', '2 horas', '4 horas', 'No hay límite']), order: 7 },
    { text: '¿Qué es una "reducción" en cocina?', options: JSON.stringify(['Quitar ingredientes', 'Cocinar un líquido hasta evaporar parte y concentrar sabor', 'Bajar la temperatura', 'Cortar en trozos pequeños']), order: 8 },
    { text: '¿Cuándo debe lavarse las manos en la cocina?', options: JSON.stringify(['Solo al inicio del turno', 'Antes de cocinar y después de manipular alimentos crudos', 'Una vez por hora', 'Solo si se ven sucias']), order: 9 },
    { text: '¿Qué color de tabla se usa típicamente para pollo?', options: JSON.stringify(['Verde', 'Roja', 'Azul', 'Blanca']), order: 10 },
  ],
  BARTENDER: [
    { text: '¿Qué es un "muddled" en coctelería?', options: JSON.stringify(['Mezclar con hielo', 'Machacar ingredientes para liberar sabores', 'Filtrar una bebida', 'Agitar en coctelera']), order: 1 },
    { text: '¿Cuánto tequila lleva un Margarita clásico?', options: JSON.stringify(['30 ml', '45 ml', '60 ml', '90 ml']), order: 2 },
    { text: '¿Qué es el "layering" en bebidas?', options: JSON.stringify(['Agitar vigorosamente', 'Crear capas de líquidos con diferentes densidades', 'Añadir hielo', 'Decorar con fruta']), order: 3 },
    { text: '¿Cuál es la diferencia entre mezcal y tequila?', options: JSON.stringify(['No hay diferencia', 'El tequila es solo de Jalisco y el mezcal de varias regiones', 'El mezcal es más barato', 'El tequila es más fuerte']), order: 4 },
    { text: '¿Qué hacer si un cliente está visiblemente intoxicado?', options: JSON.stringify(['Seguir sirviendo', 'Negarse cortésmente a servir más y ofrecer agua', 'Ignorarlo', 'Llamar a la policía inmediatamente']), order: 5 },
    { text: '¿Qué tipo de vaso se usa para un Old Fashioned?', options: JSON.stringify(['Copa flauta', 'Vaso corto/rocks', 'Copa margarita', 'Vaso alto']), order: 6 },
    { text: '¿Qué significa "on the rocks"?', options: JSON.stringify(['Sin hielo', 'Con hielo', 'Con limón', 'Doble porción']), order: 7 },
    { text: '¿Cuál es el licor base de un Mojito?', options: JSON.stringify(['Vodka', 'Ron', 'Gin', 'Tequila']), order: 8 },
    { text: '¿Qué es un "dash" en coctelería?', options: JSON.stringify(['Una medida grande', 'Una pequeña cantidad (3-5 gotas)', 'Un tipo de vaso', 'Una técnica de mezclado']), order: 9 },
    { text: '¿Cómo se sirve una cerveza correctamente?', options: JSON.stringify(['Directa y rápida', 'Inclinando el vaso y gradualmente enderezándolo', 'Dejándola caer desde lo alto', 'Sin espuma']), order: 10 },
  ],
  GERENTE_PISO: [
    { text: '¿Cuál es la métrica más importante para medir la eficiencia de un restaurante?', options: JSON.stringify(['Número de empleados', 'Rotación de mesas', 'Tamaño del menú', 'Cantidad de proveedores']), order: 1 },
    { text: 'Si un mesero reporta que un cliente está insatisfecho, ¿qué es lo primero que debe hacer?', options: JSON.stringify(['Ignorar el reporte', 'Acercarse a la mesa y escuchar al cliente', 'Dar un descuento automático', 'Cambiar de mesero']), order: 2 },
    { text: '¿Qué es el "ticket promedio"?', options: JSON.stringify(['El precio del menú', 'El gasto promedio por cliente', 'El salario de los meseros', 'El costo de los ingredientes']), order: 3 },
    { text: '¿Cómo debe manejar un conflicto entre dos empleados?', options: JSON.stringify(['Despedir a ambos', 'Escuchar ambas partes y buscar solución', 'Ignorar el conflicto', 'Elegir un lado']), order: 4 },
    { text: '¿Qué indica un alto índice de rotación de personal?', options: JSON.stringify(['Buen ambiente laboral', 'Problemas en la gestión o condiciones laborales', 'Éxito del negocio', 'No es relevante']), order: 5 },
    { text: '¿Qué es la "captación" de clientes en un restaurante?', options: JSON.stringify(['Cobrar más caro', 'Atraer nuevos clientes al establecimiento', 'Retener a los mismos clientes', 'Reducir el menú']), order: 6 },
    { text: '¿Cuál es la mejor forma de motivar al personal de sala?', options: JSON.stringify(['Amenazar con despido', 'Reconocimiento y capacitación constante', 'Solo incrementar salario', 'Ignorar sus necesidades']), order: 7 },
    { text: '¿Qué debe hacer al inicio de cada turno?', options: JSON.stringify(['Esperar a que lleguen los clientes', 'Verificar reservaciones, personal y estado del salón', 'Solo revisar la caja', 'Nada en particular']), order: 8 },
    { text: '¿Cómo se calcula la productividad de un mesero?', options: JSON.stringify(['Por su puntualidad', 'Ventas generadas y número de mesas atendidas', 'Por su antigüedad', 'Por su carisma']), order: 9 },
    { text: '¿Qué es el "SOP" en gestión de restaurantes?', options: JSON.stringify(['Un tipo de comida', 'Standard Operating Procedure (Procedimiento Operativo Estándar)', 'Un sistema de pagos', 'Un proveedor']), order: 10 },
  ],
  VENDEDOR: [
    { text: '¿Qué es un "upselling"?', options: JSON.stringify(['Vender más barato', 'Ofrecer un producto de mayor valor o complementario', 'Regalar productos', 'Descartar al cliente']), order: 1 },
    { text: '¿Cuál es la primera regla de la atención al cliente?', options: JSON.stringify(['Ser agresivo en la venta', 'Escuchar activamente al cliente', 'Mostrar todos los productos', 'Ofrecer descuentos siempre']), order: 2 },
    { text: 'Si un cliente dice "solo estoy viendo", ¿qué debe responder?', options: JSON.stringify(['Ignorarlo', '"Entiendo, estoy aquí si necesita ayuda"', 'Insistir en que compre', 'Decirle que no hay solo para ver']), order: 3 },
    { text: '¿Qué es el "closing" en ventas?', options: JSON.stringify(['Cerrar la tienda', 'El momento de cerrar la venta', 'Despedir al cliente', 'Terminar el turno']), order: 4 },
    { text: '¿Cómo debe manejar una objeción de precio?', options: JSON.stringify(['Decir que es el precio y ya', 'Mostrar el valor y beneficios del producto', 'Dar un descuento inmediato', 'Ignorar la objeción']), order: 5 },
    { text: '¿Qué es el "cross-selling"?', options: JSON.stringify(['Vender lo mismo a otro cliente', 'Ofrecer productos complementarios al que el cliente ya quiere', 'Vender más caro', 'No vender nada']), order: 6 },
    { text: '¿Qué es la "tribanda" en venta de ropa?', options: JSON.stringify(['Un tipo de tela', 'Tres prendas que se venden juntas como outfit completo', 'Un descuento triple', 'Una marca de ropa']), order: 7 },
    { text: '¿Qué debe hacer al final de cada atención al cliente?', options: JSON.stringify(['Irse inmediatamente', 'Agradecer y preguntar si necesita algo más', 'Ignorar al cliente', 'Ofrecer solo descuentos']), order: 8 },
    { text: '¿Qué es un cliente "warm lead"?', options: JSON.stringify(['Un cliente enojado', 'Un cliente que ya mostró interés en comprar', 'Un cliente frío', 'Un cliente que ya compró']), order: 9 },
    { text: '¿Cuál es la técnica SPIN en ventas?', options: JSON.stringify(['Girar el producto', 'Situation, Problem, Implication, Need', 'Solo preguntar el precio', 'Vender por impulso']), order: 10 },
  ],
  CAJERO: [
    { text: '¿Cuál es el primer paso al recibir un pago en efectivo?', options: JSON.stringify(['Dar el cambio inmediatamente', 'Contar el dinero frente al cliente', 'Preguntar si necesita bolsa', 'Guardar el dinero en la caja']), order: 1, correctAnswer: 1 },
    { text: '¿Qué debe hacer si la caja no cuadra al cierre?', options: JSON.stringify(['Ajustar los números', 'Reportar la discrepancia al supervisor', 'Poner dinero de su bolsillo', 'Ignorar la diferencia si es poca']), order: 2, correctAnswer: 1 },
    { text: '¿Cuál es la forma correcta de entregar el cambio al cliente?', options: JSON.stringify(['Todo junto en la mano', 'Primero los billetes y luego las monedas', 'Primero las monedas y luego los billetes', 'Sobre la charola']), order: 3, correctAnswer: 2 },
    { text: '¿Qué información debe verificar al aceptar una tarjeta de crédito?', options: JSON.stringify(['Solo el nombre', 'Nombre, firma y que la tarjeta esté presente', 'Solo la fecha de expiración', 'El número de cuenta completo']), order: 4, correctAnswer: 1 },
    { text: '¿Qué es un "corte de caja"?', options: JSON.stringify(['Cortar los billetes dañados', 'Contar y registrar el dinero al terminar un turno', 'Cerrar la caja con llave', 'Cambiar billetes por monedas']), order: 5, correctAnswer: 1 },
    { text: 'Si un cliente paga con un billete grande y necesita mucho cambio, ¿qué debe hacer?', options: JSON.stringify(['Negarse a aceptarlo', 'Verificar que tenga suficiente cambio antes de aceptar', 'Dar cambio redondeado', 'Pedir que pague con tarjeta']), order: 6, correctAnswer: 1 },
    { text: '¿Qué debe hacer si nota un error en el ticket antes de entregarlo?', options: JSON.stringify(['Entregarlo de todas formas', 'Corregir el error y reimprimir', 'Tachar el error', 'Pedir al cliente que lo ignore']), order: 7, correctAnswer: 1 },
    { text: '¿Cuál es la mejor práctica para manejar propinas?', options: JSON.stringify(['Guardárselas sin decir nada', 'Reportarlas y distribuirlas según la política de la empresa', 'Ponerlas directamente en la caja', 'Repartirlas solo con los meseros']), order: 8, correctAnswer: 1 },
    { text: '¿Qué debe hacer si el sistema de punto de venta falla?', options: JSON.stringify(['Cerrar el negocio', 'Usar un procedimiento manual de respaldo y reportar', 'No atender más clientes', 'Esperar a que se reinicie solo']), order: 9, correctAnswer: 1 },
    { text: '¿Por qué es importante sonreír y saludar al cliente en la caja?', options: JSON.stringify(['No es importante', 'Es la última impresión del cliente y afecta su experiencia', 'Por protocolo', 'Para obtener mejor propina']), order: 10, correctAnswer: 1 },
  ],
  HOSTESS: [
    { text: '¿Cuál es la principal función de un hostess en un restaurante?', options: JSON.stringify(['Cocinar', 'Recibir, acomodar y dar la bienvenida a los clientes', 'Limpiar las mesas', 'Preparar las bebidas']), order: 1, correctAnswer: 1 },
    { text: '¿Qué debe considerar al asignar una mesa a un cliente?', options: JSON.stringify(['Solo la primera mesa disponible', 'Capacidad de la mesa, estado de limpieza y distribución del salón', 'Siempre la misma sección', 'La mesa más cerca de la puerta']), order: 2, correctAnswer: 1 },
    { text: '¿Qué decir cuando no hay mesas disponibles?', options: JSON.stringify(['No hay mesas, vaya a otro lado', 'Dar un tiempo de espera estimado y ofrecer alternativas', 'Que espere de pie', 'No decir nada']), order: 3, correctAnswer: 1 },
    { text: '¿Cómo debe manejar una reservación que llega tarde?', options: JSON.stringify(['Cancelarla inmediatamente', 'Confirmar si aún la necesitan y reacomodar según disponibilidad', 'Darle la mesa de alguien más', 'Ignorar la reservación']), order: 4, correctAnswer: 1 },
    { text: '¿Qué es la "rotación de mesas"?', options: JSON.stringify(['Mover los muebles', 'El tiempo y proceso entre que un cliente se va y llega el siguiente', 'Cambiar de sección', 'Limpiar mientras el cliente espera']), order: 5, correctAnswer: 1 },
    { text: '¿Cuál es la mejor manera de manejar una fila de espera?', options: JSON.stringify(['No dar información', 'Comunicar tiempos de espera y mantener informados a los clientes', 'Atender por orden de llegada sin decir nada', 'Saltar clientes con reservación']), order: 6, correctAnswer: 1 },
    { text: '¿Qué información debe anotar al recibir una reservación?', options: JSON.stringify(['Solo el nombre', 'Nombre, fecha, hora, número de personas y teléfono', 'Solo la hora', 'Número de personas y nada más']), order: 7, correctAnswer: 1 },
    { text: '¿Qué actitud debe proyectar un hostess?', options: JSON.stringify(['Indiferencia profesional', 'Amabilidad, calidez y disposición', 'Seriedad extrema', 'Familiaridad excesiva']), order: 8, correctAnswer: 1 },
    { text: '¿Qué hacer si un grupo grande llega sin reservación?', options: JSON.stringify(['Rechazarlos', 'Evaluar disponibilidad, ofrecer esperar o acomodar en mesas juntas', 'Sentarlos en cualquier parte', 'Enviarlos a otro restaurante']), order: 9, correctAnswer: 1 },
    { text: '¿Por qué es importante que el hostess conozca el menú?', options: JSON.stringify(['No es necesario', 'Para resolver dudas básicas de los clientes mientras esperan', 'Para tomar órdenes', 'Para cocinar']), order: 10, correctAnswer: 1 },
  ],
  LAVAPLATOS: [
    { text: '¿Cuál es la temperatura mínima recomendada para el agua de lavado de platos?', options: JSON.stringify(['30°C', '40°C', '60°C', '90°C']), order: 1, correctAnswer: 2 },
    { text: '¿Qué es la sanidad en el área de lavado?', options: JSON.stringify(['Solo limpiar lo visible', 'Eliminar bacterias y microorganismos de las superficies', 'Usar mucho jabón', 'Secar con trapo']), order: 2, correctAnswer: 1 },
    { text: '¿Cuál es el orden correcto para lavar platos?', options: JSON.stringify(['Platos, vasos, cubiertos, ollas', 'Vasos, platos, cubiertos, ollas', 'Ollas, platos, vasos, cubiertos', 'Todo junto']), order: 3, correctAnswer: 1 },
    { text: '¿Qué se debe hacer antes de lavar ollas con comida pegada?', options: JSON.stringify(['Lavarse directamente', 'Remojarlas con agua caliente', 'Usar papel aluminio', 'Ponerlas en refrigerador']), order: 4, correctAnswer: 1 },
    { text: '¿Por qué es importante separar cubiertos de diferentes tipos?', options: JSON.stringify(['No es importante', 'Para organizar mejor y evitar daños', 'Por estética', 'Porque se oxidan juntos']), order: 5, correctAnswer: 1 },
    { text: '¿Qué hacer si la máquina lavaplatos no está funcionando correctamente?', options: JSON.stringify(['Seguir usándola', 'Reportar de inmediato y usar lavado manual como respaldo', 'No lavar más platos', 'Intentar repararla uno mismo']), order: 6, correctAnswer: 1 },
    { text: '¿Cuál es la función del desinfectante en el lavado de platos?', options: JSON.stringify(['Dar brillo', 'Eliminar bacterias después del lavado', 'Quitar grasa', 'Dar aroma agradable']), order: 7, correctAnswer: 1 },
    { text: '¿Cómo deben almacenarse los platos limpios?', options: JSON.stringify(['Apilados sobre la mesa', 'En estantes limpios y cubiertos, boca abajo', 'En el piso', 'En cualquier lugar disponible']), order: 8, correctAnswer: 1 },
    { text: '¿Qué equipo de seguridad es importante en el área de lavado?', options: JSON.stringify(['Casco', 'Guantes resistentes al agua y zapatos antideslizantes', 'Gafas de sol', 'Mascarilla']), order: 9, correctAnswer: 1 },
    { text: '¿Qué hacer con los residuos de comida antes de lavar?', options: JSON.stringify(['Dejarlos en los platos', 'Desecharlos en el depósito correspondiente', 'Lavarse con ellos', 'Quemarlos']), order: 10, correctAnswer: 1 },
  ],
  GENERAL: [
    { text: '¿Cuál es la prioridad al atender a un cliente?', options: JSON.stringify(['Hacer la venta rápido', 'Que el cliente se sienta escuchado y satisfecho', 'Seguir el guion al pie de la letra', 'Cumplir con la meta del día']), order: 1, correctAnswer: 1 },
    { text: '¿Qué es el trabajo en equipo?', options: JSON.stringify(['Cada quien hace lo suyo sin comunicarse', 'Colaborar y comunicarse con compañeros para un objetivo común', 'Solo ayudar cuando se lo piden', 'Hacer el trabajo de otros']), order: 2, correctAnswer: 1 },
    { text: '¿Qué debe hacer si no sabe la respuesta a una pregunta del cliente?', options: JSON.stringify(['Inventar una respuesta', 'Decir que no sabe y buscar a quien pueda ayudar', 'Ignorar la pregunta', 'Cambiar de tema']), order: 3, correctAnswer: 1 },
    { text: '¿Por qué es importante la puntualidad?', options: JSON.stringify(['No es importante', 'Afecta al equipo y la operación del negocio', 'Solo por imagen', 'Por disciplina']), order: 4, correctAnswer: 1 },
    { text: '¿Qué es la higiene personal en el trabajo?', options: JSON.stringify(['Solo usar uniforme limpio', 'Baño diario, uniforme limpio, manos lavadas y buena presentación', 'Usar perfume', 'No es relevante']), order: 5, correctAnswer: 1 },
    { text: '¿Qué hacer si hay un conflicto con un compañero?', options: JSON.stringify(['Ignorarlo', 'Hablarlo directamente y buscar una solución', 'Quejarse con el cliente', 'Dejar de hablarle']), order: 6, correctAnswer: 1 },
    { text: '¿Qué significa dar un buen servicio al cliente?', options: JSON.stringify(['Ser rápido sin importar la calidad', 'Cumplir o superar las expectativas del cliente', 'Solo sonreír', 'Seguir las reglas sin excepción']), order: 7, correctAnswer: 1 },
    { text: '¿Cuándo se debe lavar las manos en el trabajo?', options: JSON.stringify(['Solo al inicio del turno', 'Antes de comer, después del baño y al inicio del turno', 'Solo cuando se ven sucias', 'Una vez por hora']), order: 8, correctAnswer: 1 },
    { text: '¿Qué es la comunicación asertiva?', options: JSON.stringify(['Hablar fuerte', 'Expresar ideas con respeto y claridad', 'No decir lo que se piensa', 'Acordar siempre con los demás']), order: 9, correctAnswer: 1 },
    { text: '¿Por qué es importante conocer los productos o servicios que se ofrecen?', options: JSON.stringify(['No es necesario', 'Para dar información correcta y resolver dudas de los clientes', 'Solo para exámenes', 'Para cobrar más']), order: 10, correctAnswer: 1 },
  ],
}

// Category display name map
const CATEGORY_NAMES: Record<string, string> = {
  MESERO: 'Mesero',
  COCINERO: 'Cocinero/a',
  BARTENDER: 'Bartender',
  GERENTE_PISO: 'Gerente de Piso',
  VENDEDOR: 'Vendedor/a',
  CAJERO: 'Cajero/a',
  HOSTESS: 'Hostess',
  LAVAPLATOS: 'Lavaplatos',
  GENERAL: 'General',
}

/**
 * Generate default evaluation templates and questions for a position.
 * Called when a position is created, or retroactively for existing positions.
 */
export async function generateTemplatesForPosition(
  positionId: string,
  positionTitle: string,
  category: string,
  hasKnowledgeTest: boolean
): Promise<{ templatesCreated: number; questionsCreated: number }> {
  const db = getUnscopedClient()

  // Check if templates already exist for this position
  const existingTemplates = await db.evaluationTemplate.findMany({
    where: { positionId },
  })
  if (existingTemplates.length > 0) {
    return { templatesCreated: 0, questionsCreated: 0 }
  }

  const categoryName = CATEGORY_NAMES[category] || positionTitle
  let templatesCreated = 0
  let questionsCreated = 0

  // 1. Create PSICOMETRICA template (Big Five)
  const psicoTemplate = await db.evaluationTemplate.create({
    data: {
      name: `Evaluación Psicométrica - ${categoryName}`,
      type: 'PSICOMETRICA',
      description: `Test Big Five de personalidad para puesto de ${categoryName}`,
      order: 1,
      positionId,
      active: true,
    },
  })
  templatesCreated++

  for (const q of BIG_FIVE_QUESTIONS) {
    await db.question.create({
      data: {
        text: q.text,
        type: 'LIKERT',
        category: q.category,
        reverseScored: q.reverseScored || false,
        order: q.order,
        evaluationTemplateId: psicoTemplate.id,
      },
    })
    questionsCreated++
  }

  // 2. Create PSICOLOGICA template
  const psicologicaTemplate = await db.evaluationTemplate.create({
    data: {
      name: `Evaluación Psicológica - ${categoryName}`,
      type: 'PSICOLOGICA',
      description: `Evaluación de competencias psicológicas para ${categoryName}`,
      order: 2,
      positionId,
      active: true,
    },
  })
  templatesCreated++

  for (const q of PSICOLOGICA_QUESTIONS) {
    await db.question.create({
      data: {
        text: q.text,
        type: 'LIKERT',
        category: q.category,
        reverseScored: q.reverseScored || false,
        order: q.order,
        evaluationTemplateId: psicologicaTemplate.id,
      },
    })
    questionsCreated++
  }

  // 3. Create CONOCIMIENTOS template (if applicable)
  if (hasKnowledgeTest) {
    const knowledgeQuestions = KNOWLEDGE_QUESTIONS_BY_CATEGORY[category]

    const conocimientosTemplate = await db.evaluationTemplate.create({
      data: {
        name: `Evaluación de Conocimientos - ${categoryName}`,
        type: 'CONOCIMIENTOS',
        description: `Conocimientos técnicos para puesto de ${categoryName}`,
        order: 3,
        positionId,
        active: true,
      },
    })
    templatesCreated++

    if (knowledgeQuestions) {
      for (const q of knowledgeQuestions) {
        await db.question.create({
          data: {
            text: q.text,
            type: 'MULTIPLE_CHOICE',
            options: q.options,
            category: 'KNOWLEDGE',
            order: q.order,
            evaluationTemplateId: conocimientosTemplate.id,
          },
        })
        questionsCreated++
      }
    } else {
      // Generic knowledge questions if no category-specific ones exist
      const genericKnowledgeQuestions = [
        { text: '¿Conoce los procedimientos básicos de seguridad de su puesto?', options: JSON.stringify(['Sí, completamente', 'Parcialmente', 'Muy poco', 'No']), order: 1 },
        { text: '¿Sabe cómo reportar una situación de riesgo?', options: JSON.stringify(['Sí, siempre', 'La mayoría de las veces', 'Rara vez', 'No']), order: 2 },
        { text: '¿Comprende las normativas de higiene aplicables?', options: JSON.stringify(['Totalmente', 'En gran medida', 'Poco', 'Nada']), order: 3 },
        { text: '¿Puede explicar el proceso principal de su área de trabajo?', options: JSON.stringify(['Claramente', 'Con algunos detalles', 'Vagamente', 'No']), order: 4 },
        { text: '¿Conoce las responsabilidades principales de su puesto?', options: JSON.stringify(['Todas', 'La mayoría', 'Algunas', 'Ninguna']), order: 5 },
      ]
      for (const q of genericKnowledgeQuestions) {
        await db.question.create({
          data: {
            text: q.text,
            type: 'MULTIPLE_CHOICE',
            options: q.options,
            category: 'KNOWLEDGE',
            order: q.order,
            evaluationTemplateId: conocimientosTemplate.id,
          },
        })
        questionsCreated++
      }
    }
  }

  // 4. Create INTEGRIDAD template (always)
  const integridadTemplate = await db.evaluationTemplate.create({
    data: {
      name: `Evaluación de Integridad - ${categoryName}`,
      type: 'INTEGRIDAD',
      description: `Evaluación de integridad y honradez para ${categoryName} (dato sensible, orientativo)`,
      order: hasKnowledgeTest ? 4 : 3,
      positionId,
      active: true,
    },
  })
  templatesCreated++

  for (const q of INTEGRIDAD_QUESTIONS) {
    await db.question.create({
      data: {
        text: q.text,
        type: 'LIKERT',
        category: q.category,
        reverseScored: q.reverseScored || false,
        order: q.order,
        evaluationTemplateId: integridadTemplate.id,
      },
    })
    questionsCreated++
  }

  return { templatesCreated, questionsCreated }
}
