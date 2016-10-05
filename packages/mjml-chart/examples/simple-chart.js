import { mjml2html } from '../../mjml'
import path from 'path'
/*
  Compile an mjml string
*/
const htmlOutput = mjml2html(require('fs').readFileSync(path.resolve(__dirname, 'simple-chart.mjml'), 'utf8'))

/*
  Print the responsive HTML generated
*/
console.log(htmlOutput);
