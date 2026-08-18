const BASE_URL = "https://ruidacruzconsultor.com";

export type Crumb = { name: string; path: string };

// BreadcrumbList — path já deve vir com o prefixo de locale certo (ver
// localizedPath em app/sitemap.ts pra mesma regra); "" representa a Home.
export function BreadcrumbSchema({ items }: { items: Crumb[] }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.path}`,
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}
