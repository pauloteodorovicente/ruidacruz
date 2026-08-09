import { BUSINESS_INFO } from "@/lib/business-info";

// Schema.org Organization, site inteiro — RealEstateAgent existe já dentro
// de cada RealEstateListing por imóvel, mas nada descrevia a empresa em si
// até agora. Sem logo de propósito (ainda não existe um, ver pendência de
// asset) — melhor omitir o campo do que apontar pra uma imagem que não é
// logo de verdade.
export function OrganizationSchema() {
  const json = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: BUSINESS_INFO.name,
    url: BUSINESS_INFO.url,
    telephone: BUSINESS_INFO.phone,
    sameAs: [BUSINESS_INFO.instagramUrl],
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS_INFO.streetAddress,
      postalCode: BUSINESS_INFO.postalCode,
      addressLocality: BUSINESS_INFO.addressLocality,
      addressRegion: BUSINESS_INFO.addressRegion,
      addressCountry: BUSINESS_INFO.addressCountry,
    },
    memberOf: {
      "@type": "Organization",
      name: BUSINESS_INFO.brand,
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}
