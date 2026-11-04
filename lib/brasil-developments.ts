// Empreendimentos no Brasil (João Pessoa, PB) publicados a pedido do Rui em
// 01/11/2026. Conteúdo estático no código (não passa pelo Supabase/admin): as
// fotos vivem em public/images/brasil e os textos abaixo, nos 7 idiomas do
// site. Fonte dos números: tabelas de vendas e books da MGA Construções (pasta
// do Drive enviada pelo Rui). Valores em reais, sujeitos a alteração pela
// incorporadora — a página sempre avisa isso.

import type { AppLocale } from "@/i18n/routing";

type L = Record<AppLocale, string>;

export type BrasilPhoto = { src: string; w: number; h: number; caption: L };

export type BrasilDevelopment = {
  slug: string;
  name: string;
  city: string;
  neighborhood: string;
  address: string;
  developer: string;
  hero: string;
  heroAlt: string;
  priceFrom: number;
  priceTo: number;
  delivery: L;
  typologies: L;
  area: string;
  parking: string;
  tagline: L;
  description: L;
  highlights: L[];
  conditionsExample: { unit: string; total: number; down: number; monthly: { n: number; value: number }; second: { n: number; value: number; label: L }; final: number };
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

const SEMESTRAL: L = {
  "pt-PT": "semestrais",
  "pt-BR": "semestrais",
  en: "semi-annual",
  es: "semestrales",
  fr: "semestrielles",
  it: "semestrali",
  de: "halbjährlich",
};
const INTERCALADA: L = {
  "pt-PT": "intercaladas",
  "pt-BR": "intercaladas",
  en: "intermediate",
  es: "intercaladas",
  fr: "intermédiaires",
  it: "intermedie",
  de: "Zwischenraten",
};

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
    conditionsExample: {
      unit: "3 suítes · 124,61 m²",
      total: 1472161.46,
      down: 147216.15,
      monthly: { n: 60, value: 3680.4 },
      second: { n: 9, value: 24536.02, label: SEMESTRAL },
      final: 883296.88,
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
    conditionsExample: {
      unit: "1 quarto · 39,09 m²",
      total: 526675.33,
      down: 52667.53,
      monthly: { n: 40, value: 2633.38 },
      second: { n: 6, value: 17555.84, label: INTERCALADA },
      final: 263337.66,
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
  },
};

export function formatBrl(value: number, locale: string): string {
  return value.toLocaleString(locale === "pt-PT" ? "pt-BR" : locale, {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}
