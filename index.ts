import PDFParser, { Text } from 'pdf2json';

const pdfParser = new PDFParser();

const color = {
    '0': 'black' as const,
    '1': 'invisible' as const,
    '-1': 'invisible' as const,
    '24': 'red' as const,
    '35': 'blue' as const,
};
type ColorNumber = keyof typeof color;
type ColorName = typeof color[ColorNumber];
const isKnownColorNumberString = (n: string): n is ColorNumber => color.hasOwnProperty(n);

interface TextGroup {
    color: ColorName | undefined;
    texts: string[];
}

const createTextGroups = (texts: Text[]): TextGroup[]=> {
    let groups: TextGroup[] = [];
    let lastColorName: ColorName | undefined | null = null;
    for (const text of texts) {
        const textColorNumberString = text.clr.toString();
        const textColorName = isKnownColorNumberString(textColorNumberString) ? color[textColorNumberString] : undefined;
        const textString = text.R.map(textRun => decodeURIComponent(textRun.T)).join();
        if (textColorName === lastColorName) {
            groups[groups.length - 1].texts.push(textString);
        } else {
            groups.push({
                color: textColorName,
                texts: [ textString ],
            });
        }
        lastColorName = textColorName;
    }
    return groups;
};

pdfParser.on('pdfParser_dataReady', pdfData => {
    const pages = pdfData.formImage.Pages;
    for (const [i, page] of pages.entries()) {
        console.log(`Page ${i+1}:`);
        const groups = createTextGroups(page.Texts);
        console.log(groups);
    }
});

pdfParser.loadPDF('sample.pdf');