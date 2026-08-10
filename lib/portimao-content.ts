export type Locale = "pt-PT" | "pt-BR" | "en" | "es" | "fr" | "it" | "de";

export const galleryPhotos = [
  "Apart T1 Praia_Rocha_10.jpeg",
  "Apart T1 Praia_Rocha_9.jpeg",
  "Apart T1 Praia_Rocha_5.jpeg",
  "Apart T1 Praia_Rocha_11.jpeg",
  "Apart T1 Praia_Rocha_7.jpeg",
  "Apart T1 Praia_Rocha_8.jpeg",
  "Apart T1 Praia_Rocha_4.jpeg",
  "Apart T1 Praia_Rocha_1.jpeg",
  "Apart T1 Praia_Rocha_2.jpeg",
  "Apart T1 Praia_Rocha_3.jpeg",
  "Apart T1 Praia_Rocha_6.jpeg",
  "Apart T1 Praia_Rocha_12.jpeg",
  "Apart T1 Praia_Rocha_13.jpeg",
  "Apart T1 Praia_Rocha_14.jpeg",
  "Apart T1 Praia_Rocha_15.jpeg",
  "Apart T1 Praia_Rocha_16.jpeg",
  "Apart T1 Praia_Rocha_17.jpeg",
  "Apart T1 Praia_Rocha_18.jpeg",
  "Apart T1 Praia_Rocha_19.jpeg",
];

// Landing bespoke pro apartamento de arrendamento semanal na Praia da Rocha
// (pedido do Rui, 05/08, prioridade). Mesmo padrão arquitetural do Verdelago
// — content.ts com os 7 locais + language-context próprio — depois que a
// primeira versão só-PT com header/hero customizados foi rejeitada (07/08):
// "só copiar a formatação e as cores" das outras landings.
export const content: Record<
  Locale,
  {
    meta: { title: string; description: string };
    breadcrumb: string;
    nav: { sobre: string; contacto: string };
    hero: { eyebrow: string; location: string };
    identification: {
      tags: string[];
      address: string;
      specs: { label: string; value: string }[];
    };
    narrative: { eyebrow: string; paragraphs: string[] };
    amenities: { eyebrow: string; items: string[] };
    gallery: { eyebrow: string; title: string };
    pricing: {
      eyebrow: string;
      title: string;
      availability: string;
      checkIn: string;
      checkOut: string;
      periodLabel: string;
      priceLabel: string;
      rows: { period: string; price: string }[];
      note: string;
    };
    form: {
      eyebrow: string;
      title: string;
      subtitle: string;
      submit: string;
      success: string;
      sending: string;
      error: string;
    };
    whatsappMessage: string;
  }
