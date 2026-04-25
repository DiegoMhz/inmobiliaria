interface SeoProps {
  title: string
  description?: string
  image?: string
}

const SITE_NAME = 'Yusve Inmobiliaria'

export function Seo({ title, description, image }: SeoProps) {
  const fullTitle = `${title} | ${SITE_NAME}`

  return (
    <>
      <title>{fullTitle}</title>
      <meta property="og:title" content={fullTitle} />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="description" content={description} />}
      {description && <meta property="og:description" content={description} />}
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      {image && <meta name="twitter:image" content={image} />}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
    </>
  )
}
