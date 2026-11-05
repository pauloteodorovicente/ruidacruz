// Empreendimentos no Brasil (João Pessoa, PB) publicados a pedido do Rui em
// 01/11/2026. Conteúdo estático no código (não passa pelo Supabase/admin): as
// fotos vivem em public/images/brasil e os textos abaixo, nos 7 idiomas do
// site. Fonte dos números: tabelas de vendas e books da MGA Construções (pasta
// do Drive enviada pelo Rui). Valores em reais, sujeitos a alteração pela
// incorporadora — a página sempre avisa isso.

import type { AppLocale } from "@/i18n/routing";
import { BRASIL_PHOTO_FILES } from "@/lib/brasil-photos";

type L = Record<AppLocale, string>;

export type BrasilPhoto = { src: string; w: number; h: number; caption: L };
export type BrasilCondRow = { kind: "down" | "monthly" | "semi" | "inter" | "final"; n: number; value: number };
export type BrasilVideo = { id: string; title: L };

export type BrasilDevelopment = {
  slug: string;
  name: string;
  city: string;
  neighborhood?: string;
  address?: string;
  developer: string;
  hero: string;
  heroAlt: string;
  priceFrom: number;
  priceTo: number;
  delivery?: L;
  typologies: L;
  area: string;
  parking?: string;
  kindLabel?: L;
  tagline?: L;
  description?: L;
  highlights?: L[];
  conditions?: { unit: string; total: number; rows: BrasilCondRow[] };
  videos?: BrasilVideo[];
  photos: BrasilPhoto[];
};

const cap = (pt: string, en: string, es: string, fr: string, it: string, de: string, ptBR?: string): L => ({
  "pt-PT": pt,
  "pt-BR": ptBR ?? pt,
  en,
  es,
  fr,
  it,
  de,
});


// ---- Fotos geradas (lib/brasil-photos.ts) + legendas por tipo de foto ----
const CAP: Record<string, L> = {
  facade: cap("Fachada", "Façade", "Fachada", "Façade", "Facciata", "Fassade"),
  setting: cap("Implantação", "Setting", "Implantación", "Implantation", "Inserimento", "Lage"),
  lobby: cap("Lobby", "Lobby", "Lobby", "Hall d'entrée", "Lobby", "Lobby"),
  restaurant: cap("Restaurante", "Restaurant", "Restaurante", "Restaurant", "Ristorante", "Restaurant"),
  gourmet: cap("Espaço gourmet", "Gourmet area", "Zona gourmet", "Espace gourmet", "Area gourmet", "Gourmetbereich"),
  gym: cap("Academia", "Gym", "Gimnasio", "Salle de sport", "Palestra", "Fitnessraum"),
  pool: cap("Piscina", "Pool", "Piscina", "Piscine", "Piscina", "Pool"),
  deck: cap("Deck da piscina", "Pool deck", "Deck de la piscina", "Terrasse de la piscine", "Deck della piscina", "Poolterrasse"),
  party: cap("Salão de festas", "Party room", "Salón de fiestas", "Salle de réception", "Sala feste", "Eventraum"),
  kids: cap("Brinquedoteca", "Kids' room", "Sala infantil", "Salle de jeux enfants", "Sala giochi bimbi", "Kinderspielzimmer"),
  pet: cap("Pet place", "Pet area", "Zona de mascotas", "Espace animaux", "Area pet", "Haustierbereich"),
  playground: cap("Playground", "Playground", "Parque infantil", "Aire de jeux", "Area giochi", "Spielplatz"),
  coworking: cap("Coworking", "Coworking", "Coworking", "Coworking", "Coworking", "Coworking"),
  rooftop: cap("Cobertura de lazer", "Rooftop leisure", "Terraza de ocio", "Toit-terrasse", "Terrazza panoramica", "Dachterrasse"),
  lounge: cap("Lounge", "Lounge", "Lounge", "Lounge", "Lounge", "Lounge"),
  terrace: cap("Terraço", "Terrace", "Terraza", "Terrasse", "Terrazza", "Terrasse"),
  games: cap("Salão de jogos", "Games room", "Sala de juegos", "Salle de jeux", "Sala giochi", "Spielzimmer"),
  living: cap("Sala", "Living room", "Sala", "Salon", "Soggiorno", "Wohnzimmer"),
  balcony: cap("Varanda", "Balcony", "Balcón", "Balcon", "Balcone", "Balkon"),
  suite: cap("Suíte", "Suite", "Suite", "Suite", "Suite", "Suite"),
  bedroom: cap("Quarto", "Bedroom", "Dormitorio", "Chambre", "Camera", "Schlafzimmer"),
  studio: cap("Studio", "Studio", "Estudio", "Studio", "Monolocale", "Studio"),
  laundry: cap("Lavanderia", "Laundry", "Lavandería", "Buanderie", "Lavanderia", "Waschküche"),
  wellness: cap("Wellness", "Wellness", "Wellness", "Bien-être", "Wellness", "Wellness"),
  apartment: cap("Apartamento", "Apartment", "Apartamento", "Appartement", "Appartamento", "Wohnung"),
  masterplan: cap("Masterplan", "Master plan", "Plan maestro", "Plan masse", "Masterplan", "Masterplan"),
};
const AMENITY_KINDS = ["pool", "deck", "gym", "party", "kids", "playground", "coworking", "rooftop", "lounge", "gourmet", "pet", "games", "wellness", "restaurant", "laundry"];

function photosFor(slug: string): BrasilPhoto[] {
  return (BRASIL_PHOTO_FILES[slug] ?? []).map((p) => ({
    src: `/images/brasil/${slug}/${p.file}`,
    w: p.w,
    h: p.h,
    caption: CAP[p.kind] ?? CAP.facade,
  }));
}

const KIND_RESIDENTIAL: L = cap("Edifício residencial", "Residential building", "Edificio residencial", "Immeuble résidentiel", "Edificio residenziale", "Wohngebäude");

// Descrição montada só com fatos do empreendimento (tipologias, áreas, lazer
// das fotos) quando não há texto escrito à mão.
export function describeDevelopment(d: BrasilDevelopment, loc: AppLocale): string {
  if (d.description) return d.description[loc];
  const kinds = new Set((BRASIL_PHOTO_FILES[d.slug] ?? []).map((p) => p.kind));
  const amen = AMENITY_KINDS.filter((k) => kinds.has(k))
    .slice(0, 6)
    .map((k) => CAP[k][loc].toLowerCase())
    .join(", ");
  const kind = (d.kindLabel ?? KIND_RESIDENTIAL)[loc];
  const place = [d.neighborhood, d.city].filter(Boolean).join(", ");
  const head: Record<AppLocale, string> = {
    "pt-PT": `${kind} em ${place}.`,
    "pt-BR": `${kind} em ${place}.`,
    en: `${kind} in ${place}.`,
    es: `${kind} en ${place}.`,
    fr: `${kind} à ${place}.`,
    it: `${kind} a ${place}.`,
    de: `${kind} in ${place}.`,
  };
  const lead: Record<AppLocale, string> = {
    "pt-PT": "Lazer",
    "pt-BR": "Lazer",
    en: "Amenities",
    es: "Zonas comunes",
    fr: "Équipements",
    it: "Servizi",
    de: "Ausstattung",
  };
  return `${head[loc]} ${d.typologies[loc]}, ${d.area}.${amen ? ` ${lead[loc]}: ${amen}.` : ""}`;
}

