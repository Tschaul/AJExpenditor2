import { readFile, writeFile } from 'fs/promises';

const AUTH = process.env.BASIC_AUTH_TOKEN

const {rows} = await fetch("https://sofa.tschaul.com/ajexpenditor/_design/ajexpenditor/_view/categories?include_docs=true", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0",
        "Accept": "application/json",
        "Accept-Language": "de,en-US;q=0.7,en;q=0.3",
        "Authorization": AUTH,
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin"
    },
    "referrer": "https://sofa.tschaul.com/ajexpenditor/_design/ajexpenditor/index.html",
    "method": "GET",
    "mode": "cors"
}).then(res => res.json());

// console.log(rows);
const categories = rows.map(row => row.doc);
// console.log(categories);

const filePath = process.argv[2];
if (!filePath || !filePath.endsWith('.csv')) {
    console.log('Please provide a valid CSV file path as argument.');
    process.exit(1);
}

const data = await readCsvFromDisk(filePath)

let docs = [];

let dataCount = 0;

for (const entry of data) {
    if (!entry.euro) continue; // skip empty lines
    dataCount++;
    const amount = parseInt(entry.euro) * 10000 + parseInt(entry.cent) * 100;
    const date = `${entry.year}-${entry.month.padStart(2,'0')}-${entry.day.padStart(2,'0')}`;
    const categoryDoc = categories.find(cat => cat.fullName === entry.category.trim());
    const categoryId = categoryDoc ? categoryDoc.name : null;
    if (!categoryId) {
        console.log(`Warning: Category not found for entry: ${JSON.stringify(entry)}. exiting`);
        process.exit(1);
    }
    const expenditures = [];
    if (entry.exp_andi && parseInt(entry.exp_andi) > 0) {
        expenditures.push({ person: 'andi', portion: parseInt(entry.exp_andi) });
    }
    if (entry.exp_julian && parseInt(entry.exp_julian) > 0) {
        expenditures.push({ person: 'julian', portion: parseInt(entry.exp_julian) });
    }
    const ious = [];
    if (entry.iou_andi_julian && parseInt(entry.iou_andi_julian) > 0) {
        ious.push({ borrower: 'andi', creditor: 'julian', portion: parseInt(entry.iou_andi_julian) });
    }
    const doc = {
        type: 'event',
        amount,
        description: entry.description,
        date,
        category: categoryId,
        amountScribble: `${entry.euro},${entry.cent}`,
        ious,
        expenditures,
    };
    docs.push(doc);
}

const body = { docs, new_edits: true };

const response = await fetch("https://sofa.tschaul.com/ajexpenditor/_bulk_docs", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0",
        "Accept": "application/json",
        "Accept-Language": "de,en-US;q=0.7,en;q=0.3",
        "Content-Type": "application/json",
        "Authorization": AUTH,
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "Priority": "u=0"
    },
    "referrer": "https://sofa.tschaul.com/ajexpenditor/_design/ajexpenditor/index.html",
    "body": JSON.stringify(body),
    "method": "POST",
    "mode": "cors"
}).then(res => res.json());

let errorCount = 0;

for (const res of response) {
    if (!res.ok) {
        console.log(`Failed to import doc: ${JSON.stringify(res)}`);
        errorCount++;
    }
}


const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

const resultFileName = filePath.replace('.csv', '-'+timestamp+'.json');

await writeFile(resultFileName, JSON.stringify({body, response}, null, 2), 'utf8');

console.log(`Import finished with ${errorCount} errors. ${dataCount} rows were imported. Result written to ` + resultFileName);

async function readCsvFromDisk(filePath) {
    const data = await readFile(filePath, 'utf8');
    const result = data.split('\r\n').map(line => {
        const [
            euro, 
            cent,
            day,
            month,
            year,
            category,
            description,
            exp_andi,
            exp_julian,
            iou_andi_julian,            
        ] = line.split(',');
        return {
            euro, 
            cent,
            day,
            month,
            year,
            category,
            description,
            exp_andi,
            exp_julian,
            iou_andi_julian,  
        }
    });

    result.shift(); // remove header line
    return result;
}