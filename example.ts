import PDFExposer from './pdf-exposer';

const pdfExposer = new PDFExposer();
(async () => {
    await pdfExposer.init('./sample.pdf', 'password');
    const text = pdfExposer.generateText({
        emphasizesInvisibleTexts: true,
        format: 'markdown',
    });
    console.log(text);
})();