const V = (pt: string, en: string): L => cap(pt, en, pt, en, en, en);

const MORE_DEVELOPMENTS: BrasilDevelopment[] = [
  {
    slug: "sens",
    name: "Sens",
    city: "João Pessoa, PB",
    neighborhood: "Jardim Oceania",
    address: "Rua Bacharel José de Oliveira Curchatuz, 589",
    developer: "MGA Construções",
    hero: "/images/brasil/sens/03-facade.jpg",
    heroAlt: "Sens, fachada",
    priceFrom: 856926,
    priceTo: 1755170,
    delivery: cap("Agosto de 2027", "August 2027", "Agosto de 2027", "Août 2027", "Agosto 2027", "August 2027"),
    typologies: cap("2 e 3 quartos", "2 and 3 bedrooms", "2 y 3 dormitorios", "2 et 3 chambres", "2 e 3 camere", "2 und 3 Zimmer"),
    area: "68 a 105 m²",
    parking: "1 a 2",
    conditions: {
      unit: "3 quartos · 83,45 m²",
      total: 917950,
      rows: [
        { kind: "down", n: 1, value: 91795 },
        { kind: "monthly", n: 12, value: 9179.5 },
        { kind: "inter", n: 1, value: 73436 },
        { kind: "final", n: 1, value: 642565 },
      ],
    },
    photos: photosFor("sens"),
  },
  {
    slug: "makai",
    name: "Makai",
    city: "Cabedelo, PB",
    neighborhood: "Camboinha I",
    address: "Av. Max Zagel, 792",
    developer: "MGA Construções",
    hero: "/images/brasil/makai/01-facade.jpg",
    heroAlt: "Makai, fachada",
    priceFrom: 2495965.19,
    priceTo: 2894367.6,
    delivery: cap("Maio de 2027", "May 2027", "Mayo de 2027", "Mai 2027", "Maggio 2027", "Mai 2027"),
    typologies: cap("4 quartos", "4 bedrooms", "4 dormitorios", "4 chambres", "4 camere", "4 Zimmer"),
    area: "176 a 245 m²",
    parking: "2",
    conditions: {
      unit: "4 quartos · 176,08 m²",
      total: 2495965.19,
      rows: [
        { kind: "down", n: 1, value: 249596.52 },
        { kind: "monthly", n: 12, value: 20799.71 },
        { kind: "inter", n: 1, value: 249596.52 },
        { kind: "final", n: 1, value: 1747175.63 },
      ],
    },
    photos: photosFor("makai"),
  },
  {
    slug: "soho",
    name: "Soho",
    city: "João Pessoa, PB",
    neighborhood: "Tambaú",
    address: "Av. Nossa Senhora dos Navegantes (em frente ao HP Shopping)",
    developer: "MGA Construções",
    hero: "/images/brasil/soho/01-facade.jpg",
    heroAlt: "Soho, fachada",
    priceFrom: 579112.42,
    priceTo: 1019067.24,
    delivery: cap("Julho de 2028", "July 2028", "Julio de 2028", "Juillet 2028", "Luglio 2028", "Juli 2028"),
    typologies: cap("Studios e 1 quarto", "Studios and 1 bedroom", "Estudios y 1 dormitorio", "Studios et 1 chambre", "Monolocali e 1 camera", "Studios und 1 Zimmer"),
    area: "24 a 42 m²",
    conditions: {
      unit: "Studio · 25,62 m²",
      total: 579112.42,
      rows: [
        { kind: "down", n: 3, value: 19303.75 },
        { kind: "monthly", n: 21, value: 2757.68 },
        { kind: "inter", n: 3, value: 19303.75 },
        { kind: "final", n: 1, value: 405378.7 },
      ],
    },
    photos: photosFor("soho"),
  },
  {
    slug: "soleil",
    name: "Soleil",
    city: "João Pessoa, PB",
    neighborhood: "Cabo Branco",
    address: "Av. Cabo Branco, 4548",
    developer: "MGA Construções",
    hero: "/images/brasil/soleil/01-facade.jpg",
    heroAlt: "Soleil, fachada",
    priceFrom: 490756.8,
    priceTo: 1597214.89,
    delivery: cap("Dezembro de 2028", "December 2028", "Diciembre de 2028", "Décembre 2028", "Dicembre 2028", "Dezember 2028"),
    typologies: cap("Studios e studio com garden", "Studios and studios with garden", "Estudios y estudios con jardín", "Studios et studios avec jardin", "Monolocali e monolocali con giardino", "Studios und Studios mit Garten"),
    area: "16 a 75 m²",
    conditions: {
      unit: "Studio · 15,76 m²",
      total: 490756.8,
      rows: [
        { kind: "down", n: 3, value: 16358.56 },
        { kind: "monthly", n: 26, value: 1887.53 },
        { kind: "inter", n: 4, value: 12268.92 },
        { kind: "final", n: 1, value: 343529.76 },
      ],
    },
    videos: [
      { id: "1pvheABjDFAK-LoNOA-d3QiO_4y9UKr4b", title: V("Vídeo de apresentação", "Presentation video") },
      { id: "1uHV-oURMHejA1p3k3yQjcXDRF454QDym", title: V("Vídeo curto", "Short video") },
    ],
    photos: photosFor("soleil"),
  },
  {
    slug: "lumini",
    name: "Lumini",
    city: "João Pessoa, PB",
    neighborhood: "Cabo Branco",
    address: "Rua Marcionila da Conceição, 1220",
    developer: "MGA Construções",
    hero: "/images/brasil/lumini/01-facade.jpg",
    heroAlt: "Lumini, fachada",
    priceFrom: 546320.32,
    priceTo: 676822.66,
    delivery: cap("Abril de 2029", "April 2029", "Abril de 2029", "Avril 2029", "Aprile 2029", "April 2029"),
    typologies: cap("Studios e studio com garden", "Studios and studios with garden", "Estudios y estudios con jardín", "Studios et studios avec jardin", "Monolocali e monolocali con giardino", "Studios und Studios mit Garten"),
    area: "22 a 40 m²",
    conditions: {
      unit: "Studio com garden · 32,47 m²",
      total: 546320.32,
      rows: [
        { kind: "down", n: 3, value: 18210.68 },
        { kind: "monthly", n: 30, value: 2731.6 },
        { kind: "inter", n: 4, value: 20487.01 },
        { kind: "final", n: 1, value: 327792.19 },
      ],
    },
    photos: photosFor("lumini"),
  },
  {
    slug: "mondo",
    name: "Mondo",
    city: "João Pessoa, PB",
    developer: "MGA Construções",
    hero: "/images/brasil/mondo/01-facade.jpg",
    heroAlt: "Mondo, fachada",
    priceFrom: 371049.05,
    priceTo: 2276223.33,
    typologies: cap("Studios, 1 quarto e duplex", "Studios, 1 bedroom and duplex", "Estudios, 1 dormitorio y dúplex", "Studios, 1 chambre et duplex", "Monolocali, 1 camera e duplex", "Studios, 1 Zimmer und Duplex"),
    area: "17 a 141 m²",
    description: cap(
      "Empreendimento em João Pessoa com fotos e vídeos reais. Studios, apartamentos de 1 quarto, duplex e coberturas com piscina, lojas comerciais para venda e locação. Lazer: lobby com lounge, restaurante, academia com crosstraining e yoga, spa com sauna, lounge e bar, espaço gourmet e piscina.",
      "Development in João Pessoa with real photos and videos. Studios, 1-bedroom apartments, duplexes and penthouses with pool, plus retail units for sale and lease. Amenities: lobby lounge, restaurant, gym with crosstraining and yoga, spa with sauna, lounge bar, gourmet area and pool.",
      "Promoción en João Pessoa con fotos y vídeos reales. Estudios, apartamentos de 1 dormitorio, dúplex y áticos con piscina, además de locales comerciales en venta y alquiler. Zonas comunes: lobby con lounge, restaurante, gimnasio con crosstraining y yoga, spa con sauna, bar lounge, zona gourmet y piscina.",
      "Programme à João Pessoa avec photos et vidéos réelles. Studios, appartements 1 chambre, duplex et penthouses avec piscine, ainsi que des commerces à vendre et à louer. Équipements : lobby avec lounge, restaurant, salle de sport avec crosstraining et yoga, spa avec sauna, bar lounge, espace gourmet et piscine.",
      "Sviluppo a João Pessoa con foto e video reali. Monolocali, appartamenti con 1 camera, duplex e attici con piscina, oltre a negozi in vendita e in affitto. Servizi: lobby con lounge, ristorante, palestra con crosstraining e yoga, spa con sauna, lounge bar, area gourmet e piscina.",
      "Projekt in João Pessoa mit echten Fotos und Videos. Studios, 1-Zimmer-Wohnungen, Duplex und Penthäuser mit Pool sowie Gewerbeeinheiten zum Kauf und zur Miete. Ausstattung: Lobby-Lounge, Restaurant, Fitness mit Crosstraining und Yoga, Spa mit Sauna, Loungebar, Gourmetbereich und Pool.",
    ),
    videos: [
      { id: "13w_-yrTyfl053j0-AcJ1UFZ2DucP5Dts", title: V("Vista aérea 1", "Aerial view 1") },
      { id: "1I85nTAUwQnfTViCOUS4kf0HI0t0t1Fs2", title: V("Vista aérea 2", "Aerial view 2") },
      { id: "1GLl7aq8Ypo4whJVY0pfWuwHfo5gR0jPr", title: V("Vista aérea 3", "Aerial view 3") },
      { id: "1tJ1770TpxtmURUhUZ4Tf-XdU1LA--yyu", title: V("Cobertura 616", "Penthouse 616") },
      { id: "1-oQRb6KfvOHIzK8DJI5hA5OMYLZZ0UZ9", title: V("Cobertura 618", "Penthouse 618") },
      { id: "1d9qJrk5auLSXgil2tddCDs26wZckjZXr", title: V("Unidade 228 (decorada)", "Unit 228 (furnished)") },
    ],
    photos: photosFor("mondo"),
  },
  {
    slug: "brisas-do-atlantico",
    name: "Edifício Brisas do Atlântico",
    city: "João Pessoa, PB",
    neighborhood: "Brisamar",
    address: "Rua José Brasilino Leite",
    developer: "MGA Construções",
    hero: "/images/brasil/brisas/01-apartment.jpg",
    heroAlt: "Brisas do Atlântico, cobertura duplex",
    priceFrom: 2820000,
    priceTo: 2820000,
    typologies: cap("Cobertura duplex, 4 suítes", "Duplex penthouse, 4 suites", "Ático dúplex, 4 suites", "Penthouse duplex, 4 suites", "Attico duplex, 4 suite", "Duplex-Penthouse, 4 Suiten"),
    area: "300 m²",
    parking: "4",
    kindLabel: cap("Cobertura duplex", "Duplex penthouse", "Ático dúplex", "Penthouse duplex", "Attico duplex", "Duplex-Penthouse"),
    description: cap(
      "Cobertura duplex mobiliada de alto padrão, unidade 2302, com 300 m² privativos e 4 vagas de garagem com carregador para carro elétrico. Piso superior com piscina exclusiva e gazebo, churrasqueira, suíte master com closet e banheira; piso inferior com 3 suítes, adega para cerca de 200 garrafas e cozinha equipada. Condomínio com elevador panorâmico, piscinas, sauna, academia, salão de jogos e mini market.",
      "Furnished high-end duplex penthouse, unit 2302, with 300 m² of private area and 4 parking spaces with electric-car charger. Upper floor with private pool and gazebo, barbecue, master suite with walk-in closet and bathtub; lower floor with 3 suites, a wine cellar for about 200 bottles and a fitted kitchen. Building with panoramic lift, pools, sauna, gym, games room and mini market.",
      "Ático dúplex amueblado de alto nivel, unidad 2302, con 300 m² privativos y 4 plazas de garaje con cargador para coche eléctrico. Planta superior con piscina exclusiva y gazebo, barbacoa, suite principal con vestidor y bañera; planta inferior con 3 suites, bodega para unas 200 botellas y cocina equipada. Edificio con ascensor panorámico, piscinas, sauna, gimnasio, sala de juegos y minimercado.",
      "Penthouse duplex meublé haut de gamme, lot 2302, de 300 m² privatifs et 4 places de parking avec borne pour voiture électrique. Étage supérieur avec piscine privée et gazebo, barbecue, suite parentale avec dressing et baignoire ; étage inférieur avec 3 suites, cave à vin d'environ 200 bouteilles et cuisine équipée. Immeuble avec ascenseur panoramique, piscines, sauna, salle de sport, salle de jeux et supérette.",
      "Attico duplex arredato di alto livello, unità 2302, con 300 m² privati e 4 posti auto con colonnina per auto elettrica. Piano superiore con piscina privata e gazebo, barbecue, suite master con cabina armadio e vasca; piano inferiore con 3 suite, cantina per circa 200 bottiglie e cucina attrezzata. Edificio con ascensore panoramico, piscine, sauna, palestra, sala giochi e minimarket.",
      "Möbliertes hochwertiges Duplex-Penthouse, Einheit 2302, mit 300 m² Privatfläche und 4 Stellplätzen mit Ladestation für Elektroautos. Obergeschoss mit privatem Pool und Gazebo, Grill, Hauptsuite mit Ankleide und Badewanne; Untergeschoss mit 3 Suiten, Weinkeller für etwa 200 Flaschen und ausgestatteter Küche. Gebäude mit Panoramaaufzug, Pools, Sauna, Fitnessraum, Spielzimmer und Minimarkt.",
    ),
    photos: photosFor("brisas"),
  },
  {
    slug: "alteza-condo-resort",
    name: "Alteza Condo Resort",
    city: "Bananeiras, PB",
    address: "Rua Pedro Gondim, Sítio Bezerros",
    developer: "MGA Construções",
    hero: "/images/brasil/alteza/01-masterplan.jpg",
    heroAlt: "Alteza Condo Resort, masterplan",
    priceFrom: 370000,
    priceTo: 370000,
    typologies: cap("Lote de 16 × 25 m (Quadra K, lote 190)", "Plot of 16 × 25 m (Block K, lot 190)", "Parcela de 16 × 25 m (Manzana K, lote 190)", "Terrain de 16 × 25 m (Bloc K, lot 190)", "Lotto di 16 × 25 m (Blocco K, lotto 190)", "Grundstück 16 × 25 m (Block K, Lot 190)"),
    area: "400 m²",
    kindLabel: cap("Lote em condomínio resort", "Plot in a resort condominium", "Parcela en condominio resort", "Terrain en résidence-club", "Lotto in condominio resort", "Grundstück in Resort-Anlage"),
    description: cap(
      "Lote de 400 m² (16 × 25 m), Quadra K, lote 190, no Alteza Condo Resort, em Bananeiras, na Paraíba. Masterplan e mapa de etapas do condomínio disponíveis; o book completo é fornecido a pedido.",
      "400 m² plot (16 × 25 m), Block K, lot 190, in the Alteza Condo Resort in Bananeiras, Paraíba. The master plan and phase map are available; the full brochure is provided on request.",
      "Parcela de 400 m² (16 × 25 m), Manzana K, lote 190, en el Alteza Condo Resort, en Bananeiras, Paraíba. Plan maestro y mapa de etapas disponibles; el dosier completo se facilita bajo petición.",
      "Terrain de 400 m² (16 × 25 m), Bloc K, lot 190, dans l'Alteza Condo Resort, à Bananeiras, Paraíba. Plan masse et carte des phases disponibles ; la brochure complète est fournie sur demande.",
      "Lotto di 400 m² (16 × 25 m), Blocco K, lotto 190, nell'Alteza Condo Resort, a Bananeiras, Paraíba. Masterplan e mappa delle fasi disponibili; la brochure completa è fornita su richiesta.",
      "Grundstück von 400 m² (16 × 25 m), Block K, Lot 190, im Alteza Condo Resort in Bananeiras, Paraíba. Masterplan und Etappenkarte verfügbar; die vollständige Broschüre erhalten Sie auf Anfrage.",
    ),
    photos: photosFor("alteza"),
  },
];

