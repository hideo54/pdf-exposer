import { generateMarkdownFromPDF } from './pdf';

(async () => {
    const md = await generateMarkdownFromPDF('./sample.pdf');
    console.log(md);
})();