# pdf-exposer

Node.js module for extracting texts from given PDF file. Made with TypeScript.

This package is made for personal use. I may add some features or accept pull requests, though I have no plan to make this package rich enough for general use.

## Usage

```typescript
import PDFExposer from 'pdf-exposer';

const pdfExposer = new PDFExposer();
(async () => {
    await pdfExposer.init('./sample.pdf', 'password'); // Password is optional
    const text = pdfExposer.generateText({
        emphasizesInvisibleTexts: true,
        format: 'markdown',
    }); // You can omit this options object.
    console.log(text);
})();
```

### init(path[, password])

### generateText(options)

Returns text (`string`).

#### Options:

##### `emphasizesInvisibleTexts`

boolean. Default: `false`

#### `format`

`'markdown'` or `'scrapbox'`. Default: `'markdown'`

### generateSlackBlocks(options)

Returns blocks array (`KnownBlock[]`, which is a type provided by [`@slack/web-api`](https://github.com/slackapi/node-slack-sdk)).

You can directly pass these blocks to the methods provided by Slack's SDK.

#### Options:

##### `emphasizesInvisibleTexts`

boolean. Default: `false`