export const BRASIL_DEVELOPMENTS: BrasilDevelopment[] = [
  {
    slug: "elevare",
    name: "Elevare",
    city: "João Pessoa, PB",
    neighborhood: "Altiplano Cabo Branco",
    address: "Rua Josita Almeida, 373",
    developer: "MGA Construções",
    hero: "/images/brasil/elevare/fachada-aproximada.jpg",
    heroAlt: "Elevare, fachada ao entardecer",
    priceFrom: 1472161.46,
    priceTo: 7846060.28,
    delivery: cap("Dezembro de 2031", "December 2031", "Diciembre de 2031", "Décembre 2031", "Dicembre 2031", "Dezember 2031"),
    typologies: cap(
      "3 e 4 suítes e coberturas",
      "3 and 4 suites and penthouses",
      "3 y 4 suites y áticos",
      "3 et 4 suites et penthouses",
      "3 e 4 suite e attici",
      "3 und 4 Suiten und Penthäuser",
    ),
    area: "124 a 350 m²",
    parking: "2 a 5",
    tagline: cap(
      "Um novo marco do Altiplano",
      "A new landmark for the Altiplano",
      "Un nuevo hito del Altiplano",
      "Un nouveau repère de l'Altiplano",
      "Un nuovo punto di riferimento dell'Altiplano",
      "Ein neues Wahrzeichen des Altiplano",
    ),
    description: cap(
      "Torre de alto padrão no Altiplano Cabo Branco, em João Pessoa. Apartamentos de 3 e 4 suítes, com posição nascente, varandas generosas e coberturas de até 350 m², num condomínio com lazer completo.",
      "A high-end tower in Altiplano Cabo Branco, in João Pessoa. Apartments with 3 and 4 suites, east-facing, with generous balconies and penthouses of up to 350 m², in a condominium with full leisure facilities.",
      "Torre de alto nivel en Altiplano Cabo Branco, en João Pessoa. Apartamentos de 3 y 4 suites, orientación este, con amplios balcones y áticos de hasta 350 m², en un condominio con ocio completo.",
      "Tour haut de gamme à Altiplano Cabo Branco, à João Pessoa. Appartements de 3 et 4 suites, orientés à l'est, avec de larges balcons et des penthouses jusqu'à 350 m², dans une copropriété dotée d'équipements de loisirs complets.",
      "Torre di alto livello nell'Altiplano Cabo Branco, a João Pessoa. Appartamenti con 3 e 4 suite, esposizione a est, ampi balconi e attici fino a 350 m², in un condominio con servizi per il tempo libero completi.",
      "Hochwertiger Turm im Altiplano Cabo Branco, in João Pessoa. Wohnungen mit 3 und 4 Suiten, nach Osten ausgerichtet, mit großzügigen Balkonen und Penthäusern bis 350 m², in einer Anlage mit vollständigem Freizeitangebot.",
      "Torre de alto padrão no Altiplano Cabo Branco, em João Pessoa. Apartamentos de 3 e 4 suítes, com posição nascente, varandas generosas e coberturas de até 350 m², num condomínio com lazer completo.",
    ),
    highlights: [
      cap("Duas torres, até 44 andares", "Two towers, up to 44 floors", "Dos torres, hasta 44 plantas", "Deux tours, jusqu'à 44 étages", "Due torri, fino a 44 piani", "Zwei Türme, bis zu 44 Etagen"),
      cap("Posição nascente, vistas abertas", "East-facing, open views", "Orientación este, vistas abiertas", "Orientation est, vues dégagées", "Esposizione a est, viste aperte", "Ostausrichtung, offene Ausblicke"),
      cap("Piscina, academia, cinema e beach tennis", "Pool, gym, cinema and beach tennis", "Piscina, gimnasio, cine y tenis playa", "Piscine, salle de sport, cinéma et beach tennis", "Piscina, palestra, cinema e beach tennis", "Pool, Fitnessraum, Kino und Beach-Tennis"),
      cap("2 a 5 vagas de garagem", "2 to 5 parking spaces", "2 a 5 plazas de garaje", "2 à 5 places de parking", "2-5 posti auto", "2 bis 5 Stellplätze"),
    ],
    conditions: {
      unit: "3 suítes · 124,61 m²",
      total: 1472161.46,
      rows: [
        { kind: "down", n: 1, value: 147216.15 },
        { kind: "monthly", n: 60, value: 3680.4 },
        { kind: "semi", n: 9, value: 24536.02 },
        { kind: "final", n: 1, value: 883296.88 },
      ],
    },
    photos: [
      { src: "/images/brasil/elevare/fachada-aproximada.jpg", w: 1800, h: 1012, caption: cap("Fachada", "Façade", "Fachada", "Façade", "Facciata", "Fassade") },
      { src: "/images/brasil/elevare/fachada-dia.jpg", w: 1389, h: 1800, caption: cap("Fachada de dia", "Façade by day", "Fachada de día", "Façade de jour", "Facciata di giorno", "Fassade bei Tag") },
      { src: "/images/brasil/elevare/fachada-noite.jpg", w: 1097, h: 1800, caption: cap("Fachada à noite", "Façade at night", "Fachada de noche", "Façade de nuit", "Facciata di notte", "Fassade bei Nacht") },
      { src: "/images/brasil/elevare/insercao.jpg", w: 1800, h: 1463, caption: cap("Implantação", "Setting", "Implantación", "Implantation", "Inserimento", "Lage") },
      { src: "/images/brasil/elevare/lobby.jpg", w: 1800, h: 1013, caption: cap("Lobby", "Lobby", "Lobby", "Hall d'entrée", "Lobby", "Lobby") },
      { src: "/images/brasil/elevare/sala.jpg", w: 1800, h: 818, caption: cap("Sala", "Living room", "Sala", "Salon", "Soggiorno", "Wohnzimmer") },
      { src: "/images/brasil/elevare/varanda.jpg", w: 1800, h: 1013, caption: cap("Varanda", "Balcony", "Balcón", "Balcon", "Balcone", "Balkon") },
      { src: "/images/brasil/elevare/suite-master.jpg", w: 1800, h: 1083, caption: cap("Suíte master", "Master suite", "Suite principal", "Suite parentale", "Suite master", "Hauptsuite") },
      { src: "/images/brasil/elevare/piscina.jpg", w: 1800, h: 1013, caption: cap("Piscina", "Pool", "Piscina", "Piscine", "Piscina", "Pool") },
      { src: "/images/brasil/elevare/academia.jpg", w: 1800, h: 1013, caption: cap("Academia", "Gym", "Gimnasio", "Salle de sport", "Palestra", "Fitnessraum") },
      { src: "/images/brasil/elevare/salao-de-festas.jpg", w: 1800, h: 1013, caption: cap("Salão de festas", "Party room", "Salón de fiestas", "Salle de réception", "Sala feste", "Eventraum") },
      { src: "/images/brasil/elevare/cinema.jpg", w: 1800, h: 1013, caption: cap("Cinema", "Cinema", "Cine", "Cinéma", "Cinema", "Kino") },
      { src: "/images/brasil/elevare/beach-tenis.jpg", w: 1800, h: 1013, caption: cap("Beach tennis", "Beach tennis", "Tenis playa", "Beach tennis", "Beach tennis", "Beach-Tennis") },
    ],
  },
  {
    slug: "essenza-park",
    name: "Essenza Park",
    city: "João Pessoa, PB",
    neighborhood: "Jardim Oceania",
    address: "Rua Silvano Domingos de Araújo, 272",
    developer: "MGA Construções",
    hero: "/images/brasil/essenza-park/fachada-dia.jpg",
    heroAlt: "Essenza Park, fachada",
    priceFrom: 526675.33,
    priceTo: 1102342.85,
    delivery: cap("Abril de 2030", "April 2030", "Abril de 2030", "Avril 2030", "Aprile 2030", "April 2030"),
    typologies: cap(
      "1, 2 e 3 quartos",
      "1, 2 and 3 bedrooms",
      "1, 2 y 3 dormitorios",
      "1, 2 et 3 chambres",
      "1, 2 e 3 camere",
      "1, 2 und 3 Zimmer",
    ),
    area: "39 a 75 m²",
    parking: "1",
    tagline: cap(
      "A vida celebra a natureza",
      "Life celebrates nature",
      "La vida celebra la naturaleza",
      "La vie célèbre la nature",
      "La vita celebra la natura",
      "Das Leben feiert die Natur",
    ),
    description: cap(
      "Edifício contemporâneo no Jardim Oceania, em João Pessoa. Apartamentos de 1, 2 e 3 quartos em plantas eficientes, varandas integradas ao verde e um condomínio com lazer de resort, ideal para viver ou investir.",
      "A contemporary building in Jardim Oceania, João Pessoa. Apartments with 1, 2 and 3 bedrooms in efficient layouts, balconies integrated with greenery and resort-style amenities, ideal to live in or invest.",
      "Edificio contemporáneo en Jardim Oceania, João Pessoa. Apartamentos de 1, 2 y 3 dormitorios con distribuciones eficientes, balcones integrados en el verde y zonas comunes tipo resort, ideal para vivir o invertir.",
      "Immeuble contemporain à Jardim Oceania, João Pessoa. Appartements de 1, 2 et 3 chambres aux plans efficaces, balcons intégrés à la verdure et équipements de type resort, idéal pour y vivre ou investir.",
      "Edificio contemporaneo a Jardim Oceania, João Pessoa. Appartamenti con 1, 2 e 3 camere dalle planimetrie efficienti, balconi integrati nel verde e servizi in stile resort, ideale per vivere o investire.",
      "Zeitgenössisches Gebäude in Jardim Oceania, João Pessoa. Wohnungen mit 1, 2 und 3 Zimmern in effizienten Grundrissen, begrünte Balkone und Resort-Ausstattung, ideal zum Wohnen oder als Kapitalanlage.",
      "Edifício contemporâneo no Jardim Oceania, em João Pessoa. Apartamentos de 1, 2 e 3 quartos em plantas eficientes, varandas integradas ao verde e um condomínio com lazer de resort, ideal para morar ou investir.",
    ),
    highlights: [
      cap("Entrega prevista em abril de 2030", "Delivery scheduled for April 2030", "Entrega prevista en abril de 2030", "Livraison prévue en avril 2030", "Consegna prevista ad aprile 2030", "Fertigstellung voraussichtlich April 2030"),
      cap("Cobertura com área de lazer", "Rooftop leisure area", "Terraza con zona de ocio", "Toit-terrasse avec espace de loisirs", "Terrazza con area relax", "Dachterrasse mit Freizeitbereich"),
      cap("Coworking, academia, mini market e pet care", "Coworking, gym, mini market and pet care", "Coworking, gimnasio, minimercado y pet care", "Coworking, salle de sport, supérette et pet care", "Coworking, palestra, minimarket e pet care", "Coworking, Fitnessraum, Minimarkt und Pet Care"),
      cap("Planta ideal para morar ou investir", "Ideal layouts to live in or invest", "Distribuciones ideales para vivir o invertir", "Plans idéaux pour y vivre ou investir", "Planimetrie ideali per vivere o investire", "Ideale Grundrisse zum Wohnen oder Investieren"),
    ],
    conditions: {
      unit: "1 quarto · 39,09 m²",
      total: 526675.33,
      rows: [
        { kind: "down", n: 1, value: 52667.53 },
        { kind: "monthly", n: 40, value: 2633.38 },
        { kind: "inter", n: 6, value: 17555.84 },
        { kind: "final", n: 1, value: 263337.66 },
      ],
    },
    photos: [
      { src: "/images/brasil/essenza-park/fachada-dia.jpg", w: 1800, h: 1269, caption: cap("Fachada", "Façade", "Fachada", "Façade", "Facciata", "Fassade") },
      { src: "/images/brasil/essenza-park/fachada.jpg", w: 1673, h: 1800, caption: cap("Fachada", "Façade", "Fachada", "Façade", "Facciata", "Fassade") },
      { src: "/images/brasil/essenza-park/insercao.jpg", w: 1800, h: 1349, caption: cap("Implantação", "Setting", "Implantación", "Implantation", "Inserimento", "Lage") },
      { src: "/images/brasil/essenza-park/cobertura.jpg", w: 1800, h: 1012, caption: cap("Cobertura", "Rooftop", "Terraza", "Toit-terrasse", "Terrazza", "Dachterrasse") },
      { src: "/images/brasil/essenza-park/cobertura-2.jpg", w: 1800, h: 1012, caption: cap("Cobertura", "Rooftop", "Terraza", "Toit-terrasse", "Terrazza", "Dachterrasse") },
      { src: "/images/brasil/essenza-park/lobby.jpg", w: 1800, h: 1013, caption: cap("Lobby", "Lobby", "Lobby", "Hall d'entrée", "Lobby", "Lobby") },
      { src: "/images/brasil/essenza-park/academia.jpg", w: 1800, h: 1012, caption: cap("Academia", "Gym", "Gimnasio", "Salle de sport", "Palestra", "Fitnessraum") },
      { src: "/images/brasil/essenza-park/gourmet.jpg", w: 1800, h: 1012, caption: cap("Espaço gourmet", "Gourmet area", "Zona gourmet", "Espace gourmet", "Area gourmet", "Gourmetbereich") },
      { src: "/images/brasil/essenza-park/salao-de-festas.jpg", w: 1800, h: 450, caption: cap("Salão de festas", "Party room", "Salón de fiestas", "Salle de réception", "Sala feste", "Eventraum") },
      { src: "/images/brasil/essenza-park/coworking.jpg", w: 1800, h: 1200, caption: cap("Coworking", "Coworking", "Coworking", "Coworking", "Coworking", "Coworking") },
      { src: "/images/brasil/essenza-park/playground.jpg", w: 1800, h: 1012, caption: cap("Playground", "Playground", "Parque infantil", "Aire de jeux", "Area giochi", "Spielplatz") },
      { src: "/images/brasil/essenza-park/quadra.jpg", w: 1800, h: 1012, caption: cap("Quadra", "Sports court", "Pista deportiva", "Terrain de sport", "Campo sportivo", "Sportplatz") },
    ],
  },
  ...MORE_DEVELOPMENTS,
];

