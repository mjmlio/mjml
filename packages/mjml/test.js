var mjml = require('./lib/index')

console.log(mjml.mjml2html(`
  <mjml>
    <mj-body>
      <mj-container>
        <mj-section>
          <mj-column>
            <mj-image src="https://pbs.twimg.com/profile_images/378800000822867536/3f5a00acf72df93528b6bb7cd0a4fd0c.jpeg" />
            <mj-image src="https://pbs.twimg.com/profile_images/378800000822867536/3f5a00acf72df93528b6bb7cd0a4fd0c.jpeg" />
            <mj-image src="https://pbs.twimg.com/profile_images/378800000822867536/3f5a00acf72df93528b6bb7cd0a4fd0c.jpeg"></mj-image>
          </mj-column>
        </mj-section>
      </mj-container>
    </mj-body>
  </mjml>`, { beautify: true }))
