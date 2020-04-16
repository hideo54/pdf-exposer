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

export interface TextGroup {
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

interface GenerateMarkdownOptions {
    emphasizesInvisibleTexts: boolean;
}

export default class PDFExposer {
    private isInitializationDone: boolean;
    pdfParser: PDFParser;
    textGroupsArray: TextGroup[][];

    constructor() {
        this.isInitializationDone = false;
        this.pdfParser = new PDFParser();
        this.textGroupsArray = [];
    }

    init(path: string, password?: string) {
        return new Promise<void>((resolve, reject) => {
            const pdfParser = new PDFParser();
            pdfParser.on('pdfParser_dataReady', pdfData => {
                const pages = pdfData.formImage.Pages;
                this.textGroupsArray = pages.map(page => createTextGroups(page.Texts));
                this.isInitializationDone = true;
                resolve();
            });
            pdfParser.on('pdfParser_dataError', errorData => reject(errorData));
            if (password) pdfParser.setPassword(password);
            pdfParser.loadPDF(path);
        });
    }

    generateMarkdown(options: GenerateMarkdownOptions = {
        emphasizesInvisibleTexts: false,
    }) {
        if (this.isInitializationDone) {
            let markdown = '';
            for (const [i, textGroups] of this.textGroupsArray.entries()) {
                markdown += `## Page ${i+1}:\n\n`;
                const strings = textGroups.map(group =>
                    options.emphasizesInvisibleTexts && group.color === 'invisible'
                        ? ` **${group.texts.join('')}** `
                        : group.texts.join('')
                );
                markdown += strings.join('') + '\n\n';
            }
            return markdown;
        } else {
            throw 'Please run init() method first.';
        }
    }
}