declare module 'pdf2json' {
    import { EventEmitter } from 'events';
    export interface PDFData {
        formImage: {
            Transcoder: string;
            Agency: string;
            Id: {
                AgencyId: string;
                Name: string;
                NC: boolean;
                Max: number;
                Parent: string;
            };
            Pages: Page[];
            Width: number;
        };
    }
    export interface Page {
        Height: number;
        HLines: Line[];
        VLines: Line[];
        Fills: Fill[];
        Texts: Text[];
        Fields: any[]; // Unknown
        Boxsets: any[]; // Unknown
    }
    export interface Line {
        x: number;
        y: number;
        w: number;
        l: number;
    }
    export interface Fill {
        oc?: string;
        x: number;
        y: number;
        w: number;
        h: number;
        clr: number;
    }
    export interface Text {
        x: number;
        y: number;
        w: number;
        sw: number;
        clr: number;
        A: 'left' | 'center' | 'right';
        R: TextRun[];
    }
    export interface TextRun {
        T: string;
        S: number;
        TS: [number, number, number, number]; // [fontFaceId, fontSize, 1/0 for bold, 1/0 for italic]
    }
    export default class PDFParser extends EventEmitter {
        loadPDF(path: string): void;
        on(event: 'pdfParser_dataReady', listener: (data: PDFData) => void): this;
    }
}