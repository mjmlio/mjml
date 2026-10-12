const { expect } = require('chai')
const mjml = require('../lib')

function outlookCells(html) {
  const comments = [
    ...html.matchAll(/<!--\[if mso \| IE\]>([\s\S]*?)<!\[endif\]-->/g),
  ]
  return comments.flatMap(([, content]) =>
    [...content.matchAll(/<td\b[^>]*style="([^"]*)"/g)].map(([, style]) => ({
      width: style.match(/(?:^|;)width:([^;]+)/)?.[1],
      padding: style.match(/(?:^|;)padding:([^;]+)/)?.[1],
    })),
  )
}

const column = (width = '50%') =>
  `<mj-column width="${width}"><mj-text>Content</mj-text></mj-column>`

async function render(groups, attributes = 'gutter="20px"') {
  const result = await mjml(`<mjml><mj-body width="600px">
    <mj-section padding="16px 24px" ${attributes}>${groups}</mj-section>
  </mj-body></mjml>`)
  expect(result.errors).to.eql([])
  return outlookCells(result.html)
}

describe('mj-group Outlook gutter cells', () => {
  for (const direction of ['ltr', 'rtl']) {
    it(`keeps column widths and puts the gutter on the inner edges (${direction})`, async () => {
      const cells = await render(
        `<mj-group direction="${direction}">${column()}${column()}</mj-group>`,
        'gutter="20px" direction="rtl"',
      )
      expect(cells.filter(({ width }) => width === '276px')).to.eql([
        {
          width: '276px',
          padding:
            direction === 'ltr' ? '0px 10px 0px 0px' : '0px 0px 0px 10px',
        },
        {
          width: '276px',
          padding:
            direction === 'ltr' ? '0px 0px 0px 10px' : '0px 10px 0px 0px',
        },
      ])
    })
  }

  it('preserves unequal tracks and rounded odd gutter halves in a pixel-width group', async () => {
    const cells = await render(
      `<mj-group width="400px">${column('20%')}${column('30%')}${column('50%')}</mj-group>`,
      'gutter="15px"',
    )
    expect(
      cells.filter(({ width }) => ['80px', '120px', '200px'].includes(width)),
    ).to.eql([
      { width: '80px', padding: '0px 8px 0px 0px' },
      { width: '120px', padding: '0px 8px 0px 7px' },
      { width: '200px', padding: '0px 0px 0px 7px' },
    ])
  })

  it('resolves percentage gutters against each group width', async () => {
    const cells = await render(
      `<mj-group width="240px">${column()}${column()}</mj-group>
       <mj-group width="312px">${column()}${column()}</mj-group>`,
      'gutter="5%"',
    )
    expect(
      cells.filter(({ width }) => ['120px', '156px'].includes(width)),
    ).to.eql([
      { width: '120px', padding: '0px 6px 0px 0px' },
      { width: '120px', padding: '0px 0px 0px 6px' },
      { width: '156px', padding: '0px 8px 0px 0px' },
      { width: '156px', padding: '0px 0px 0px 8px' },
    ])
  })

  it('does not count raw children as gutter tracks', async () => {
    const cells = await render(
      `<mj-group>${column()}<mj-raw><!-- raw marker --></mj-raw>${column()}</mj-group>`,
    )
    expect(cells.filter(({ width }) => width === '276px')).to.eql([
      { width: '276px', padding: '0px 10px 0px 0px' },
      { width: '276px', padding: '0px 0px 0px 10px' },
    ])
  })

  it('does not add edge spacing to a single-column group', async () => {
    const cells = await render(`<mj-group>${column('100%')}</mj-group>`)
    expect(cells).to.deep.include({
      width: '552px',
      padding: '0px 0px 0px 0px',
    })
  })

  it('does not add padding when no gutter is authored', async () => {
    const cells = await render(
      `<mj-group>${column()}${column()}</mj-group>`,
      '',
    )
    expect(cells.filter(({ width }) => width === '276px')).to.eql([
      { width: '276px', padding: undefined },
      { width: '276px', padding: undefined },
    ])
  })
})
