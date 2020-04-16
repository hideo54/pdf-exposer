import PDFExposer from './pdf';

const pdfExposer = new PDFExposer();
(async () => {
    await pdfExposer.init('./sample.pdf', 'password');
    const md = pdfExposer.generateMarkdown({
        emphasizesInvisibleTexts: true,
    });
    console.log(md);
})();