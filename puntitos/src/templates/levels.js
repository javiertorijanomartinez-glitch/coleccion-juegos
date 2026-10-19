// Base de datos de niveles y plantillas para Puntitos Mágicos
// Cada nivel cuenta con:
// - dots: coordenadas de los puntos ordenados
// - outlinePath: trazado SVG del contorno cerrado o abierto
// - colorArt: ilustración completa coloreada con SVG para la revelación mágica
// - viewWidth, viewHeight: dimensiones base (500x500 estándar)

export const LEVELS = [
  // --- FÁCIL: FORMAS Y NATURALEZA ---
  {
    id: 'estrella',
    title: 'Estrella Mágica',
    category: 'fantasia',
    categoryName: 'Fantasía',
    difficulty: 'facil',
    dotsCount: 10,
    icon: '⭐',
    description: '¡Una estrella brillante que ilumina el cielo nocturno!',
    isClosed: true,
    viewWidth: 500,
    viewHeight: 500,
    dots: [
      { id: 1, x: 250, y: 40 },
      { id: 2, x: 310, y: 175 },
      { id: 3, x: 460, y: 175 },
      { id: 4, x: 345, y: 265 },
      { id: 5, x: 390, y: 420 },
      { id: 6, x: 250, y: 325 },
      { id: 7, x: 110, y: 420 },
      { id: 8, x: 155, y: 265 },
      { id: 9, x: 40, y: 175 },
      { id: 10, x: 190, y: 175 }
    ],
    outlinePath: 'M 250 40 L 310 175 L 460 175 L 345 265 L 390 420 L 250 325 L 110 420 L 155 265 L 40 175 L 190 175 Z',
    colorArt: `
      <polygon points="250,40 310,175 460,175 345,265 390,420 250,325 110,420 155,265 40,175 190,175" fill="#FFD166" stroke="#F4A261" stroke-width="8" stroke-linejoin="round" />
      <circle cx="205" cy="220" r="14" fill="#2B2D42" />
      <circle cx="295" cy="220" r="14" fill="#2B2D42" />
      <circle cx="209" cy="216" r="4" fill="#FFFFFF" />
      <circle cx="299" cy="216" r="4" fill="#FFFFFF" />
      <path d="M 215 255 Q 250 285 285 255" fill="none" stroke="#2B2D42" stroke-width="6" stroke-linecap="round" />
      <ellipse cx="180" cy="245" rx="14" ry="9" fill="#FF70A6" opacity="0.6" />
      <ellipse cx="320" cy="245" rx="14" ry="9" fill="#FF70A6" opacity="0.6" />
    `
  },

  // --- FÁCIL: COMIDA ---
  {
    id: 'manzana',
    title: 'Manzana Dulce',
    category: 'comida',
    categoryName: 'Comida',
    difficulty: 'facil',
    dotsCount: 12,
    icon: '🍎',
    description: '¡Una deliciosa manzana roja con su hojita verde!',
    isClosed: true,
    viewWidth: 500,
    viewHeight: 500,
    dots: [
      { id: 1, x: 250, y: 120 },
      { id: 2, x: 340, y: 100 },
      { id: 3, x: 410, y: 160 },
      { id: 4, x: 420, y: 260 },
      { id: 5, x: 380, y: 380 },
      { id: 6, x: 300, y: 440 },
      { id: 7, x: 250, y: 420 },
      { id: 8, x: 200, y: 440 },
      { id: 9, x: 120, y: 380 },
      { id: 10, x: 80, y: 260 },
      { id: 11, x: 90, y: 160 },
      { id: 12, x: 160, y: 100 }
    ],
    outlinePath: 'M 250 120 C 310 90 420 120 420 260 C 420 380 340 440 250 420 C 160 440 80 380 80 260 C 80 120 190 90 250 120 Z',
    colorArt: `
      <!-- Rabito -->
      <path d="M 250 120 Q 255 60 280 40" fill="none" stroke="#6F4E37" stroke-width="12" stroke-linecap="round" />
      <!-- Hoja -->
      <path d="M 260 90 Q 320 60 330 95 Q 290 120 260 90 Z" fill="#70E000" stroke="#38B000" stroke-width="4" />
      <!-- Cuerpo manzana -->
      <path d="M 250 120 C 310 90 420 120 420 260 C 420 380 340 440 250 420 C 160 440 80 380 80 260 C 80 120 190 90 250 120 Z" fill="#EF233C" stroke="#D90429" stroke-width="8" />
      <!-- Brillo -->
      <path d="M 130 180 Q 115 240 125 290" fill="none" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" opacity="0.5" />
      <!-- Carita simpática -->
      <circle cx="210" cy="260" r="10" fill="#2B2D42" />
      <circle cx="290" cy="260" r="10" fill="#2B2D42" />
      <circle cx="213" cy="257" r="3" fill="#FFFFFF" />
      <circle cx="293" cy="257" r="3" fill="#FFFFFF" />
      <path d="M 230 285 Q 250 305 270 285" fill="none" stroke="#2B2D42" stroke-width="5" stroke-linecap="round" />
      <ellipse cx="185" cy="275" rx="10" ry="6" fill="#FF758F" opacity="0.6" />
      <ellipse cx="315" cy="275" rx="10" ry="6" fill="#FF758F" opacity="0.6" />
    `
  },

  // --- MEDIO: VEHÍCULOS ---
  {
    id: 'barco',
    title: 'Velero Aventurero',
    category: 'vehiculos',
    categoryName: 'Vehículos',
    difficulty: 'facil',
    dotsCount: 14,
    icon: '⛵',
    description: '¡Navega sobre las olas con este velero!',
    isClosed: false,
    viewWidth: 500,
    viewHeight: 500,
    dots: [
      { id: 1, x: 250, y: 70 },
      { id: 2, x: 380, y: 260 },
      { id: 3, x: 255, y: 260 },
      { id: 4, x: 255, y: 70 },
      { id: 5, x: 130, y: 240 },
      { id: 6, x: 240, y: 240 },
      { id: 7, x: 240, y: 300 },
      { id: 8, x: 420, y: 300 },
      { id: 9, x: 360, y: 390 },
      { id: 10, x: 140, y: 390 },
      { id: 11, x: 80, y: 300 },
      { id: 12, x: 240, y: 300 },
      { id: 13, x: 240, y: 440 },
      { id: 14, x: 260, y: 440 }
    ],
    outlinePath: 'M 250 70 L 380 260 L 255 260 Z M 255 70 L 130 240 L 240 240 Z M 80 300 L 420 300 L 360 390 L 140 390 Z',
    colorArt: `
      <!-- Mástil -->
      <line x1="248" y1="60" x2="248" y2="300" stroke="#7F4F24" stroke-width="8" stroke-linecap="round" />
      <!-- Vela Grande -->
      <path d="M 255 70 L 380 260 L 255 260 Z" fill="#00B4D8" stroke="#0077B6" stroke-width="5" />
      <!-- Vela Pequeña -->
      <path d="M 242 90 L 130 240 L 242 240 Z" fill="#90E0EF" stroke="#0096C7" stroke-width="5" />
      <!-- Casco del barco -->
      <path d="M 80 300 L 420 300 L 360 390 L 140 390 Z" fill="#E76F51" stroke="#D9381E" stroke-width="6" />
      <line x1="100" y1="330" x2="400" y2="330" stroke="#FFFFFF" stroke-width="6" />
      <!-- Olas del mar -->
      <path d="M 30 420 Q 90 390 150 420 T 270 420 T 390 420 T 490 420" fill="none" stroke="#0077B6" stroke-width="8" stroke-linecap="round" />
      <path d="M 60 450 Q 120 420 180 450 T 300 450 T 420 450" fill="none" stroke="#48CAE4" stroke-width="6" stroke-linecap="round" />
    `
  },

  // --- MEDIO: ANIMALES ---
  {
    id: 'gato',
    title: 'Gatito Sonriente',
    category: 'animales',
    categoryName: 'Animales',
    difficulty: 'medio',
    dotsCount: 18,
    icon: '🐱',
    description: '¡Un simpático minino que busca un amigo para jugar!',
    isClosed: true,
    viewWidth: 500,
    viewHeight: 500,
    dots: [
      { id: 1, x: 250, y: 150 },
      { id: 2, x: 300, y: 140 },
      { id: 3, x: 340, y: 70 },
      { id: 4, x: 360, y: 170 },
      { id: 5, x: 390, y: 220 },
      { id: 6, x: 380, y: 300 },
      { id: 7, x: 340, y: 360 },
      { id: 8, x: 350, y: 440 },
      { id: 9, x: 290, y: 450 },
      { id: 10, x: 250, y: 420 },
      { id: 11, x: 210, y: 450 },
      { id: 12, x: 150, y: 440 },
      { id: 13, x: 160, y: 360 },
      { id: 14, x: 120, y: 300 },
      { id: 15, x: 110, y: 220 },
      { id: 16, x: 140, y: 170 },
      { id: 17, x: 160, y: 70 },
      { id: 18, x: 200, y: 140 }
    ],
    outlinePath: 'M 250 150 L 300 140 L 340 70 L 360 170 L 390 220 L 380 300 L 340 360 L 350 440 L 290 450 L 250 420 L 210 450 L 150 440 L 160 360 L 120 300 L 110 220 L 140 170 L 160 70 L 200 140 Z',
    colorArt: `
      <!-- Silueta gato -->
      <path d="M 250 150 L 300 140 L 340 70 L 360 170 L 390 220 L 380 300 L 340 360 L 350 440 L 290 450 L 250 420 L 210 450 L 150 440 L 160 360 L 120 300 L 110 220 L 140 170 L 160 70 L 200 140 Z" fill="#F4A261" stroke="#E76F51" stroke-width="7" stroke-linejoin="round" />
      <!-- Interior orejas -->
      <polygon points="175,100 195,145 155,145" fill="#FFB4A2" />
      <polygon points="325,100 345,145 305,145" fill="#FFB4A2" />
      <!-- Ojos -->
      <circle cx="190" cy="220" r="16" fill="#2B2D42" />
      <circle cx="310" cy="220" r="16" fill="#2B2D42" />
      <circle cx="195" cy="215" r="5" fill="#FFFFFF" />
      <circle cx="315" cy="215" r="5" fill="#FFFFFF" />
      <!-- Nariz y boca -->
      <polygon points="250,245 260,255 240,255" fill="#E76F51" />
      <path d="M 240 255 Q 230 270 215 265 M 260 255 Q 270 270 285 265" fill="none" stroke="#2B2D42" stroke-width="4" stroke-linecap="round" />
      <!-- Bigotes -->
      <line x1="170" y1="245" x2="90" y2="235" stroke="#2B2D42" stroke-width="4" stroke-linecap="round" />
      <line x1="170" y1="255" x2="95" y2="260" stroke="#2B2D42" stroke-width="4" stroke-linecap="round" />
      <line x1="330" y1="245" x2="410" y2="235" stroke="#2B2D42" stroke-width="4" stroke-linecap="round" />
      <line x1="330" y1="255" x2="405" y2="260" stroke="#2B2D42" stroke-width="4" stroke-linecap="round" />
      <!-- Pecho blanco -->
      <ellipse cx="250" cy="380" rx="45" ry="40" fill="#FFF1E6" />
    `
  },

  // --- MEDIO: VEHÍCULOS Y ESPACIO ---
  {
    id: 'cohete',
    title: 'Cohete Cósmico',
    category: 'vehiculos',
    categoryName: 'Vehículos',
    difficulty: 'medio',
    dotsCount: 20,
    icon: '🚀',
    description: '¡Rumbo a las estrellas y más allá con este cohete veloz!',
    isClosed: true,
    viewWidth: 500,
    viewHeight: 500,
    dots: [
      { id: 1, x: 250, y: 40 },
      { id: 2, x: 290, y: 110 },
      { id: 3, x: 310, y: 180 },
      { id: 4, x: 320, y: 260 },
      { id: 5, x: 390, y: 340 },
      { id: 6, x: 390, y: 400 },
      { id: 7, x: 320, y: 370 },
      { id: 8, x: 300, y: 410 },
      { id: 9, x: 280, y: 410 },
      { id: 10, x: 270, y: 460 },
      { id: 11, x: 250, y: 490 },
      { id: 12, x: 230, y: 460 },
      { id: 13, x: 220, y: 410 },
      { id: 14, x: 200, y: 410 },
      { id: 15, x: 180, y: 370 },
      { id: 16, x: 110, y: 400 },
      { id: 17, x: 110, y: 340 },
      { id: 18, x: 180, y: 260 },
      { id: 19, x: 190, y: 180 },
      { id: 20, x: 210, y: 110 }
    ],
    outlinePath: 'M 250 40 L 290 110 L 310 180 L 320 260 L 390 340 L 390 400 L 320 370 L 300 410 L 280 410 L 270 460 L 250 490 L 230 460 L 220 410 L 200 410 L 180 370 L 110 400 L 110 340 L 180 260 L 190 180 L 210 110 Z',
    colorArt: `
      <!-- Fuego propulsor -->
      <polygon points="220,410 250,490 280,410" fill="#FF5400" />
      <polygon points="235,410 250,470 265,410" fill="#FFD166" />
      <!-- Aletas -->
      <polygon points="320,260 390,340 390,400 320,370" fill="#E63946" stroke="#C1121F" stroke-width="5" />
      <polygon points="180,260 110,340 110,400 180,370" fill="#E63946" stroke="#C1121F" stroke-width="5" />
      <!-- Cuerpo del cohete -->
      <path d="M 250 40 C 310 120 330 240 320 410 L 180 410 C 170 240 190 120 250 40 Z" fill="#F8F9FA" stroke="#495057" stroke-width="6" />
      <!-- Punta roja -->
      <path d="M 250 40 C 275 75 285 110 285 110 L 215 110 C 215 110 225 75 250 40 Z" fill="#E63946" />
      <!-- Ventanilla Ojo de Buey -->
      <circle cx="250" cy="200" r="38" fill="#48CAE4" stroke="#0077B6" stroke-width="8" />
      <circle cx="250" cy="200" r="28" fill="#90E0EF" />
      <path d="M 235 185 Q 260 180 265 195" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" fill="none" />
    `
  },

  // --- MEDIO: COMIDA ---
  {
    id: 'helado',
    title: 'Helado Cucurucho',
    category: 'comida',
    categoryName: 'Comida',
    difficulty: 'medio',
    dotsCount: 16,
    icon: '🍦',
    description: '¡El helado más sabroso y refrescante del verano!',
    isClosed: true,
    viewWidth: 500,
    viewHeight: 500,
    dots: [
      { id: 1, x: 250, y: 50 },
      { id: 2, x: 320, y: 70 },
      { id: 3, x: 360, y: 130 },
      { id: 4, x: 340, y: 200 },
      { id: 5, x: 370, y: 250 },
      { id: 6, x: 330, y: 280 },
      { id: 7, x: 250, y: 470 },
      { id: 8, x: 170, y: 280 },
      { id: 9, x: 130, y: 250 },
      { id: 10, x: 160, y: 200 },
      { id: 11, x: 140, y: 130 },
      { id: 12, x: 180, y: 70 },
      { id: 13, x: 210, y: 140 },
      { id: 14, x: 250, y: 120 },
      { id: 15, x: 290, y: 140 },
      { id: 16, x: 250, y: 80 }
    ],
    outlinePath: 'M 250 50 C 340 50 380 140 340 200 C 380 230 360 280 330 280 L 250 470 L 170 280 C 140 280 120 230 160 200 C 120 140 160 50 250 50 Z',
    colorArt: `
      <!-- Cono barquillo -->
      <polygon points="170,260 330,260 250,470" fill="#E9C46A" stroke="#D4A373" stroke-width="6" />
      <line x1="190" y1="260" x2="270" y2="420" stroke="#CCD5AE" stroke-width="3" />
      <line x1="220" y1="260" x2="260" y2="450" stroke="#CCD5AE" stroke-width="3" />
      <line x1="310" y1="260" x2="230" y2="420" stroke="#CCD5AE" stroke-width="3" />
      <!-- Bola de fresa -->
      <path d="M 150 220 C 140 290 360 290 350 220 C 370 170 330 130 250 130 C 170 130 130 170 150 220 Z" fill="#FF70A6" stroke="#FF477E" stroke-width="5" />
      <!-- Bola de nata/menta superior -->
      <circle cx="250" cy="120" r="70" fill="#A8DADC" stroke="#457B9D" stroke-width="5" />
      <!-- Cereza superior -->
      <circle cx="250" cy="50" r="18" fill="#D90429" />
      <path d="M 250 40 Q 280 15 295 25" fill="none" stroke="#6F4E37" stroke-width="4" stroke-linecap="round" />
      <!-- Fideos de colores -->
      <line x1="220" y1="110" x2="235" y2="105" stroke="#FFD166" stroke-width="5" stroke-linecap="round" />
      <line x1="270" y1="125" x2="285" y2="135" stroke="#06D6A0" stroke-width="5" stroke-linecap="round" />
      <line x1="230" y1="140" x2="245" y2="145" stroke="#EF476F" stroke-width="5" stroke-linecap="round" />
    `
  },

  // --- MEDIO: ANIMALES ---
  {
    id: 'mariposa',
    title: 'Mariposa Tropical',
    category: 'animales',
    categoryName: 'Animales',
    difficulty: 'medio',
    dotsCount: 22,
    icon: '🦋',
    description: '¡Despliega sus alas brillantes entre las flores del jardín!',
    isClosed: true,
    viewWidth: 500,
    viewHeight: 500,
    dots: [
      { id: 1, x: 250, y: 120 },
      { id: 2, x: 280, y: 80 },
      { id: 3, x: 370, y: 60 },
      { id: 4, x: 440, y: 120 },
      { id: 5, x: 440, y: 220 },
      { id: 6, x: 360, y: 250 },
      { id: 7, x: 420, y: 330 },
      { id: 8, x: 380, y: 420 },
      { id: 9, x: 310, y: 400 },
      { id: 10, x: 265, y: 330 },
      { id: 11, x: 260, y: 400 },
      { id: 12, x: 240, y: 400 },
      { id: 13, x: 235, y: 330 },
      { id: 14, x: 190, y: 400 },
      { id: 15, x: 120, y: 420 },
      { id: 16, x: 80, y: 330 },
      { id: 17, x: 140, y: 250 },
      { id: 18, x: 60, y: 220 },
      { id: 19, x: 60, y: 120 },
      { id: 20, x: 130, y: 60 },
      { id: 21, x: 220, y: 80 },
      { id: 22, x: 250, y: 80 }
    ],
    outlinePath: 'M 250 120 C 320 40 450 80 440 220 C 390 250 370 250 360 250 C 430 300 420 410 320 400 L 260 310 L 260 410 L 240 410 L 240 310 L 180 400 C 80 410 70 300 140 250 C 130 250 110 250 60 220 C 50 80 180 40 250 120 Z',
    colorArt: `
      <!-- Alas superiores -->
      <path d="M 250 160 C 350 40 460 100 430 230 C 350 250 280 220 250 180 Z" fill="#7209B7" stroke="#3A0CA3" stroke-width="6" />
      <path d="M 250 160 C 150 40 40 100 70 230 C 150 250 220 220 250 180 Z" fill="#7209B7" stroke="#3A0CA3" stroke-width="6" />
      <!-- Alas inferiores -->
      <path d="M 250 200 C 320 230 420 280 370 390 C 300 420 260 300 250 250 Z" fill="#F72585" stroke="#B5179E" stroke-width="6" />
      <path d="M 250 200 C 180 230 80 280 130 390 C 200 420 240 300 250 250 Z" fill="#F72585" stroke="#B5179E" stroke-width="6" />
      <!-- Detalles alas -->
      <circle cx="340" cy="140" r="22" fill="#4CC9F0" />
      <circle cx="160" cy="140" r="22" fill="#4CC9F0" />
      <circle cx="320" cy="330" r="16" fill="#4CC9F0" />
      <circle cx="180" cy="330" r="16" fill="#4CC9F0" />
      <!-- Cuerpo -->
      <ellipse cx="250" cy="240" rx="14" ry="75" fill="#2B2D42" />
      <circle cx="250" cy="145" r="18" fill="#2B2D42" />
      <!-- Antenas -->
      <path d="M 245 130 Q 220 90 200 95" fill="none" stroke="#2B2D42" stroke-width="4" stroke-linecap="round" />
      <circle cx="200" cy="95" r="5" fill="#FFD166" />
      <path d="M 255 130 Q 280 90 300 95" fill="none" stroke="#2B2D42" stroke-width="4" stroke-linecap="round" />
      <circle cx="300" cy="95" r="5" fill="#FFD166" />
    `
  },

  // --- DIFÍCIL: FANTASÍA Y ANIMALES ---
  {
    id: 'dino',
    title: 'Dino T-Rex Feliz',
    category: 'animales',
    categoryName: 'Animales',
    difficulty: 'dificil',
    dotsCount: 26,
    icon: '🦖',
    description: '¡El rey de la prehistoria ahora es tu mejor amigo!',
    isClosed: true,
    viewWidth: 500,
    viewHeight: 500,
    dots: [
      { id: 1, x: 260, y: 70 },
      { id: 2, x: 350, y: 70 },
      { id: 3, x: 380, y: 110 },
      { id: 4, x: 360, y: 160 },
      { id: 5, x: 300, y: 170 },
      { id: 6, x: 320, y: 220 },
      { id: 7, x: 360, y: 240 },
      { id: 8, x: 350, y: 270 },
      { id: 9, x: 310, y: 260 },
      { id: 10, x: 320, y: 340 },
      { id: 11, x: 360, y: 440 },
      { id: 12, x: 310, y: 450 },
      { id: 13, x: 270, y: 390 },
      { id: 14, x: 230, y: 450 },
      { id: 15, x: 180, y: 450 },
      { id: 16, x: 210, y: 360 },
      { id: 17, x: 160, y: 370 },
      { id: 18, x: 70, y: 350 },
      { id: 19, x: 50, y: 290 },
      { id: 20, x: 130, y: 280 },
      { id: 21, x: 180, y: 230 },
      { id: 22, x: 200, y: 170 },
      { id: 23, x: 210, y: 130 },
      { id: 24, x: 180, y: 100 },
      { id: 25, x: 210, y: 80 },
      { id: 26, x: 240, y: 90 }
    ],
    outlinePath: 'M 260 70 L 350 70 L 380 110 L 360 160 L 300 170 L 320 220 L 360 240 L 350 270 L 310 260 L 320 340 L 360 440 L 310 450 L 270 390 L 230 450 L 180 450 L 210 360 L 160 370 L 70 350 L 50 290 L 130 280 L 180 230 L 200 170 L 210 130 L 180 100 L 210 80 Z',
    colorArt: `
      <!-- Cuerpo Dino -->
      <path d="M 260 70 L 350 70 L 380 110 L 360 160 L 300 170 L 320 220 L 360 240 L 350 270 L 310 260 L 320 340 L 360 440 L 310 450 L 270 390 L 230 450 L 180 450 L 210 360 L 160 370 L 70 350 L 50 290 L 130 280 L 180 230 L 200 170 L 210 130 L 180 100 L 210 80 Z" fill="#52B788" stroke="#2D6A4F" stroke-width="7" stroke-linejoin="round" />
      <!-- Barriguita amarilla -->
      <path d="M 230 230 C 270 230 290 320 260 370 C 220 360 210 300 230 230 Z" fill="#D8F3DC" />
      <!-- Ojo -->
      <circle cx="300" cy="110" r="14" fill="#FFFFFF" />
      <circle cx="304" cy="110" r="8" fill="#1B4332" />
      <circle cx="306" cy="108" r="3" fill="#FFFFFF" />
      <!-- Dientes graciosos -->
      <polygon points="340,160 345,150 350,160" fill="#FFFFFF" />
      <polygon points="325,160 330,150 335,160" fill="#FFFFFF" />
      <!-- Espinas en la espalda -->
      <polygon points="190,120 170,110 185,135" fill="#D90429" />
      <polygon points="175,170 155,165 170,190" fill="#D90429" />
      <polygon points="145,230 120,225 138,245" fill="#D90429" />
      <polygon points="90,290 70,270 95,295" fill="#D90429" />
    `
  },

  // --- FÁCIL: FANTASÍA ---
  {
    id: 'corona',
    title: 'Corona Real',
    category: 'fantasia',
    categoryName: 'Fantasía',
    difficulty: 'facil',
    dotsCount: 12,
    icon: '👑',
    description: '¡La corona de los reyes y reinas del reino fantástico!',
    isClosed: true,
    viewWidth: 500,
    viewHeight: 500,
    dots: [
      { id: 1, x: 90, y: 180 },
      { id: 2, x: 150, y: 260 },
      { id: 3, x: 250, y: 130 },
      { id: 4, x: 350, y: 260 },
      { id: 5, x: 410, y: 180 },
      { id: 6, x: 380, y: 380 },
      { id: 7, x: 320, y: 380 },
      { id: 8, x: 250, y: 380 },
      { id: 9, x: 180, y: 380 },
      { id: 10, x: 120, y: 380 },
      { id: 11, x: 100, y: 280 },
      { id: 12, x: 90, y: 220 }
    ],
    outlinePath: 'M 90 180 L 150 260 L 250 130 L 350 260 L 410 180 L 380 380 L 120 380 Z',
    colorArt: `
      <!-- Cuerpo corona dorada -->
      <path d="M 90 180 L 150 260 L 250 130 L 350 260 L 410 180 L 380 380 L 120 380 Z" fill="#FFCA3A" stroke="#E09F3E" stroke-width="8" stroke-linejoin="round" />
      <!-- Banda inferior carmesí -->
      <path d="M 125 340 L 375 340 L 370 380 L 120 380 Z" fill="#9E2A2B" />
      <!-- Joyas puntas -->
      <circle cx="90" cy="175" r="16" fill="#1982C4" stroke="#FFFFFF" stroke-width="3" />
      <circle cx="250" cy="125" r="22" fill="#FF595E" stroke="#FFFFFF" stroke-width="4" />
      <circle cx="410" cy="175" r="16" fill="#8AC926" stroke="#FFFFFF" stroke-width="3" />
      <!-- Gemas frontales -->
      <polygon points="250,290 265,310 250,330 235,310" fill="#6A4C93" />
      <circle cx="180" cy="310" r="10" fill="#1982C4" />
      <circle cx="320" cy="310" r="10" fill="#8AC926" />
    `
  },

  // --- APRENDE: LETRAS Y NÚMEROS ---
  {
    id: 'letra-a',
    title: 'Letra A de Avión',
    category: 'aprende',
    categoryName: 'Aprende',
    difficulty: 'facil',
    dotsCount: 10,
    icon: '🅰️',
    description: '¡Aprende la primera letra del abecedario conectando los puntos!',
    isClosed: true,
    viewWidth: 500,
    viewHeight: 500,
    dots: [
      { id: 1, x: 250, y: 70 },
      { id: 2, x: 320, y: 220 },
      { id: 3, x: 390, y: 420 },
      { id: 4, x: 320, y: 420 },
      { id: 5, x: 285, y: 310 },
      { id: 6, x: 215, y: 310 },
      { id: 7, x: 180, y: 420 },
      { id: 8, x: 110, y: 420 },
      { id: 9, x: 180, y: 220 },
      { id: 10, x: 220, y: 130 }
    ],
    outlinePath: 'M 250 70 L 390 420 L 320 420 L 285 310 L 215 310 L 180 420 L 110 420 Z M 230 240 L 270 240 L 250 170 Z',
    colorArt: `
      <!-- Letra A tridimensional / colorida -->
      <path d="M 250 70 L 390 420 L 320 420 L 285 310 L 215 310 L 180 420 L 110 420 Z" fill="#3A86FF" stroke="#023E8A" stroke-width="8" stroke-linejoin="round" />
      <polygon points="230,240 270,240 250,160" fill="#FFFFFF" stroke="#023E8A" stroke-width="6" />
      <!-- Ojos divertidos -->
      <circle cx="210" cy="180" r="12" fill="#FFFFFF" />
      <circle cx="290" cy="180" r="12" fill="#FFFFFF" />
      <circle cx="212" cy="180" r="6" fill="#2B2D42" />
      <circle cx="292" cy="180" r="6" fill="#2B2D42" />
      <path d="M 235 275 Q 250 295 265 275" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" />
    `
  },

  // --- MEDIO: ANIMALES (DELFÍN) ---
  {
    id: 'delfin',
    title: 'Delfín Saltarín',
    category: 'animales',
    categoryName: 'Animales',
    difficulty: 'medio',
    dotsCount: 18,
    icon: '🐬',
    description: '¡Salta sobre las olas del océano azul!',
    isClosed: true,
    viewWidth: 500,
    viewHeight: 500,
    dots: [
      { id: 1, x: 100, y: 310 },
      { id: 2, x: 140, y: 240 },
      { id: 3, x: 210, y: 170 },
      { id: 4, x: 300, y: 150 },
      { id: 5, x: 340, y: 110 },
      { id: 6, x: 350, y: 170 },
      { id: 7, x: 420, y: 230 },
      { id: 8, x: 440, y: 270 },
      { id: 9, x: 410, y: 280 },
      { id: 10, x: 350, y: 270 },
      { id: 11, x: 310, y: 320 },
      { id: 12, x: 280, y: 300 },
      { id: 13, x: 240, y: 280 },
      { id: 14, x: 160, y: 290 },
      { id: 15, x: 80, y: 330 },
      { id: 16, x: 50, y: 370 },
      { id: 17, x: 80, y: 360 },
      { id: 18, x: 60, y: 390 }
    ],
    outlinePath: 'M 100 310 C 140 210 250 140 350 170 C 430 200 450 270 410 280 C 340 300 280 290 240 280 C 160 290 90 320 60 380 Z',
    colorArt: `
      <!-- Olas del mar de fondo -->
      <path d="M 40 430 Q 110 390 180 430 T 320 430 T 460 430" fill="none" stroke="#0096C7" stroke-width="8" stroke-linecap="round" />
      <path d="M 70 460 Q 140 420 210 460 T 350 460" fill="none" stroke="#48CAE4" stroke-width="6" stroke-linecap="round" />
      <!-- Cuerpo delfín -->
      <path d="M 70 360 C 140 210 250 140 350 170 C 430 200 450 270 410 280 C 340 300 280 290 240 280 C 160 290 100 320 70 360 Z" fill="#00B4D8" stroke="#0077B6" stroke-width="7" stroke-linejoin="round" />
      <!-- Aleta dorsal -->
      <path d="M 290 155 Q 330 110 345 165 Z" fill="#0096C7" stroke="#0077B6" stroke-width="5" />
      <!-- Aleta lateral -->
      <path d="M 290 280 Q 320 330 270 305 Z" fill="#0077B6" />
      <!-- Cola -->
      <path d="M 80 345 Q 40 320 50 370 Q 75 360 60 400 Z" fill="#0077B6" />
      <!-- Panza clara -->
      <path d="M 160 290 C 230 280 340 290 390 275 C 340 300 240 295 160 290 Z" fill="#E0FBFC" />
      <!-- Ojo -->
      <circle cx="370" cy="225" r="9" fill="#1D3557" />
      <circle cx="372" cy="223" r="3" fill="#FFFFFF" />
    `
  },

  // --- MEDIO: VEHÍCULOS (COCHE) ---
  {
    id: 'coche',
    title: 'Bólido Veloz',
    category: 'vehiculos',
    categoryName: 'Vehículos',
    difficulty: 'medio',
    dotsCount: 16,
    icon: '🏎️',
    description: '¡Un potente coche de carreras listo para el circuito!',
    isClosed: true,
    viewWidth: 500,
    viewHeight: 500,
    dots: [
      { id: 1, x: 60, y: 310 },
      { id: 2, x: 90, y: 250 },
      { id: 3, x: 170, y: 250 },
      { id: 4, x: 230, y: 160 },
      { id: 5, x: 340, y: 160 },
      { id: 6, x: 410, y: 250 },
      { id: 7, x: 460, y: 270 },
      { id: 8, x: 460, y: 340 },
      { id: 9, x: 400, y: 340 },
      { id: 10, x: 330, y: 340 },
      { id: 11, x: 210, y: 340 },
      { id: 12, x: 140, y: 340 },
      { id: 13, x: 80, y: 340 },
      { id: 14, x: 50, y: 330 },
      { id: 15, x: 50, y: 280 },
      { id: 16, x: 70, y: 270 }
    ],
    outlinePath: 'M 60 310 L 90 250 L 170 250 L 230 160 L 340 160 L 410 250 L 460 270 L 460 340 L 60 340 Z',
    colorArt: `
      <!-- Chasis rojo brillante -->
      <path d="M 60 310 L 90 250 L 170 250 L 230 160 L 340 160 L 410 250 L 460 270 L 460 340 L 60 340 Z" fill="#E63946" stroke="#BA181B" stroke-width="7" stroke-linejoin="round" />
      <!-- Ventanillas -->
      <polygon points="180,245 230,175 285,175 285,245" fill="#A8DADC" stroke="#457B9D" stroke-width="4" />
      <polygon points="295,175 335,175 390,245 295,245" fill="#A8DADC" stroke="#457B9D" stroke-width="4" />
      <!-- Ruedas -->
      <circle cx="140" cy="340" r="42" fill="#1E293B" stroke="#64748B" stroke-width="8" />
      <circle cx="140" cy="340" r="18" fill="#E2E8F0" />
      <circle cx="370" cy="340" r="42" fill="#1E293B" stroke="#64748B" stroke-width="8" />
      <circle cx="370" cy="340" r="18" fill="#E2E8F0" />
      <!-- Foco amarillo -->
      <polygon points="450,275 460,275 460,295 445,295" fill="#FFD166" />
      <!-- Rayo decorativo -->
      <polygon points="210,270 260,270 240,295 280,295 220,325 235,300 200,300" fill="#FFCA3A" />
    `
  },

  // --- FÁCIL: FANTASÍA (FLOR) ---
  {
    id: 'flor',
    title: 'Flor Encantada',
    category: 'fantasia',
    categoryName: 'Fantasía',
    difficulty: 'facil',
    dotsCount: 16,
    icon: '🌸',
    description: '¡Una flor mágica de pétalos brillantes y aroma dulce!',
    isClosed: true,
    viewWidth: 500,
    viewHeight: 500,
    dots: [
      { id: 1, x: 250, y: 70 },
      { id: 2, x: 290, y: 130 },
      { id: 3, x: 370, y: 110 },
      { id: 4, x: 360, y: 190 },
      { id: 5, x: 430, y: 250 },
      { id: 6, x: 360, y: 310 },
      { id: 7, x: 370, y: 390 },
      { id: 8, x: 290, y: 370 },
      { id: 9, x: 250, y: 430 },
      { id: 10, x: 210, y: 370 },
      { id: 11, x: 130, y: 390 },
      { id: 12, x: 140, y: 310 },
      { id: 13, x: 70, y: 250 },
      { id: 14, x: 140, y: 190 },
      { id: 15, x: 130, y: 110 },
      { id: 16, x: 210, y: 130 }
    ],
    outlinePath: 'M 250 70 C 310 70 320 180 370 110 C 420 160 340 230 430 250 C 340 270 420 340 370 390 C 320 320 310 430 250 430 C 190 430 180 320 130 390 C 80 340 160 270 70 250 C 160 230 80 160 130 110 C 180 180 190 70 250 70 Z',
    colorArt: `
      <!-- Tallo verde -->
      <path d="M 250 350 Q 240 450 250 480" fill="none" stroke="#2D6A4F" stroke-width="12" stroke-linecap="round" />
      <path d="M 245 420 Q 180 400 170 430 Q 215 450 245 435 Z" fill="#52B788" stroke="#2D6A4F" stroke-width="4" />
      <!-- Pétalos rosas -->
      <circle cx="250" cy="150" r="55" fill="#FF70A6" stroke="#FF477E" stroke-width="5" />
      <circle cx="340" cy="200" r="55" fill="#FF70A6" stroke="#FF477E" stroke-width="5" />
      <circle cx="340" cy="300" r="55" fill="#FF70A6" stroke="#FF477E" stroke-width="5" />
      <circle cx="250" cy="350" r="55" fill="#FF70A6" stroke="#FF477E" stroke-width="5" />
      <circle cx="160" cy="300" r="55" fill="#FF70A6" stroke="#FF477E" stroke-width="5" />
      <circle cx="160" cy="200" r="55" fill="#FF70A6" stroke="#FF477E" stroke-width="5" />
      <!-- Centro amarillo -->
      <circle cx="250" cy="250" r="55" fill="#FFD166" stroke="#F4A261" stroke-width="6" />
      <!-- Carita feliz -->
      <circle cx="230" cy="240" r="7" fill="#2B2D42" />
      <circle cx="270" cy="240" r="7" fill="#2B2D42" />
      <path d="M 235 260 Q 250 275 265 260" fill="none" stroke="#2B2D42" stroke-width="4" stroke-linecap="round" />
      <circle cx="215" cy="255" r="7" fill="#FF85A1" opacity="0.6" />
      <circle cx="285" cy="255" r="7" fill="#FF85A1" opacity="0.6" />
    `
  },

  // --- FÁCIL: APRENDE (NÚMERO 5) ---
  {
    id: 'numero-5',
    title: 'Número 5 Saltarín',
    category: 'aprende',
    categoryName: 'Aprende',
    difficulty: 'facil',
    dotsCount: 12,
    icon: '5️⃣',
    description: '¡Conecta y aprende el simpático número 5!',
    isClosed: false,
    viewWidth: 500,
    viewHeight: 500,
    dots: [
      { id: 1, x: 350, y: 100 },
      { id: 2, x: 200, y: 100 },
      { id: 3, x: 180, y: 220 },
      { id: 4, x: 240, y: 200 },
      { id: 5, x: 320, y: 220 },
      { id: 6, x: 370, y: 280 },
      { id: 7, x: 360, y: 370 },
      { id: 8, x: 300, y: 430 },
      { id: 9, x: 200, y: 440 },
      { id: 10, x: 140, y: 390 },
      { id: 11, x: 150, y: 340 },
      { id: 12, x: 200, y: 370 }
    ],
    outlinePath: 'M 350 100 L 200 100 L 180 220 C 240 180 370 200 360 340 C 350 430 220 460 140 390',
    colorArt: `
      <!-- Trazado del número 5 -->
      <path d="M 350 100 L 200 100 L 180 220 C 240 180 370 200 360 340 C 350 430 220 460 140 390" fill="none" stroke="#7209B7" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M 350 100 L 200 100 L 180 220 C 240 180 370 200 360 340 C 350 430 220 460 140 390" fill="none" stroke="#F72585" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Ojitos simpáticos -->
      <circle cx="230" cy="140" r="14" fill="#FFFFFF" />
      <circle cx="270" cy="140" r="14" fill="#FFFFFF" />
      <circle cx="233" cy="140" r="7" fill="#1E293B" />
      <circle cx="273" cy="140" r="7" fill="#1E293B" />
      <!-- Gorrito de fiesta -->
      <polygon points="350,100 390,30 320,70" fill="#FFD166" stroke="#F4A261" stroke-width="4" />
      <circle cx="390" cy="30" r="8" fill="#FF5964" />
    `
  }
];
