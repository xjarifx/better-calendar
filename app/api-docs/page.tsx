export default function ApiDocsPage() {
  return (
    <div className="min-h-screen">
      <div id="swagger-ui"></div>
      <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.onload = function() {
              SwaggerUIBundle({
                url: '/swagger.json',
                dom_id: '#swagger-ui',
                presets: [
                  SwaggerUIBundle.presets.apis,
                  SwaggerUIStandalonePreset
                ],
              });
            }
          `,
        }}
      />
    </div>
  )
}
