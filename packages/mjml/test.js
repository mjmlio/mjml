var mjml = require('./lib/index')

console.log(mjml.mjml2html(`
<mjml>
  <mj-head>
    <mj-attributes>
      <mj-text padding="0" color="#EEE" font-family="helvetica" />
      <mj-class name="bg-blue" background-color="#669cf6" />
    </mj-attributes>
  </mj-head>
  <mj-body>
    <mj-container mj-class="bg-blue">
      <mj-section>
        <mj-navbar>
          <mj-column>
            <mj-inline-links base-url="https://mjml.io" hamburger="hamburger">
              <mj-link href="/getting-started-onboard">Getting started</mj-link>
              <mj-link href="/try-it-live">Try it live</mj-link>
              <mj-link href="/documentation">Documentation</mj-link>
            </mj-inline-links>
          </mj-column>
        </mj-navbar>
      </mj-section>

      <mj-section full-width="full-width">
        <mj-column>
          <mj-text text-decoration="underline" font-size="30px">Underwater</mj-text>
        </mj-column>
      </mj-section>

      <mj-section>
        <mj-column>
          <mj-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sit amet ipsum consequat, viverra libero in, vulputate nulla. Vivamus sit amet sapien non metus viverra ornare ut rutrum ligula. Etiam a odio ac ex pharetra gravida. Aenean sodales purus quis malesuada suscipit. Aenean ac euismod ligula, ac scelerisque nulla. Fusce lacinia libero sed velit sagittis, hendrerit posuere nisl blandit. Quisque mauris justo, mollis id malesuada a, euismod non neque. Sed finibus, leo nec rhoncus ultrices, odio metus imperdiet magna, id pulvinar ex ex ullamcorper ipsum.</mj-text>
        </mj-column>
        <mj-column>
          <mj-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sit amet ipsum consequat, viverra libero in, vulputate nulla. Vivamus sit amet sapien non metus viverra ornare ut rutrum ligula. Etiam a odio ac ex pharetra gravida. Aenean sodales purus quis malesuada suscipit. Aenean ac euismod ligula, ac scelerisque nulla. Fusce lacinia libero sed velit sagittis, hendrerit posuere nisl blandit. Quisque mauris justo, mollis id malesuada a, euismod non neque. Sed finibus, leo nec rhoncus ultrices, odio metus imperdiet magna, id pulvinar ex ex ullamcorper ipsum</mj-text>
        </mj-column>
      </mj-section>

      <mj-section>
        <mj-column>
          <mj-button background-color="#0C8094">Discover now</mj-button>
        </mj-column>
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>
`, { beautify: true }))