export function getBrasilDevelopment(slug: string): BrasilDevelopment | undefined {
  return BRASIL_DEVELOPMENTS.find((d) => d.slug === slug);
}

export type BrasilUi = {
  navLabel: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  metaTitle: string;
  metaDescription: string;
  from: string;
  viewDetails: string;
  back: string;
  location: string;
  delivery: string;
  typologies: string;
  area: string;
  parking: string;
  developer: string;
  priceRange: string;
  about: string;
  gallery: string;
  conditions: string;
  conditionsFor: string;
  down: string;
  monthlyLabel: string;
  final: string;
  total: string;
  note: string;
  leadEyebrow: string;
  leadTitle: string;
  leadSubtitle: string;
  leadSubmit: string;
  noteGlobal: string;
  consult: string;
  videos: string;
  kDown: string;
  kMonthly: string;
  kSemi: string;
  kInter: string;
  homePortugal: string;
  homeBrasil: string;
  priceFixed: string;
  address: string;
};

export const BRASIL_UI: Record<AppLocale, BrasilUi> = {
  "pt-PT": {
    navLabel: "Empreendimentos no Brasil",
    eyebrow: "Brasil · João Pessoa",
    title: "Empreendimentos no Brasil",
    subtitle: "Lançamentos selecionados em João Pessoa, na Paraíba, para quem procura viver ou investir no litoral do Nordeste brasileiro.",
    metaTitle: "Empreendimentos no Brasil | João Pessoa | Rui da Cruz",
    metaDescription: "Lançamentos selecionados em João Pessoa, Brasil: Elevare e Essenza Park. Tabelas, plantas e condições de pagamento.",
    from: "Desde",
    viewDetails: "Ver empreendimento",
    back: "Todos os empreendimentos no Brasil",
    location: "Localização",
    delivery: "Entrega prevista",
    typologies: "Tipologias",
    area: "Áreas",
    parking: "Vagas",
    developer: "Incorporadora",
    priceRange: "Valores",
    about: "O empreendimento",
    gallery: "Galeria",
    conditions: "Condições de pagamento",
    conditionsFor: "Exemplo para a unidade",
    down: "Sinal",
    monthlyLabel: "parcelas mensais de",
    final: "Parcela final",
    total: "Valor total",
    note: "Valores em reais (R$), indicativos e sujeitos a alteração sem aviso prévio pela incorporadora. Correção pelo INCC até à emissão do habite-se.",
    leadEyebrow: "Contacto",
    leadTitle: "Quero saber mais",
    leadSubtitle: "Deixe o seu contacto e o Rui responde com a tabela completa, plantas e disponibilidade.",
    leadSubmit: "Pedir informações",
    noteGlobal: "Valores em reais (R$), indicativos e sujeitos a alteração sem aviso prévio.",
    consult: "Consultar",
    videos: "Vídeos",
    kDown: "Sinal",
    kMonthly: "parcelas mensais",
    kSemi: "parcelas semestrais",
    kInter: "parcelas intercaladas",
    homePortugal: "Empreendimentos Portugal",
    homeBrasil: "Empreendimentos Brasil",
    priceFixed: "Valor",
    address: "Morada",
  },
  "pt-BR": {
    navLabel: "Empreendimentos no Brasil",
    eyebrow: "Brasil · João Pessoa",
    title: "Empreendimentos no Brasil",
    subtitle: "Lançamentos selecionados em João Pessoa, na Paraíba, para quem busca morar ou investir no litoral do Nordeste brasileiro.",
    metaTitle: "Empreendimentos no Brasil | João Pessoa | Rui da Cruz",
    metaDescription: "Lançamentos selecionados em João Pessoa, Brasil: Elevare e Essenza Park. Tabelas, plantas e condições de pagamento.",
    from: "A partir de",
    viewDetails: "Ver empreendimento",
    back: "Todos os empreendimentos no Brasil",
    location: "Localização",
    delivery: "Previsão de entrega",
    typologies: "Tipologias",
    area: "Áreas",
    parking: "Vagas",
    developer: "Incorporadora",
    priceRange: "Valores",
    about: "O empreendimento",
    gallery: "Galeria",
    conditions: "Condições de pagamento",
    conditionsFor: "Exemplo para a unidade",
    down: "Sinal",
    monthlyLabel: "parcelas mensais de",
    final: "Parcela final",
    total: "Valor total",
    note: "Valores em reais (R$), indicativos e sujeitos a alteração sem aviso prévio pela incorporadora. Correção pelo INCC até o habite-se.",
    leadEyebrow: "Contato",
    leadTitle: "Quero saber mais",
    leadSubtitle: "Deixe seu contato e o Rui responde com a tabela completa, plantas e disponibilidade.",
    leadSubmit: "Pedir informações",
    noteGlobal: "Valores em reais (R$), indicativos e sujeitos a alteração sem aviso prévio.",
    consult: "Consultar",
    videos: "Vídeos",
    kDown: "Sinal",
    kMonthly: "parcelas mensais",
    kSemi: "parcelas semestrais",
    kInter: "parcelas intercaladas",
    homePortugal: "Empreendimentos Portugal",
    homeBrasil: "Empreendimentos Brasil",
    priceFixed: "Valor",
    address: "Endereço",
  },
  en: {
    navLabel: "Developments in Brazil",
    eyebrow: "Brazil · João Pessoa",
    title: "Developments in Brazil",
    subtitle: "Selected launches in João Pessoa, Paraíba, for those looking to live or invest on Brazil's north-eastern coast.",
    metaTitle: "Developments in Brazil | João Pessoa | Rui da Cruz",
    metaDescription: "Selected launches in João Pessoa, Brazil: Elevare and Essenza Park. Price lists, floor plans and payment terms.",
    from: "From",
    viewDetails: "View development",
    back: "All developments in Brazil",
    location: "Location",
    delivery: "Expected delivery",
    typologies: "Layouts",
    area: "Areas",
    parking: "Parking",
    developer: "Developer",
    priceRange: "Prices",
    about: "The development",
    gallery: "Gallery",
    conditions: "Payment terms",
    conditionsFor: "Example for the unit",
    down: "Down payment",
    monthlyLabel: "monthly instalments of",
    final: "Final payment",
    total: "Total price",
    note: "Prices in Brazilian reais (R$), indicative and subject to change without notice by the developer. Adjusted by INCC until the occupancy permit.",
    leadEyebrow: "Contact",
    leadTitle: "I'd like to know more",
    leadSubtitle: "Leave your contact and Rui will reply with the full price list, floor plans and availability.",
    leadSubmit: "Request information",
    noteGlobal: "Prices in Brazilian reais (R$), indicative and subject to change without notice.",
    consult: "Enquire",
    videos: "Videos",
    kDown: "Down payment",
    kMonthly: "monthly instalments",
    kSemi: "semi-annual instalments",
    kInter: "intermediate instalments",
    homePortugal: "Portugal Developments",
    homeBrasil: "Brazil Developments",
    priceFixed: "Price",
    address: "Address",
  },
  es: {
    navLabel: "Promociones en Brasil",
    eyebrow: "Brasil · João Pessoa",
    title: "Promociones en Brasil",
    subtitle: "Lanzamientos seleccionados en João Pessoa, Paraíba, para quien busca vivir o invertir en el litoral del nordeste brasileño.",
    metaTitle: "Promociones en Brasil | João Pessoa | Rui da Cruz",
    metaDescription: "Lanzamientos seleccionados en João Pessoa, Brasil: Elevare y Essenza Park. Tablas de precios, planos y condiciones de pago.",
    from: "Desde",
    viewDetails: "Ver promoción",
    back: "Todas las promociones en Brasil",
    location: "Ubicación",
    delivery: "Entrega prevista",
    typologies: "Tipologías",
    area: "Superficies",
    parking: "Plazas",
    developer: "Promotora",
    priceRange: "Precios",
    about: "La promoción",
    gallery: "Galería",
    conditions: "Condiciones de pago",
    conditionsFor: "Ejemplo para la unidad",
    down: "Entrada",
    monthlyLabel: "cuotas mensuales de",
    final: "Cuota final",
    total: "Precio total",
    note: "Precios en reales (R$), orientativos y sujetos a cambios sin previo aviso por la promotora. Corrección por INCC hasta el certificado de ocupación.",
    leadEyebrow: "Contacto",
    leadTitle: "Quiero saber más",
    leadSubtitle: "Deje su contacto y Rui le responderá con la tabla completa, planos y disponibilidad.",
    leadSubmit: "Solicitar información",
    noteGlobal: "Precios en reales (R$), orientativos y sujetos a cambios sin previo aviso.",
    consult: "Consultar",
    videos: "Vídeos",
    kDown: "Entrada",
    kMonthly: "cuotas mensuales",
    kSemi: "cuotas semestrales",
    kInter: "cuotas intercaladas",
    homePortugal: "Promociones Portugal",
    homeBrasil: "Promociones Brasil",
    priceFixed: "Precio",
    address: "Dirección",
  },
  fr: {
    navLabel: "Programmes au Brésil",
    eyebrow: "Brésil · João Pessoa",
    title: "Programmes au Brésil",
    subtitle: "Lancements sélectionnés à João Pessoa, dans la Paraíba, pour ceux qui souhaitent vivre ou investir sur le littoral du nord-est du Brésil.",
    metaTitle: "Programmes au Brésil | João Pessoa | Rui da Cruz",
    metaDescription: "Lancements sélectionnés à João Pessoa, Brésil : Elevare et Essenza Park. Grilles de prix, plans et conditions de paiement.",
    from: "À partir de",
    viewDetails: "Voir le programme",
    back: "Tous les programmes au Brésil",
    location: "Localisation",
    delivery: "Livraison prévue",
    typologies: "Typologies",
    area: "Surfaces",
    parking: "Parkings",
    developer: "Promoteur",
    priceRange: "Prix",
    about: "Le programme",
    gallery: "Galerie",
    conditions: "Conditions de paiement",
    conditionsFor: "Exemple pour le lot",
    down: "Acompte",
    monthlyLabel: "mensualités de",
    final: "Solde final",
    total: "Prix total",
    note: "Prix en réaux (R$), indicatifs et susceptibles de changer sans préavis par le promoteur. Indexation INCC jusqu'à l'obtention du permis d'occupation.",
    leadEyebrow: "Contact",
    leadTitle: "Je souhaite en savoir plus",
    leadSubtitle: "Laissez vos coordonnées et Rui vous répondra avec la grille complète, les plans et les disponibilités.",
    leadSubmit: "Demander des informations",
    noteGlobal: "Prix en réaux (R$), indicatifs et susceptibles de changer sans préavis.",
    consult: "Se renseigner",
    videos: "Vidéos",
    kDown: "Acompte",
    kMonthly: "mensualités",
    kSemi: "échéances semestrielles",
    kInter: "échéances intermédiaires",
    homePortugal: "Programmes Portugal",
    homeBrasil: "Programmes Brésil",
    priceFixed: "Prix",
    address: "Adresse",
  },
  it: {
    navLabel: "Sviluppi in Brasile",
    eyebrow: "Brasile · João Pessoa",
    title: "Sviluppi in Brasile",
    subtitle: "Lanci selezionati a João Pessoa, nella Paraíba, per chi cerca di vivere o investire sul litorale del nord-est brasiliano.",
    metaTitle: "Sviluppi in Brasile | João Pessoa | Rui da Cruz",
    metaDescription: "Lanci selezionati a João Pessoa, Brasile: Elevare ed Essenza Park. Listini, planimetrie e condizioni di pagamento.",
    from: "Da",
    viewDetails: "Vedi il progetto",
    back: "Tutti gli sviluppi in Brasile",
    location: "Posizione",
    delivery: "Consegna prevista",
    typologies: "Tipologie",
    area: "Superfici",
    parking: "Posti auto",
    developer: "Costruttore",
    priceRange: "Prezzi",
    about: "Il progetto",
    gallery: "Galleria",
    conditions: "Condizioni di pagamento",
    conditionsFor: "Esempio per l'unità",
    down: "Caparra",
    monthlyLabel: "rate mensili da",
    final: "Rata finale",
    total: "Prezzo totale",
    note: "Prezzi in reais (R$), indicativi e soggetti a modifica senza preavviso da parte del costruttore. Rivalutazione INCC fino al certificato di agibilità.",
    leadEyebrow: "Contatto",
    leadTitle: "Vorrei saperne di più",
    leadSubtitle: "Lasci il suo contatto e Rui risponderà con il listino completo, le planimetrie e la disponibilità.",
    leadSubmit: "Richiedi informazioni",
    noteGlobal: "Prezzi in reais (R$), indicativi e soggetti a modifica senza preavviso.",
    consult: "Richiedi info",
    videos: "Video",
    kDown: "Caparra",
    kMonthly: "rate mensili",
    kSemi: "rate semestrali",
    kInter: "rate intermedie",
    homePortugal: "Sviluppi Portogallo",
    homeBrasil: "Sviluppi Brasile",
    priceFixed: "Prezzo",
    address: "Indirizzo",
  },
  de: {
    navLabel: "Projekte in Brasilien",
    eyebrow: "Brasilien · João Pessoa",
    title: "Projekte in Brasilien",
    subtitle: "Ausgewählte Neubauprojekte in João Pessoa, Paraíba, für alle, die an der Küste im Nordosten Brasiliens leben oder investieren möchten.",
    metaTitle: "Projekte in Brasilien | João Pessoa | Rui da Cruz",
    metaDescription: "Ausgewählte Neubauprojekte in João Pessoa, Brasilien: Elevare und Essenza Park. Preislisten, Grundrisse und Zahlungsbedingungen.",
    from: "Ab",
    viewDetails: "Projekt ansehen",
    back: "Alle Projekte in Brasilien",
    location: "Lage",
    delivery: "Voraussichtliche Übergabe",
    typologies: "Wohnungstypen",
    area: "Flächen",
    parking: "Stellplätze",
    developer: "Bauträger",
    priceRange: "Preise",
    about: "Das Projekt",
    gallery: "Galerie",
    conditions: "Zahlungsbedingungen",
    conditionsFor: "Beispiel für die Einheit",
    down: "Anzahlung",
    monthlyLabel: "Monatsraten von",
    final: "Schlussrate",
    total: "Gesamtpreis",
    note: "Preise in Real (R$), unverbindlich und vom Bauträger jederzeit änderbar. Anpassung nach INCC bis zur Bezugsfertigkeit.",
    leadEyebrow: "Kontakt",
    leadTitle: "Ich möchte mehr erfahren",
    leadSubtitle: "Hinterlassen Sie Ihren Kontakt und Rui antwortet mit der vollständigen Preisliste, Grundrissen und Verfügbarkeit.",
    leadSubmit: "Informationen anfordern",
    noteGlobal: "Preise in Real (R$), unverbindlich und jederzeit änderbar.",
    consult: "Anfragen",
    videos: "Videos",
    kDown: "Anzahlung",
    kMonthly: "Monatsraten",
    kSemi: "Halbjahresraten",
    kInter: "Zwischenraten",
    homePortugal: "Projekte Portugal",
    homeBrasil: "Projekte Brasilien",
    priceFixed: "Preis",
    address: "Adresse",
  },
};

export function formatBrl(value: number, locale: string): string {
  return value.toLocaleString(locale === "pt-PT" ? "pt-BR" : locale, {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

// Cards dos empreendimentos do Brasil para o carrossel da Home (entram todos
// como destaque, sem passar pelo banco).
export type BrasilHomeCard = { id: string; href: string; image: string; alt: string; title: string; zone: string; price: string };

export function brasilHomeCards(locale: string): BrasilHomeCard[] {
  const loc = (locale in BRASIL_UI ? locale : "pt-PT") as AppLocale;
  const ui = BRASIL_UI[loc];
  return BRASIL_DEVELOPMENTS.map((d) => ({
    id: `brasil-${d.slug}`,
    href: `/empreendimentos-brasil/${d.slug}`,
    image: d.hero,
    alt: d.heroAlt,
    title: d.name,
    zone: [d.neighborhood, d.city].filter(Boolean).join(" · "),
    price: `${d.priceFrom === d.priceTo ? "" : ui.from + " "}${formatBrl(d.priceFrom, loc)}`,
  }));
}