> = {
  "pt-PT": {
    meta: {
      title: "Apartamento T1 Praia da Rocha | Arrendamento de Férias — Rui Da Cruz",
      description: "Apartamento T1 para arrendamento semanal, Edifício Alto da Foz, Praia da Rocha, Portimão. Piscina, varanda e a poucos minutos da praia.",
    },
    breadcrumb: "Apartamento · Praia da Rocha, Portimão",
    nav: { sobre: "Sobre", contacto: "Contacto" },
    hero: { eyebrow: "Arrendamento de Férias", location: "Praia da Rocha, Portimão" },
    identification: {
      tags: ["Apartamento T1", "Edifício Alto da Foz", "Piscina"],
      address: "Estrada da Rocha — Edifício Alto da Foz, São Francisco 18, 3.º Andar A35, 8500-804 Portimão",
      specs: [
        { label: "Tipologia", value: "T1" },
        { label: "Área privativa", value: "63 m²" },
        { label: "Capacidade", value: "Até 4 pessoas" },
      ],
    },
    narrative: {
      eyebrow: "O Apartamento",
      paragraphs: [
        "Inserido no Edifício Alto da Foz, na Praia da Rocha, este T1 de 63 m² foi pensado para umas férias confortáveis, a poucos minutos a pé da praia, de restaurantes e do comércio local.",
        "O apartamento tem boa exposição solar, varanda, cozinha totalmente equipada e lugar de estacionamento próprio — espaço suficiente para um casal ou uma família de até quatro pessoas.",
      ],
    },
    amenities: {
      eyebrow: "Comodidades",
      items: ["T1 espaçoso · 63 m² de área privativa", "Piscina", "Excelente exposição solar", "Varanda", "Lugar de estacionamento", "Cozinha totalmente equipada", "A poucos minutos a pé da Praia da Rocha", "Restaurantes, comércio e animação nas proximidades"],
    },
    gallery: { eyebrow: "Galeria", title: "O apartamento em detalhe" },
    pricing: {
      eyebrow: "Disponibilidade e Valores",
      title: "Arrendamento exclusivo por semana",
      availability: "Disponível em julho, agosto, setembro e outubro.",
      checkIn: "Check-in: sábado, a partir das 16h",
      checkOut: "Check-out: sábado, até às 11h",
      periodLabel: "Período",
      priceLabel: "Valor / semana",
      rows: [
        { period: "1.ª quinzena de junho", price: "700 €" },
        { period: "2.ª quinzena de junho", price: "750 €" },
        { period: "1.ª quinzena de julho", price: "850 €" },
        { period: "2.ª quinzena de julho", price: "900 €" },
        { period: "Agosto (época alta)", price: "1.200 €" },
        { period: "1.ª quinzena de setembro", price: "900 €" },
        { period: "2.ª quinzena de setembro", price: "650 €" },
        { period: "Outubro", price: "600 €" },
      ],
      note: "Valores por semana. Para disponibilidade, preços atualizados ou reservas, contacte diretamente.",
    },
    form: {
      eyebrow: "Contacto",
      title: "Reserve a sua semana na Praia da Rocha",
      subtitle: "Envie a sua mensagem — resposta em poucas horas.",
      submit: "Pedir Disponibilidade",
      success: "Recebido. O Rui Da Cruz entrará em contacto em breve.",
      sending: "A enviar…",
      error: "Não foi possível enviar. Tente novamente ou contacte via WhatsApp.",
    },
    whatsappMessage: "Olá Rui, tenho interesse no Apartamento T1 na Praia da Rocha (arrendamento semanal). Gostaria de saber a disponibilidade.",
  },
  "pt-BR": {
    meta: {
      title: "Apartamento T1 Praia da Rocha | Arrendamento de Férias — Rui Da Cruz",
      description: "Apartamento T1 para arrendamento semanal, Edifício Alto da Foz, Praia da Rocha, Portimão. Piscina, varanda e a poucos minutos da praia.",
    },
    breadcrumb: "Apartamento · Praia da Rocha, Portimão",
    nav: { sobre: "Sobre", contacto: "Contacto" },
    hero: { eyebrow: "Arrendamento de Férias", location: "Praia da Rocha, Portimão" },
    identification: {
      tags: ["Apartamento T1", "Edifício Alto da Foz", "Piscina"],
      address: "Estrada da Rocha — Edifício Alto da Foz, São Francisco 18, 3.º Andar A35, 8500-804 Portimão",
      specs: [
        { label: "Tipologia", value: "T1" },
        { label: "Área privativa", value: "63 m²" },
        { label: "Capacidade", value: "Até 4 pessoas" },
      ],
    },
    narrative: {
      eyebrow: "O Apartamento",
      paragraphs: [
        "Inserido no Edifício Alto da Foz, na Praia da Rocha, este T1 de 63 m² foi pensado para umas férias confortáveis, a poucos minutos a pé da praia, de restaurantes e do comércio local.",
        "O apartamento tem boa exposição solar, varanda, cozinha totalmente equipada e lugar de estacionamento próprio — espaço suficiente para um casal ou uma família de até quatro pessoas.",
      ],
    },
    amenities: {
      eyebrow: "Comodidades",
      items: ["T1 espaçoso · 63 m² de área privativa", "Piscina", "Excelente exposição solar", "Varanda", "Lugar de estacionamento", "Cozinha totalmente equipada", "A poucos minutos a pé da Praia da Rocha", "Restaurantes, comércio e animação nas proximidades"],
    },
    gallery: { eyebrow: "Galeria", title: "O apartamento em detalhe" },
    pricing: {
      eyebrow: "Disponibilidade e Valores",
      title: "Arrendamento exclusivo por semana",
      availability: "Disponível em julho, agosto, setembro e outubro.",
      checkIn: "Check-in: sábado, a partir das 16h",
      checkOut: "Check-out: sábado, até às 11h",
      periodLabel: "Período",
      priceLabel: "Valor / semana",
      rows: [
        { period: "1.ª quinzena de junho", price: "700 €" },
        { period: "2.ª quinzena de junho", price: "750 €" },
        { period: "1.ª quinzena de julho", price: "850 €" },
        { period: "2.ª quinzena de julho", price: "900 €" },
        { period: "Agosto (época alta)", price: "1.200 €" },
        { period: "1.ª quinzena de setembro", price: "900 €" },
        { period: "2.ª quinzena de setembro", price: "650 €" },
        { period: "Outubro", price: "600 €" },
      ],
      note: "Valores por semana. Para disponibilidade, preços atualizados ou reservas, contacte diretamente.",
    },
    form: {
      eyebrow: "Contacto",
      title: "Reserve a sua semana na Praia da Rocha",
      subtitle: "Envie a sua mensagem — resposta em poucas horas.",
      submit: "Pedir Disponibilidade",
      success: "Recebido. O Rui Da Cruz entrará em contacto em breve.",
      sending: "A enviar…",
      error: "Não foi possível enviar. Tente novamente ou contacte via WhatsApp.",
    },
    whatsappMessage: "Olá Rui, tenho interesse no Apartamento T1 na Praia da Rocha (arrendamento semanal). Gostaria de saber a disponibilidade.",
  },
  en: {
    meta: {
      title: "1-Bedroom Apartment in Praia da Rocha | Vacation Rental — Rui Da Cruz",
      description: "One-bedroom apartment for weekly rent, Alto da Foz Building, Praia da Rocha, Portimão. Swimming pool, balcony, and just a few minutes from the beach.",
    },
    breadcrumb: "Apartment · Praia da Rocha, Portimão",
    nav: { sobre: "About", contacto: "Contact" },
    hero: { eyebrow: "Vacation Rentals", location: "Praia da Rocha, Portimão" },
    identification: {
      tags: ["One-Bedroom Apartment", "Alto da Foz Building", "Swimming Pool"],
      address: "Estrada da Rocha — Alto da Foz Building, São Francisco 18, 3rd Floor, Unit A35, 8500-804 Portimão",
      specs: [
        { label: "Typology", value: "1-bedroom" },
        { label: "Private area", value: "63 sqm" },
        { label: "Capacity", value: "Up to 4 people" },
      ],
    },
    narrative: {
      eyebrow: "The Apartment",
      paragraphs: [
        "Located in the Alto da Foz Building in Praia da Rocha, this 63 sqm one-bedroom apartment was designed for a comfortable vacation, just a few minutes' walk from the beach, restaurants, and local shops.",
        "The apartment has plenty of natural light, a balcony, a fully equipped kitchen, and its own parking space — enough space for a couple or a family of up to four people.",
      ],
    },
    amenities: {
      eyebrow: "Amenities",
      items: ["Spacious 1-bedroom apartment · 63 sqm of private area", "Swimming pool", "Excellent sunlight exposure", "Balcony", "Parking space", "Fully equipped kitchen", "Just a few minutes' walk from Praia da Rocha", "Restaurants, shops, and entertainment nearby"],
    },
    gallery: { eyebrow: "Gallery", title: "The Apartment in Detail" },
    pricing: {
      eyebrow: "Availability and Prices",
      title: "Exclusive weekly rental",
      availability: "Available in July, August, September, and October.",
      checkIn: "Check-in: Saturday, from 4pm",
      checkOut: "Check-out: Saturday, by 11am",
      periodLabel: "Period",
      priceLabel: "Price / week",
      rows: [
        { period: "First half of June", price: "€700" },
        { period: "Second half of June", price: "€750" },
        { period: "First half of July", price: "€850" },
        { period: "Second half of July", price: "€900" },
        { period: "August (high season)", price: "€1,200" },
        { period: "First half of September", price: "€900" },
        { period: "Second half of September", price: "€650" },
        { period: "October", price: "€600" },
      ],
      note: "Prices per week. For availability, current rates, or reservations, please contact us directly.",
    },
    form: {
      eyebrow: "Contact",
      title: "Book your week at Praia da Rocha",
      subtitle: "Send us a message — we'll get back to you within a few hours.",
      submit: "Check Availability",
      success: "Got it. Rui Da Cruz will be in touch shortly.",
      sending: "Sending…",
      error: "The message could not be sent. Please try again or contact us via WhatsApp.",
    },
    whatsappMessage: "Hi Rui, I'm interested in the one-bedroom apartment in Praia da Rocha (weekly rental). I'd like to know if it's available.",
  },
  es: {
    meta: {
      title: "Apartamento de 1 dormitorio en Praia da Rocha | Alquiler vacacional — Rui Da Cruz",
      description: "Apartamento de 1 dormitorio en alquiler por semanas, edificio Alto da Foz, Praia da Rocha, Portimão. Piscina, balcón y a pocos minutos de la playa.",
    },
    breadcrumb: "Apartamento · Praia da Rocha, Portimão",
    nav: { sobre: "Acerca de", contacto: "Contacto" },
    hero: { eyebrow: "Alquiler vacacional", location: "Praia da Rocha, Portimão" },
    identification: {
      tags: ["Piso de un dormitorio", "Edificio Alto da Foz", "Piscina"],
      address: "Estrada da Rocha — Edificio Alto da Foz, São Francisco 18, 3.ª planta, A35, 8500-804 Portimão",
      specs: [
        { label: "Tipología", value: "1 dormitorio" },
        { label: "Zona privada", value: "63 m²" },
        { label: "Capacidad", value: "Hasta 4 personas" },
      ],
    },
    narrative: {
      eyebrow: "El apartamento",
      paragraphs: [
        "Situado en el edificio Alto da Foz, en Praia da Rocha, este apartamento de un dormitorio de 63 m² ha sido diseñado para disfrutar de unas vacaciones cómodas, a solo unos minutos a pie de la playa, de los restaurantes y de los comercios locales.",
        "El apartamento tiene buena orientación al sol, balcón, cocina totalmente equipada y plaza de aparcamiento propia; espacio suficiente para una pareja o una familia de hasta cuatro personas.",
      ],
    },
    amenities: {
      eyebrow: "Servicios",
      items: ["Amplio apartamento de un dormitorio · 63 m² de superficie privada", "Piscina", "Excelente exposición al sol", "Balcón", "Plaza de aparcamiento", "Cocina totalmente equipada", "A pocos minutos a pie de la playa de Rocha", "Restaurantes, tiendas y ocio en las inmediaciones"],
    },
    gallery: { eyebrow: "Galería", title: "El piso en detalle" },
    pricing: {
      eyebrow: "Disponibilidad y precios",
      title: "Alquiler exclusivo por semana",
      availability: "Disponible en julio, agosto, septiembre y octubre.",
      checkIn: "Entrada: sábado, a partir de las 16:00 h",
      checkOut: "Salida: sábado, hasta las 11:00 h",
      periodLabel: "Periodo",
      priceLabel: "Precio / semana",
      rows: [
        { period: "Primera quincena de junio", price: "700 €" },
        { period: "Segunda quincena de junio", price: "750 €" },
        { period: "Primera quincena de julio", price: "850 €" },
        { period: "Segunda quincena de julio", price: "900 €" },
        { period: "Agosto (temporada alta)", price: "1.200 €" },
        { period: "Primera quincena de septiembre", price: "900 €" },
        { period: "Segunda quincena de septiembre", price: "650 €" },
        { period: "Octubre", price: "600 €" },
      ],
      note: "Precios por semana. Para consultar la disponibilidad, los precios actualizados o realizar reservas, ponte en contacto directamente con nosotros.",
    },
    form: {
      eyebrow: "Contacto",
      title: "Reserva tu semana en Praia da Rocha",
      subtitle: "Envía tu mensaje; te responderemos en unas horas.",
      submit: "Consultar disponibilidad",
      success: "Recibido. Rui Da Cruz se pondrá en contacto contigo en breve.",
      sending: "Enviando…",
      error: "No se ha podido enviar. Inténtalo de nuevo o ponte en contacto con nosotros a través de WhatsApp.",
    },
    whatsappMessage: "Hola, Rui, estoy interesado en el apartamento de un dormitorio en Praia da Rocha (alquiler semanal). Me gustaría saber si está disponible.",
  },
  fr: {
    meta: {
      title: "Appartement 1 pièce à Praia da Rocha | Location de vacances — Rui Da Cruz",
      description: "Appartement T1 à louer à la semaine, immeuble Alto da Foz, Praia da Rocha, Portimão. Piscine, balcon et à quelques minutes de la plage.",
    },
    breadcrumb: "Appartement · Praia da Rocha, Portimão",
    nav: { sobre: "À propos", contacto: "Contact" },
    hero: { eyebrow: "Location de vacances", location: "Praia da Rocha, Portimão" },
    identification: {
      tags: ["Appartement 1 pièce", "Immeuble Alto da Foz", "Piscine"],
      address: "Estrada da Rocha — Immeuble Alto da Foz, São Francisco 18, 3e étage, bureau A35, 8500-804 Portimão",
      specs: [
        { label: "Typologie", value: "1 pièce" },
        { label: "Espace privé", value: "63 m²" },
        { label: "Capacité", value: "Jusqu'à 4 personnes" },
      ],
    },
    narrative: {
      eyebrow: "L'appartement",
      paragraphs: [
        "Situé dans l'immeuble Alto da Foz, à Praia da Rocha, ce studio de 63 m² a été conçu pour vous offrir des vacances confortables, à quelques minutes à pied de la plage, des restaurants et des commerces locaux.",
        "L'appartement bénéficie d'un bon ensoleillement, d'un balcon, d'une cuisine entièrement équipée et d'une place de parking privée — il est suffisamment spacieux pour accueillir un couple ou une famille de quatre personnes maximum.",
      ],
    },
    amenities: {
      eyebrow: "Équipements",
      items: ["Spacieux studio · 63 m² de surface privée", "Piscine", "Excellente exposition au soleil", "Balcon", "Place de stationnement", "Cuisine entièrement équipée", "À quelques minutes à pied de la plage de Rocha", "Restaurants, commerces et animations à proximité"],
    },
    gallery: { eyebrow: "Galerie", title: "L'appartement en détail" },
    pricing: {
      eyebrow: "Disponibilité et tarifs",
      title: "Location exclusive à la semaine",
      availability: "Disponible en juillet, août, septembre et octobre.",
      checkIn: "Arrivée : samedi, à partir de 16 h",
      checkOut: "Départ : samedi, avant 11 h",
      periodLabel: "Période",
      priceLabel: "Prix / semaine",
      rows: [
        { period: "Première quinzaine de juin", price: "700 €" },
        { period: "Deuxième quinzaine de juin", price: "750 €" },
        { period: "Première quinzaine de juillet", price: "850 €" },
        { period: "Deuxième quinzaine de juillet", price: "900 €" },
        { period: "Août (haute saison)", price: "1 200 €" },
        { period: "Première quinzaine de septembre", price: "900 €" },
        { period: "Deuxième quinzaine de septembre", price: "650 €" },
        { period: "Octobre", price: "600 €" },
      ],
      note: "Tarifs à la semaine. Pour connaître les disponibilités, les tarifs actualisés ou effectuer une réservation, veuillez nous contacter directement.",
    },
    form: {
      eyebrow: "Contact",
      title: "Réservez votre semaine à Praia da Rocha",
      subtitle: "Envoyez-nous votre message — vous recevrez une réponse dans les prochaines heures.",
      submit: "Vérifier les disponibilités",
      success: "Bien reçu. Rui Da Cruz vous contactera prochainement.",
      sending: "Envoi…",
      error: "L'envoi a échoué. Veuillez réessayer ou nous contacter via WhatsApp.",
    },
    whatsappMessage: "Bonjour Rui, je suis intéressé par l'appartement T1 à Praia da Rocha (location à la semaine). J'aimerais connaître les disponibilités.",
  },
  it: {
    meta: {
      title: "Appartamento con 1 camera da letto a Praia da Rocha | Affitto per le vacanze — Rui Da Cruz",
      description: "Appartamento con una camera da letto in affitto settimanale, Edificio Alto da Foz, Praia da Rocha, Portimão. Piscina, balcone e a pochi minuti dalla spiaggia.",
    },
    breadcrumb: "Appartamento · Praia da Rocha, Portimão",
    nav: { sobre: "Chi sono", contacto: "Contatti" },
    hero: { eyebrow: "Affitti per le vacanze", location: "Praia da Rocha, Portimão" },
    identification: {
      tags: ["Appartamento con una camera da letto", "Edificio Alto da Foz", "Piscina"],
      address: "Estrada da Rocha — Edificio Alto da Foz, São Francisco 18, 3° piano A35, 8500-804 Portimão",
      specs: [
        { label: "Tipologia", value: "1 camera" },
        { label: "Area riservata", value: "63 m²" },
        { label: "Capacità", value: "Fino a 4 persone" },
      ],
    },
    narrative: {
      eyebrow: "L'appartamento",
      paragraphs: [
        "Situato nell'edificio Alto da Foz, a Praia da Rocha, questo monolocale di 63 m² è stato progettato per garantire una vacanza confortevole, a pochi minuti a piedi dalla spiaggia, dai ristoranti e dai negozi della zona.",
        "L'appartamento gode di un'ottima esposizione al sole, dispone di balcone, cucina completamente attrezzata e posto auto privato — spazio sufficiente per una coppia o una famiglia composta da un massimo di quattro persone.",
      ],
    },
    amenities: {
      eyebrow: "Servizi",
      items: ["Spazioso monolocale · 63 m² di superficie privata", "Piscina", "Ottima esposizione al sole", "Balcone", "Posto auto", "Cucina completamente attrezzata", "A pochi minuti a piedi dalla spiaggia di Rocha", "Ristoranti, negozi e intrattenimento nelle vicinanze"],
    },
    gallery: { eyebrow: "Galleria", title: "L'appartamento in dettaglio" },
    pricing: {
      eyebrow: "Disponibilità e prezzi",
      title: "Affitto esclusivo a settimana",
      availability: "Disponibile nei mesi di luglio, agosto, settembre e ottobre.",
      checkIn: "Check-in: sabato, a partire dalle ore 16:00",
      checkOut: "Check-out: sabato, entro le ore 11:00",
      periodLabel: "Periodo",
      priceLabel: "Prezzo / settimana",
      rows: [
        { period: "Prima metà di giugno", price: "700 €" },
        { period: "Seconda metà di giugno", price: "750 €" },
        { period: "Prima metà di luglio", price: "850 €" },
        { period: "Seconda metà di luglio", price: "900 €" },
        { period: "Agosto (alta stagione)", price: "1.200 €" },
        { period: "Prima metà di settembre", price: "900 €" },
        { period: "Seconda metà di settembre", price: "650 €" },
        { period: "Ottobre", price: "600 €" },
      ],
      note: "Prezzi settimanali. Per informazioni sulla disponibilità, sui prezzi aggiornati o per effettuare una prenotazione, contattateci direttamente.",
    },
    form: {
      eyebrow: "Contatti",
      title: "Prenota la tua settimana a Praia da Rocha",
      subtitle: "Invia il tuo messaggio: ti risponderemo entro poche ore.",
      submit: "Verifica disponibilità",
      success: "Ricevuto. Rui Da Cruz ti contatterà a breve.",
      sending: "Invio…",
      error: "Non è stato possibile inviare il messaggio. Riprova oppure contattaci tramite WhatsApp.",
    },
    whatsappMessage: "Ciao Rui, sono interessato all'appartamento T1 a Praia da Rocha (affitto settimanale). Vorrei sapere se è disponibile.",
  },
  de: {
    meta: {
      title: "1-Zimmer-Wohnung in Praia da Rocha | Ferienvermietung — Rui Da Cruz",
      description: "1-Zimmer-Wohnung zur wöchentlichen Vermietung, Gebäude „Alto da Foz“, Praia da Rocha, Portimão. Swimmingpool, Balkon und nur wenige Minuten vom Strand entfernt.",
    },
    breadcrumb: "Wohnung · Praia da Rocha, Portimão",
    nav: { sobre: "Über", contacto: "Kontakt" },
    hero: { eyebrow: "Ferienvermietung", location: "Praia da Rocha, Portimão" },
    identification: {
      tags: ["1-Zimmer-Wohnung", "Gebäude „Alto da Foz“", "Schwimmbad"],
      address: "Estrada da Rocha – Gebäude „Alto da Foz“, São Francisco 18, 3. Stock, A35, 8500-804 Portimão",
      specs: [
        { label: "Typologie", value: "1 Zimmer" },
        { label: "Privater Bereich", value: "63 m²" },
        { label: "Kapazität", value: "Bis zu 4 Personen" },
      ],
    },
    narrative: {
      eyebrow: "Die Wohnung",
      paragraphs: [
        "Diese 63 m² große Einzimmerwohnung befindet sich im Gebäude „Alto da Foz“ in Praia da Rocha und wurde für einen komfortablen Urlaub konzipiert. Sie liegt nur wenige Gehminuten vom Strand, von Restaurants und den örtlichen Geschäften entfernt.",
        "Die Wohnung verfügt über eine gute Sonneneinstrahlung, einen Balkon, eine voll ausgestattete Küche und einen eigenen Parkplatz – ausreichend Platz für ein Paar oder eine Familie mit bis zu vier Personen.",
      ],
    },
    amenities: {
      eyebrow: "Ausstattung",
      items: ["Geräumiges 1-Zimmer-Apartment · 63 m² Wohnfläche", "Schwimmbad", "Hervorragende Sonneneinstrahlung", "Balkon", "Parkplatz", "Voll ausgestattete Küche", "Nur wenige Gehminuten vom Strand Praia da Rocha entfernt", "Restaurants, Geschäfte und Unterhaltungsangebote in der Nähe"],
    },
    gallery: { eyebrow: "Galerie", title: "Die Wohnung im Detail" },
    pricing: {
      eyebrow: "Verfügbarkeit und Preise",
      title: "Exklusive Vermietung pro Woche",
      availability: "Verfügbar im Juli, August, September und Oktober.",
      checkIn: "Check-in: Samstag, ab 16 Uhr",
      checkOut: "Abreise: Samstag, bis 11 Uhr",
      periodLabel: "Zeitraum",
      priceLabel: "Preis / Woche",
      rows: [
        { period: "erste Junihälfte", price: "700 €" },
        { period: "zweite Junihälfte", price: "750 €" },
        { period: "erste Julihälfte", price: "850 €" },
        { period: "zweite Julihälfte", price: "900 €" },
        { period: "August (Hochsaison)", price: "1.200 €" },
        { period: "erste Septemberhälfte", price: "900 €" },
        { period: "zweite Septemberhälfte", price: "650 €" },
        { period: "Oktober", price: "600 €" },
      ],
      note: "Preise pro Woche. Für Informationen zur Verfügbarkeit, aktuelle Preise oder Buchungen wenden Sie sich bitte direkt an uns.",
    },
    form: {
      eyebrow: "Kontakt",
      title: "Buchen Sie Ihre Woche am Praia da Rocha",
      subtitle: "Senden Sie uns Ihre Nachricht – Sie erhalten innerhalb weniger Stunden eine Antwort.",
      submit: "Verfügbarkeit anfragen",
      success: "Verstanden. Rui Da Cruz wird sich in Kürze bei Ihnen melden.",
      sending: "Wird gesendet…",
      error: "Das Senden ist nicht gelungen. Bitte versuchen Sie es erneut oder kontaktieren Sie uns über WhatsApp.",
    },
    whatsappMessage: "Hallo Rui, ich interessiere mich für die 1-Zimmer-Wohnung in Praia da Rocha (Wochenvermietung). Ich würde gerne wissen, ob sie verfügbar ist.",
  },
};
