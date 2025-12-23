import { readFile } from 'fs/promises';

const AUTH = process.env.BASIC_AUTH_TOKEN

const filePath = process.argv[2];
if (!filePath || !filePath.endsWith('.json')) {
    console.log('Please provide a valid JSON file path as argument.');
    process.exit(1);
}

const {response} = await readFile(filePath, 'utf8').then(content => JSON.parse(content));

for (const res of response) {
    if (res.ok) {
        console.log(`Deleting doc id=${res.id} rev=${res.rev}`);

        await fetch("https://sofa.tschaul.com/ajexpenditor/"+res.id+"?rev="+res.rev, {
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
            "method": "DELETE",
            "mode": "cors"
        });  
    }
}

console.log('Undo completed.');