/* ==========================================================================
   IMPOSTOR - Word Database with Pairs for Trap Mode (Undercover)
   Categorized: Lugares, Comida, Objetos, Animales, Cine & Ocio
   ========================================================================== */

export const CATEGORIES = [
  { id: 'all', name: 'Todas las categorías', icon: '✨' },
  { id: 'lugares', name: 'Lugares', icon: '🏖️' },
  { id: 'comida', name: 'Comida & Bebida', icon: '🍕' },
  { id: 'objetos', name: 'Objetos', icon: '🎒' },
  { id: 'animales', name: 'Animales', icon: '🦁' },
  { id: 'ocio', name: 'Cine, Deportes & Ocio', icon: '🎬' },
  { id: 'custom', name: 'Personalizadas', icon: '✍️' }
];

export const DEFAULT_WORD_PAIRS = [
  // --- LUGARES (12 pares) ---
  { civil: 'Playa', impostor: 'Piscina', category: 'lugares' },
  { civil: 'Aeropuerto', impostor: 'Estación de tren', category: 'lugares' },
  { civil: 'Hospital', impostor: 'Centro de salud', category: 'lugares' },
  { civil: 'Cine', impostor: 'Teatro', category: 'lugares' },
  { civil: 'Hotel', impostor: 'Hostal', category: 'lugares' },
  { civil: 'Gimnasio', impostor: 'Spa', category: 'lugares' },
  { civil: 'Museo', impostor: 'Biblioteca', category: 'lugares' },
  { civil: 'Selva', impostor: 'Bosque', category: 'lugares' },
  { civil: 'Restaurante', impostor: 'Cafetería', category: 'lugares' },
  { civil: 'Castillo', impostor: 'Palacio', category: 'lugares' },
  { civil: 'Parque de atracciones', impostor: 'Circo', category: 'lugares' },
  { civil: 'Desierto', impostor: 'Playa', category: 'lugares' },

  // --- COMIDA & BEBIDA (13 pares) ---
  { civil: 'Pizza', impostor: 'Hamburguesa', category: 'comida' },
  { civil: 'Café', impostor: 'Té', category: 'comida' },
  { civil: 'Manzana', impostor: 'Pera', category: 'comida' },
  { civil: 'Helado', impostor: 'Yogur helado', category: 'comida' },
  { civil: 'Tacos', impostor: 'Burritos', category: 'comida' },
  { civil: 'Paella', impostor: 'Risotto', category: 'comida' },
  { civil: 'Chocolate', impostor: 'Turrón', category: 'comida' },
  { civil: 'Cerveza', impostor: 'Vino', category: 'comida' },
  { civil: 'Sushi', impostor: 'Sashimi', category: 'comida' },
  { civil: 'Naranja', impostor: 'Mandarina', category: 'comida' },
  { civil: 'Queso', impostor: 'Mantequilla', category: 'comida' },
  { civil: 'Galleta', impostor: 'Bizcocho', category: 'comida' },
  { civil: 'Tortilla de patatas', impostor: 'Revuelto', category: 'comida' },

  // --- OBJETOS (13 pares) ---
  { civil: 'Teléfono móvil', impostor: 'Tablet', category: 'objetos' },
  { civil: 'Reloj', impostor: 'Pulsera', category: 'objetos' },
  { civil: 'Gafas de sol', impostor: 'Lentillas', category: 'objetos' },
  { civil: 'Coche', impostor: 'Moto', category: 'objetos' },
  { civil: 'Guitarra', impostor: 'Ukelele', category: 'objetos' },
  { civil: 'Mochila', impostor: 'Maleta', category: 'objetos' },
  { civil: 'Cuchillo', impostor: 'Tijeras', category: 'objetos' },
  { civil: 'Libro', impostor: 'Revista', category: 'objetos' },
  { civil: 'Auriculares', impostor: 'Altavoz', category: 'objetos' },
  { civil: 'Lápiz', impostor: 'Bolígrafo', category: 'objetos' },
  { civil: 'Paraguas', impostor: 'Chubasquero', category: 'objetos' },
  { civil: 'Zapatillas', impostor: 'Botas', category: 'objetos' },
  { civil: 'Silla', impostor: 'Sillón', category: 'objetos' },

  // --- ANIMALES (12 pares) ---
  { civil: 'Perro', impostor: 'Lobo', category: 'animales' },
  { civil: 'León', impostor: 'Tigre', category: 'animales' },
  { civil: 'Delfín', impostor: 'Ballena', category: 'animales' },
  { civil: 'Gato', impostor: 'Pantera', category: 'animales' },
  { civil: 'Caballo', impostor: 'Cebra', category: 'animales' },
  { civil: 'Águila', impostor: 'Halcón', category: 'animales' },
  { civil: 'Serpiente', impostor: 'Lagarto', category: 'animales' },
  { civil: 'Pingüino', impostor: 'Pato', category: 'animales' },
  { civil: 'Oso polar', impostor: 'Oso pardo', category: 'animales' },
  { civil: 'Mono', impostor: 'Chimpancé', category: 'animales' },
  { civil: 'Ratón', impostor: 'Hámster', category: 'animales' },
  { civil: 'Elefante', impostor: 'Rinoceronte', category: 'animales' },

  // --- CINE, DEPORTES & OCIO (10 pares) ---
  { civil: 'Película', impostor: 'Serie', category: 'ocio' },
  { civil: 'Fútbol', impostor: 'Baloncesto', category: 'ocio' },
  { civil: 'Tenis', impostor: 'Pádel', category: 'ocio' },
  { civil: 'Ajedrez', impostor: 'Damas', category: 'ocio' },
  { civil: 'Pintura', impostor: 'Fotografía', category: 'ocio' },
  { civil: 'Concierto', impostor: 'Festival', category: 'ocio' },
  { civil: 'Detective', impostor: 'Policía', category: 'ocio' },
  { civil: 'Actor', impostor: 'Presentador', category: 'ocio' },
  { civil: 'Avión', impostor: 'Helicóptero', category: 'ocio' },
  { civil: 'Barco', impostor: 'Submarino', category: 'ocio' }
];
