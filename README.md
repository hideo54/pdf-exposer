# pdf-exposer

Node.js module for extracting texts from given PDF file. Made with TypeScript.

This package is made for personal use. I may add some features or accept pull requests, though I have no plan to make this package rich enough for general use.

## Usage

```typescript
import PDFExposer from 'pdf-exposer';

const pdfExposer = new PDFExposer();
(async () => {
    await pdfExposer.init('./sample.pdf', 'password'); // Password is optional
    const md = pdfExposer.generateMarkdown({
        emphasizesInvisibleTexts: true, // You can omit this options object. Default: false
    });
    console.log(md);
})();
```
