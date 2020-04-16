import PDFParser, { Text } from 'pdf2json';

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

const createTextGroups = (texts: Text[]): TextGroup[] => {
    let groups: TextGroup[] = [];
    let lastColorName: ColorName | undefined | null = null;
    for (const text of texts) {
        const textColorNumberString = text.clr.toString();
        const textColorName = isKnownColorNumberString(textColorNumberString) ? color[textColorNumberString] : undefined;
        const textString = text.R.map(textRun => decodeURIComponent(textRun.T)).join('');
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

const generateInvisibilityEmphasisMarkdown = (textgroups: TextGroup[]) => {
    let strings: string[] = textgroups.map(group =>
            group.color === 'invisible'
                ? `**${group.texts.join('')}**`
                : group.texts.join('')
        );
    return strings.join(' ');
};

const pdfParser = new PDFParser();

export const generateMarkdownFromPDF = (path: string) => (
    new Promise<string>(resolve => {
        pdfParser.on('pdfParser_dataReady', pdfData => {
            const pages = pdfData.formImage.Pages;
            let markdown = '';
            for (const [i, page] of pages.entries()) {
                markdown += `## Page ${i+1}:\n\n`;
                const groups = createTextGroups(page.Texts);
                const newMD = generateInvisibilityEmphasisMarkdown(groups);
                markdown += newMD + '\n\n';
            }
            resolve(markdown);
        });
        pdfParser.loadPDF(path);
    })
);