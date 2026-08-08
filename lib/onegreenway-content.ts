export type Locale = "pt-PT" | "pt-BR" | "en" | "es" | "fr" | "it" | "de";

export const galleryPhotos = ["gallery-1.jpg", "gallery-2.jpg", "gallery-3.jpg", "hero-3.jpg"];

// Landing bespoke pro empreendimento One Green Way (Quinta do Lago), onde o
// Rui vende frações — mesmo padrão arquitetural das outras landings
// (Verdelago/Portimão): content.ts com os 7 locais + language-context
// próprio. Conteúdo/fotos vêm do site oficial do empreendimento
// (onegreenway.grupovantagem.com); tabela de preços por unidade não é
// reproduzida aqui (muda com frequência) — a brochura e a tabela de preços
// oficiais ficam disponíveis pra download.
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
    typologies: {
      eyebrow: string;
      title: string;
      intro: string;
      fromLabel: string;
      groups: { name: string; description: string; from: string }[];
      note: string;
    };
    brochure: {
      eyebrow: string;
      text: string;
      brochureLabel: string;
      priceListLabel: string;
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
    "meta": {
      "title": "One Green Way | Quinta do Lago — Rui Da Cruz",
      "description": "One Green Way, Quinta do Lago — 89 residências de luxo junto ao North Course. Moradias e apartamentos representados por Rui Da Cruz."
    },
    "breadcrumb": "Empreendimento · Quinta do Lago",
    "nav": {
      "sobre": "Sobre",
      "contacto": "Contacto"
    },
    "hero": {
      "eyebrow": "Empreendimento Residencial",
      "location": "Quinta do Lago, Algarve"
    },
    "identification": {
      "tags": [
        "Moradias V4-V6",
        "Apartamentos T3-T5",
        "Quinta do Lago"
      ],
      "address": "Quinta do Lago, Almancil, 8135-024 Loulé",
      "specs": [
        {
          "label": "Residências",
          "value": "89 no total"
        },
        {
          "label": "Tipologias",
          "value": "V4 a V6 · T3 a T5"
        },
        {
          "label": "Localização",
          "value": "Junto ao North Course"
        }
      ]
    },
    "narrative": {
      "eyebrow": "Sobre o Empreendimento",
      "paragraphs": [
        "No coração da Quinta do Lago está o One Green Way, um empreendimento residencial fechado que redefine o significado de qualidade de vida, conforto e sofisticação. Situado junto ao prestigiado North Course e rodeado pela beleza natural do Parque Natural da Ria Formosa, combina arquitetura contemporânea, paisagismo premiado e um estilo de vida incomparável.",
        "Composto por apenas 89 residências de luxo — entre moradias de acesso privado e apartamentos —, o One Green Way oferece espaços amplos, acabamentos premium e tecnologia de ponta. Cada residência foi pensada para ligar o interior ao exterior, maximizando luz natural, privacidade e vista sobre o campo de golfe, os lagos e a paisagem envolvente."
      ]
    },
    "amenities": {
      "eyebrow": "Comodidades",
      "items": [
        "Piscinas aquecidas, cozinhas exteriores e terraços com vista",
        "Jardim ou terraço maduro desenhado pela Cracknell, paisagistas internacionais",
        "Cozinhas de autor, escritórios em casa, salas de cinema e ginásio",
        "Concierge personalizado e clubhouse exclusivo",
        "Spa e centro de fitness de alto rendimento",
        "Piscina comum, rooftop lounge panorâmico e business centre",
        "Estúdio de golfe Trackman",
        "Segurança 24 horas e gestão total da propriedade",
        "Design de interiores por Vilaça Interiores"
      ]
    },
    "gallery": {
      "eyebrow": "Galeria",
      "title": "One Green Way"
    },
    "typologies": {
      "eyebrow": "Tipologias",
      "title": "Moradias e Apartamentos Disponíveis",
      "intro": "Duas coleções de residências, cada uma com a sua própria relação com o campo de golfe, os lagos e os jardins.",
      "fromLabel": "Desde",
      "groups": [
        {
          "name": "Horizon Residences — Moradias",
          "description": "Moradias V4, V5 e V6 de acesso privado, com garagem dupla e vista sobre o campo de golfe ou o lago.",
          "from": "8.350.000 €"
        },
        {
          "name": "Garden & Panorama Residences — Apartamentos",
          "description": "Apartamentos T3, T4 e T5 em piso térreo ou 1.º andar, com terraço ou jardim privativo.",
          "from": "4.200.000 €"
        }
      ],
      "note": "Valores de referência para as unidades atualmente disponíveis — consulte a tabela de preços atualizada ou fale connosco para confirmação em tempo real."
    },
    "brochure": {
      "eyebrow": "Documentação",
      "text": "Descarregue a brochura e a tabela de preços completa do One Green Way.",
      "brochureLabel": "Brochura",
      "priceListLabel": "Tabela de Preços"
    },
    "form": {
      "eyebrow": "Contacto",
      "title": "Interessado no One Green Way?",
      "subtitle": "Fale diretamente com o Rui — resposta em poucas horas.",
      "submit": "Solicitar Informação",
      "success": "Mensagem enviada. O Rui entra em contacto brevemente.",
      "sending": "A enviar...",
      "error": "Não foi possível enviar. Tente novamente ou contacte via WhatsApp."
    },
    "whatsappMessage": "Olá Rui, tenho interesse no One Green Way (Quinta do Lago). Gostaria de mais informações."
  },
  "pt-BR": {
    "meta": {
      "title": "One Green Way | Quinta do Lago — Rui Da Cruz",
      "description": "One Green Way, Quinta do Lago — 89 residências de luxo junto ao North Course. Moradias e apartamentos representados por Rui Da Cruz."
    },
    "breadcrumb": "Empreendimento · Quinta do Lago",
    "nav": {
      "sobre": "Sobre",
      "contacto": "Contacto"
    },
    "hero": {
      "eyebrow": "Empreendimento Residencial",
      "location": "Quinta do Lago, Algarve"
    },
    "identification": {
      "tags": [
        "Moradias V4-V6",
        "Apartamentos T3-T5",
        "Quinta do Lago"
      ],
      "address": "Quinta do Lago, Almancil, 8135-024 Loulé",
      "specs": [
        {
          "label": "Residências",
          "value": "89 no total"
        },
        {
          "label": "Tipologias",
          "value": "V4 a V6 · T3 a T5"
        },
        {
          "label": "Localização",
          "value": "Junto ao North Course"
        }
      ]
    },
    "narrative": {
      "eyebrow": "Sobre o Empreendimento",
      "paragraphs": [
        "No coração da Quinta do Lago está o One Green Way, um empreendimento residencial fechado que redefine o significado de qualidade de vida, conforto e sofisticação. Situado junto ao prestigiado North Course e rodeado pela beleza natural do Parque Natural da Ria Formosa, combina arquitetura contemporânea, paisagismo premiado e um estilo de vida incomparável.",
        "Composto por apenas 89 residências de luxo — entre moradias de acesso privado e apartamentos —, o One Green Way oferece espaços amplos, acabamentos premium e tecnologia de ponta. Cada residência foi pensada para ligar o interior ao exterior, maximizando luz natural, privacidade e vista sobre o campo de golfe, os lagos e a paisagem envolvente."
      ]
    },
    "amenities": {
      "eyebrow": "Comodidades",
      "items": [
        "Piscinas aquecidas, cozinhas exteriores e terraços com vista",
        "Jardim ou terraço maduro desenhado pela Cracknell, paisagistas internacionais",
        "Cozinhas de autor, escritórios em casa, salas de cinema e ginásio",
        "Concierge personalizado e clubhouse exclusivo",
        "Spa e centro de fitness de alto rendimento",
        "Piscina comum, rooftop lounge panorâmico e business centre",
        "Estúdio de golfe Trackman",
        "Segurança 24 horas e gestão total da propriedade",
        "Design de interiores por Vilaça Interiores"
      ]
    },
    "gallery": {
      "eyebrow": "Galeria",
      "title": "One Green Way"
    },
    "typologies": {
      "eyebrow": "Tipologias",
      "title": "Moradias e Apartamentos Disponíveis",
      "intro": "Duas coleções de residências, cada uma com a sua própria relação com o campo de golfe, os lagos e os jardins.",
      "fromLabel": "Desde",
      "groups": [
        {
          "name": "Horizon Residences — Moradias",
          "description": "Moradias V4, V5 e V6 de acesso privado, com garagem dupla e vista sobre o campo de golfe ou o lago.",
          "from": "8.350.000 €"
        },
        {
          "name": "Garden & Panorama Residences — Apartamentos",
          "description": "Apartamentos T3, T4 e T5 em piso térreo ou 1.º andar, com terraço ou jardim privativo.",
          "from": "4.200.000 €"
        }
      ],
      "note": "Valores de referência para as unidades atualmente disponíveis — consulte a tabela de preços atualizada ou fale connosco para confirmação em tempo real."
    },
    "brochure": {
      "eyebrow": "Documentação",
      "text": "Descarregue a brochura e a tabela de preços completa do One Green Way.",
      "brochureLabel": "Brochura",
      "priceListLabel": "Tabela de Preços"
    },
    "form": {
      "eyebrow": "Contacto",
      "title": "Interessado no One Green Way?",
      "subtitle": "Fale diretamente com o Rui — resposta em poucas horas.",
      "submit": "Solicitar Informação",
      "success": "Mensagem enviada. O Rui entra em contacto brevemente.",
      "sending": "A enviar...",
      "error": "Não foi possível enviar. Tente novamente ou contacte via WhatsApp."
    },
    "whatsappMessage": "Olá Rui, tenho interesse no One Green Way (Quinta do Lago). Gostaria de mais informações."
  },
  "en": {
    "meta": {
      "title": "One Green Way | Quinta do Lago — Rui Da Cruz",
      "description": "One Green Way, Quinta do Lago — 89 luxury residences next to the North Course. Villas and apartments represented by Rui Da Cruz."
    },
    "breadcrumb": "Development · Quinta do Lago",
    "nav": {
      "sobre": "About",
      "contacto": "Contact"
    },
    "hero": {
      "eyebrow": "Residential Development",
      "location": "Quinta do Lago, Algarve"
    },
    "identification": {
      "tags": [
        "4- to 6-Bedroom Homes",
        "3- to 5-Bedroom Apartments",
        "Quinta do Lago"
      ],
      "address": "Quinta do Lago, Almancil, 8135-024 Loulé",
      "specs": [
        {
          "label": "Residences",
          "value": "89 in total"
        },
        {
          "label": "Types",
          "value": "V4 to V6 · T3 to T5"
        },
        {
          "label": "Location",
          "value": "Next to the North Course"
        }
      ]
    },
    "narrative": {
      "eyebrow": "About the Project",
      "paragraphs": [
        "At the heart of Quinta do Lago lies One Green Way, a gated residential community that redefines the meaning of quality of life, comfort, and sophistication. Located next to the prestigious North Course and surrounded by the natural beauty of the Ria Formosa Natural Park, it combines contemporary architecture, award-winning landscaping, and an unparalleled lifestyle.",
        "Comprising just 89 luxury residences—including private-access homes and apartments—One Green Way offers spacious layouts, premium finishes, and state-of-the-art technology. Each residence has been designed to connect the interior with the exterior, maximizing natural light, privacy, and views of the golf course, the lakes, and the surrounding landscape."
      ]
    },
    "amenities": {
      "eyebrow": "Amenities",
      "items": [
        "Heated pools, outdoor kitchens, and terraces with a view",
        "A mature garden or terrace designed by Cracknell, an international landscaping firm",
        "Designer kitchens, home offices, home theaters, and home gyms",
        "Personalized concierge service and exclusive clubhouse",
        "High-Performance Spa and Fitness Center",
        "Communal pool, rooftop lounge with panoramic views, and business center",
        "Trackman Golf Studio",
        "24-hour security and full property management",
        "Interior design by Vilaça Interiores"
      ]
    },
    "gallery": {
      "eyebrow": "Gallery",
      "title": "One Green Way"
    },
    "typologies": {
      "eyebrow": "Types",
      "title": "Available Houses and Apartments",
      "intro": "Two collections of homes, each with its own connection to the golf course, the lakes, and the gardens.",
      "fromLabel": "From",
      "groups": [
        {
          "name": "Horizon Residences — Townhouses",
          "description": "Four-, five-, and six-bedroom homes with private access, a double garage, and views of the golf course or the lake.",
          "from": "€8,350,000"
        },
        {
          "name": "Garden & Panorama Residences — Apartments",
          "description": "3-, 4-, and 5-bedroom apartments on the ground floor or first floor, with a terrace or private garden.",
          "from": "€4,200,000"
        }
      ],
      "note": "Reference prices for currently available units—please see the updated price list or contact us for real-time confirmation."
    },
    "brochure": {
      "eyebrow": "Documentation",
      "text": "Download the brochure and the complete price list for One Green Way.",
      "brochureLabel": "Brochure",
      "priceListLabel": "Price List"
    },
    "form": {
      "eyebrow": "Contact",
      "title": "Interested in One Green Way?",
      "subtitle": "Contact Rui directly—you'll get a response within a few hours.",
      "submit": "Request Information",
      "success": "Message sent. Rui will be in touch shortly.",
      "sending": "Sending...",
      "error": "The message could not be sent. Please try again or contact us via WhatsApp."
    },
    "whatsappMessage": "Hi Rui, I'm interested in One Green Way (Quinta do Lago). I'd like more information."
  },
  "es": {
    "meta": {
      "title": "One Green Way | Quinta do Lago — Rui Da Cruz",
      "description": "One Green Way, Quinta do Lago — 89 viviendas de lujo junto al North Course. Viviendas unifamiliares y apartamentos representados por Rui Da Cruz."
    },
    "breadcrumb": "Complejo inmobiliario · Quinta do Lago",
    "nav": {
      "sobre": "Acerca de",
      "contacto": "Contacto"
    },
    "hero": {
      "eyebrow": "Complejo residencial",
      "location": "Quinta do Lago, Algarve"
    },
    "identification": {
      "tags": [
        "Viviendas de 4 a 6 habitaciones",
        "Apartamentos de 3 a 5 habitaciones",
        "Quinta do Lago"
      ],
      "address": "Quinta do Lago, Almancil, 8135-024 Loulé",
      "specs": [
        {
          "label": "Residencias",
          "value": "89 en total"
        },
        {
          "label": "Tipologías",
          "value": "V4 a V6 · T3 a T5"
        },
        {
          "label": "Ubicación",
          "value": "Junto al North Course"
        }
      ]
    },
    "narrative": {
      "eyebrow": "Acerca del proyecto",
      "paragraphs": [
        "En el corazón de Quinta do Lago se encuentra One Green Way, una urbanización cerrada que redefine el concepto de calidad de vida, comodidad y sofisticación. Situado junto al prestigioso North Course y rodeado por la belleza natural del Parque Natural de la Ria Formosa, combina una arquitectura contemporánea, un paisajismo galardonado y un estilo de vida incomparable.",
        "Compuesto por tan solo 89 viviendas de lujo —entre chalés con acceso privado y apartamentos—, One Green Way ofrece amplios espacios, acabados de primera calidad y tecnología de vanguardia. Cada vivienda se ha diseñado para conectar el interior con el exterior, aprovechando al máximo la luz natural, la privacidad y las vistas al campo de golf, los lagos y el paisaje circundante."
      ]
    },
    "amenities": {
      "eyebrow": "Servicios",
      "items": [
        "Piscinas climatizadas, cocinas al aire libre y terrazas con vistas",
        "Jardín o terraza madura diseñada por Cracknell, paisajistas internacionales",
        "Cocinas de diseño, oficinas en casa, salas de cine y gimnasio",
        "Servicio de conserjería personalizado y club social exclusivo",
        "Spa y centro de fitness de alto rendimiento",
        "Piscina comunitaria, salón panorámico en la azotea y centro de negocios",
        "Estudio de golf Trackman",
        "Seguridad las 24 horas y gestión integral de la propiedad",
        "Diseño de interiores a cargo de Vilaça Interiores"
      ]
    },
    "gallery": {
      "eyebrow": "Galería",
      "title": "One Green Way"
    },
    "typologies": {
      "eyebrow": "Tipologías",
      "title": "Viviendas y apartamentos disponibles",
      "intro": "Dos colecciones de viviendas, cada una con su propia relación con el campo de golf, los lagos y los jardines.",
      "fromLabel": "Desde",
      "groups": [
        {
          "name": "Horizon Residences — Viviendas unifamiliares",
          "description": "Viviendas de 4, 5 y 6 habitaciones con acceso privado, garaje doble y vistas al campo de golf o al lago.",
          "from": "8 350 000 €"
        },
        {
          "name": "Garden & Panorama Residences — Apartamentos",
          "description": "Apartamentos de 3, 4 y 5 habitaciones en planta baja o primera planta, con terraza o jardín privado.",
          "from": "4 200 000 €"
        }
      ],
      "note": "Precios orientativos para las unidades disponibles actualmente: consulta la tabla de precios actualizada o ponte en contacto con nosotros para obtener una confirmación en tiempo real."
    },
    "brochure": {
      "eyebrow": "Documentación",
      "text": "Descarga el folleto y la lista completa de precios de One Green Way.",
      "brochureLabel": "Folleto",
      "priceListLabel": "Lista de precios"
    },
    "form": {
      "eyebrow": "Contacto",
      "title": "¿Te interesa One Green Way?",
      "subtitle": "Habla directamente con Rui: te responderá en unas horas.",
      "submit": "Solicitar información",
      "success": "Mensaje enviado. Rui se pondrá en contacto contigo en breve.",
      "sending": "Enviando...",
      "error": "No se ha podido enviar. Inténtalo de nuevo o ponte en contacto con nosotros a través de WhatsApp."
    },
    "whatsappMessage": "Hola, Rui, estoy interesado en One Green Way (Quinta do Lago). Me gustaría recibir más información."
  },
  "fr": {
    "meta": {
      "title": "One Green Way | Quinta do Lago — Rui Da Cruz",
      "description": "One Green Way, Quinta do Lago — 89 résidences de luxe situées à proximité du North Course. Villas et appartements proposés par Rui Da Cruz."
    },
    "breadcrumb": "Complexe immobilier · Quinta do Lago",
    "nav": {
      "sobre": "À propos",
      "contacto": "Contact"
    },
    "hero": {
      "eyebrow": "Programme immobilier résidentiel",
      "location": "Quinta do Lago, Algarve"
    },
    "identification": {
      "tags": [
        "Maisons de 4 à 6 pièces",
        "Appartements T3-T5",
        "Quinta do Lago"
      ],
      "address": "Quinta do Lago, Almancil, 8135-024 Loulé",
      "specs": [
        {
          "label": "Résidences",
          "value": "89 au total"
        },
        {
          "label": "Typologies",
          "value": "V4 à V6 · T3 à T5"
        },
        {
          "label": "Localisation",
          "value": "À côté du North Course"
        }
      ]
    },
    "narrative": {
      "eyebrow": "À propos du projet",
      "paragraphs": [
        "Au cœur de Quinta do Lago se trouve One Green Way, un complexe résidentiel fermé qui redéfinit les notions de qualité de vie, de confort et de raffinement. Situé à proximité du prestigieux North Course et entouré par la beauté naturelle du parc naturel de la Ria Formosa, il allie une architecture contemporaine, un aménagement paysager primé et un art de vivre incomparable.",
        "Composé de seulement 89 logements de luxe — entre villas à accès privé et appartements —, le One Green Way offre des espaces généreux, des finitions haut de gamme et une technologie de pointe. Chaque logement a été conçu pour créer un lien entre l'intérieur et l'extérieur, en optimisant la lumière naturelle, l'intimité et la vue sur le parcours de golf, les lacs et le paysage environnant."
      ]
    },
    "amenities": {
      "eyebrow": "Équipements",
      "items": [
        "Piscines chauffées, cuisines extérieures et terrasses avec vue",
        "Jardin ou terrasse « mature » conçu par Cracknell, agence internationale d'architecture paysagère",
        "Cuisines design, bureaux à domicile, salles de cinéma et salles de sport",
        "Service de conciergerie personnalisé et club-house exclusif",
        "Spa et centre de remise en forme haut de gamme",
        "Piscine commune, salon panoramique sur le toit et centre d'affaires",
        "Studio de golf Trackman",
        "Sécurité 24 heures sur 24 et gestion complète de la propriété",
        "Aménagement intérieur par Vilaça Interiores"
      ]
    },
    "gallery": {
      "eyebrow": "Galerie",
      "title": "One Green Way"
    },
    "typologies": {
      "eyebrow": "Typologies",
      "title": "Maisons et appartements disponibles",
      "intro": "Deux ensembles résidentiels, chacun entretenant un rapport qui lui est propre avec le terrain de golf, les lacs et les jardins.",
      "fromLabel": "À partir de",
      "groups": [
        {
          "name": "Horizon Residences — Maisons individuelles",
          "description": "Maisons de 4, 5 et 6 pièces avec accès privé, garage double et vue sur le terrain de golf ou le lac.",
          "from": "8 350 000 €"
        },
        {
          "name": "Garden & Panorama Residences — Appartements",
          "description": "Appartements T3, T4 et T5 situés au rez-de-chaussée ou au 1er étage, avec terrasse ou jardin privé.",
          "from": "4 200 000 €"
        }
      ],
      "note": "Prix indicatifs pour les unités actuellement disponibles — consultez la grille tarifaire mise à jour ou contactez-nous pour obtenir une confirmation en temps réel."
    },
    "brochure": {
      "eyebrow": "Documentation",
      "text": "Téléchargez la brochure et la liste complète des tarifs de One Green Way.",
      "brochureLabel": "Brochure",
      "priceListLabel": "Barème des prix"
    },
    "form": {
      "eyebrow": "Contact",
      "title": "Le programme One Green Way vous intéresse ?",
      "subtitle": "Contactez directement Rui — vous recevrez une réponse en quelques heures.",
      "submit": "Demander des informations",
      "success": "Message envoyé. Rui vous contactera sous peu.",
      "sending": "Envoi en cours...",
      "error": "L'envoi a échoué. Veuillez réessayer ou nous contacter via WhatsApp."
    },
    "whatsappMessage": "Bonjour Rui, je suis intéressé par le projet One Green Way (Quinta do Lago). J'aimerais avoir plus d'informations."
  },
  "it": {
    "meta": {
      "title": "One Green Way | Quinta do Lago — Rui Da Cruz",
      "description": "One Green Way, Quinta do Lago — 89 residenze di lusso nei pressi del North Course. Ville e appartamenti in vendita tramite Rui Da Cruz."
    },
    "breadcrumb": "Complesso residenziale · Quinta do Lago",
    "nav": {
      "sobre": "Informazioni su",
      "contacto": "Contatti"
    },
    "hero": {
      "eyebrow": "Complesso residenziale",
      "location": "Quinta do Lago, Algarve"
    },
    "identification": {
      "tags": [
        "Ville da 4 a 6 camere da letto",
        "Appartamenti da 3 a 5 camere da letto",
        "Quinta do Lago"
      ],
      "address": "Quinta do Lago, Almancil, 8135-024 Loulé",
      "specs": [
        {
          "label": "Residenze",
          "value": "89 in totale"
        },
        {
          "label": "Tipologie",
          "value": "Da V4 a V6 · Da T3 a T5"
        },
        {
          "label": "Ubicazione",
          "value": "Accanto al North Course"
        }
      ]
    },
    "narrative": {
      "eyebrow": "Informazioni sul progetto",
      "paragraphs": [
        "Nel cuore di Quinta do Lago sorge One Green Way, un complesso residenziale recintato che ridefinisce il significato di qualità della vita, comfort e raffinatezza. Situato accanto al prestigioso North Course e circondato dalla bellezza naturale del Parco Naturale della Ria Formosa, coniuga architettura contemporanea, paesaggistica pluripremiata e uno stile di vita senza pari.",
        "Composto da sole 89 residenze di lusso — tra ville con accesso privato e appartamenti —, One Green Way offre spazi ampi, finiture di alta qualità e tecnologia all’avanguardia. Ogni abitazione è stata progettata per collegare gli spazi interni con quelli esterni, massimizzando la luce naturale, la privacy e la vista sul campo da golf, sui laghi e sul paesaggio circostante."
      ]
    },
    "amenities": {
      "eyebrow": "Servizi",
      "items": [
        "Piscine riscaldate, cucine all’aperto e terrazze con vista",
        "Giardino o terrazzo maturo progettato da Cracknell, studio internazionale di architettura del paesaggio",
        "Cucine di design, uffici domestici, sale cinema e palestre",
        "Servizio di concierge personalizzato e clubhouse esclusiva",
        "Spa e centro fitness ad alte prestazioni",
        "Piscina comune, lounge panoramica sul tetto e centro business",
        "Studio di golf Trackman",
        "Sicurezza 24 ore su 24 e gestione completa dell'immobile",
        "Progetto di interior design a cura di Vilaça Interiores"
      ]
    },
    "gallery": {
      "eyebrow": "Galleria",
      "title": "One Green Way"
    },
    "typologies": {
      "eyebrow": "Tipologie",
      "title": "Case e appartamenti disponibili",
      "intro": "Due complessi residenziali, ciascuno con un proprio rapporto con il campo da golf, i laghi e i giardini.",
      "fromLabel": "A partire da",
      "groups": [
        {
          "name": "Horizon Residences — Villette",
          "description": "Ville con 4, 5 e 6 camere da letto, con accesso privato, doppio posto auto e vista sul campo da golf o sul lago.",
          "from": "8.350.000 €"
        },
        {
          "name": "Garden & Panorama Residences — Appartamenti",
          "description": "Appartamenti con 3, 4 e 5 camere da letto al piano terra o al primo piano, con terrazza o giardino privato.",
          "from": "4.200.000 €"
        }
      ],
      "note": "Prezzi di riferimento per le unità attualmente disponibili — consultare il listino prezzi aggiornato o contattarci per una conferma in tempo reale."
    },
    "brochure": {
      "eyebrow": "Documentazione",
      "text": "Scarica la brochure e il listino prezzi completo di One Green Way.",
      "brochureLabel": "Brochure",
      "priceListLabel": "Listino prezzi"
    },
    "form": {
      "eyebrow": "Contatti",
      "title": "Ti interessa One Green Way?",
      "subtitle": "Contatta direttamente Rui: ti risponderà nel giro di poche ore.",
      "submit": "Richiedi informazioni",
      "success": "Messaggio inviato. Rui ti contatterà a breve.",
      "sending": "Invio in corso...",
      "error": "Non è stato possibile inviare il messaggio. Riprova oppure contattaci tramite WhatsApp."
    },
    "whatsappMessage": "Ciao Rui, sono interessato al One Green Way (Quinta do Lago). Vorrei ricevere maggiori informazioni."
  },
  "de": {
    "meta": {
      "title": "One Green Way | Quinta do Lago — Rui Da Cruz",
      "description": "One Green Way, Quinta do Lago – 89 Luxuswohnungen direkt am North Course. Villen und Wohnungen, vertreten durch Rui Da Cruz."
    },
    "breadcrumb": "Bauprojekt · Quinta do Lago",
    "nav": {
      "sobre": "Über",
      "contacto": "Kontakt"
    },
    "hero": {
      "eyebrow": "Wohnbauprojekt",
      "location": "Quinta do Lago, Algarve"
    },
    "identification": {
      "tags": [
        "Einfamilienhäuser mit 4 bis 6 Zimmern",
        "3- bis 5-Zimmer-Wohnungen",
        "Quinta do Lago"
      ],
      "address": "Quinta do Lago, Almancil, 8135-024 Loulé",
      "specs": [
        {
          "label": "Wohnanlagen",
          "value": "Insgesamt 89"
        },
        {
          "label": "Typologien",
          "value": "V4 bis V6 · T3 bis T5"
        },
        {
          "label": "Standort",
          "value": "Neben dem North Course"
        }
      ]
    },
    "narrative": {
      "eyebrow": "Über das Projekt",
      "paragraphs": [
        "Im Herzen von Quinta do Lago liegt das One Green Way, eine geschlossene Wohnanlage, die den Begriff Lebensqualität, Komfort und Raffinesse neu definiert. Es liegt direkt am renommierten North Course und ist umgeben von der natürlichen Schönheit des Naturparks Ria Formosa. Hier vereinen sich zeitgenössische Architektur, preisgekrönte Landschaftsgestaltung und ein unvergleichlicher Lebensstil.",
        "Das One Green Way besteht aus nur 89 Luxuswohnungen – darunter Villen mit privatem Zugang und Apartments – und bietet großzügige Räumlichkeiten, hochwertige Ausstattungen und modernste Technologie. Jede Wohnung wurde so konzipiert, dass sie den Innen- und Außenbereich miteinander verbindet und so das natürliche Licht, die Privatsphäre sowie den Blick auf den Golfplatz, die Seen und die umliegende Landschaft optimal zur Geltung bringt."
      ]
    },
    "amenities": {
      "eyebrow": "Ausstattung",
      "items": [
        "Beheizte Schwimmbäder, Außenküchen und Terrassen mit Aussicht",
        "Von Cracknell, einem internationalen Landschaftsarchitekturbüro, entworfener, ausgereifter Garten oder eine Terrasse",
        "Designer-Küchen, Home-Offices, Heimkinos und Fitnessräume",
        "Individueller Concierge-Service und exklusives Clubhaus",
        "Spa und Hochleistungs-Fitnesscenter",
        "Gemeinschaftspool, Panorama-Lounge auf dem Dach und Businesscenter",
        "Trackman-Golfstudio",
        "24-Stunden-Sicherheitsdienst und umfassende Immobilienverwaltung",
        "Innenarchitektur von Vilaça Interiores"
      ]
    },
    "gallery": {
      "eyebrow": "Galerie",
      "title": "One Green Way"
    },
    "typologies": {
      "eyebrow": "Typologien",
      "title": "Verfügbare Häuser und Wohnungen",
      "intro": "Zwei Wohnanlagen, von denen jede ihre eigene Verbindung zum Golfplatz, zu den Seen und zu den Gärten hat.",
      "fromLabel": "Ab",
      "groups": [
        {
          "name": "Horizon Residences – Einfamilienhäuser",
          "description": "Einfamilienhäuser mit 4, 5 oder 6 Zimmern und eigener Zufahrt, mit Doppelgarage und Blick auf den Golfplatz oder den See.",
          "from": "8.350.000 €"
        },
        {
          "name": "Garden & Panorama Residences – Wohnungen",
          "description": "3-, 4- und 5-Zimmer-Wohnungen im Erdgeschoss oder im 1. Stock, mit eigener Terrasse oder eigenem Garten.",
          "from": "4.200.000 €"
        }
      ],
      "note": "Richtpreise für die derzeit verfügbaren Einheiten – bitte sehen Sie in der aktuellen Preisliste nach oder wenden Sie sich an uns, um eine Echtzeit-Bestätigung zu erhalten."
    },
    "brochure": {
      "eyebrow": "Dokumentation",
      "text": "Laden Sie die Broschüre und die vollständige Preisliste von One Green Way herunter.",
      "brochureLabel": "Broschüre",
      "priceListLabel": "Preisliste"
    },
    "form": {
      "eyebrow": "Kontakt",
      "title": "Interessieren Sie sich für One Green Way?",
      "subtitle": "Sprechen Sie direkt mit Rui – Sie erhalten innerhalb weniger Stunden eine Antwort.",
      "submit": "Informationen anfordern",
      "success": "Die Nachricht wurde gesendet. Rui wird sich in Kürze bei dir melden.",
      "sending": "Wird gesendet...",
      "error": "Das Senden ist nicht gelungen. Bitte versuchen Sie es erneut oder kontaktieren Sie uns über WhatsApp."
    },
    "whatsappMessage": "Hallo Rui, ich interessiere mich für das „One Green Way“ (Quinta do Lago). Ich hätte gerne weitere Informationen."
  },
};
