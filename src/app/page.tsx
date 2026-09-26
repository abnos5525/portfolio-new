const destination = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/fa/`

export default function RootPage() {
  return (
    <main>
      <meta httpEquiv="refresh" content={`0; url=${destination}`} />
      <p>
        <a href={destination}>حسین حیدری</a>
      </p>
      <script
        dangerouslySetInnerHTML={{
          __html: `location.replace(${JSON.stringify(destination)})`,
        }}
      />
    </main>
  )
}
