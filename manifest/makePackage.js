import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import AdmZip from 'adm-zip';
const zip = new AdmZip();

fs.readFile('manifest/manifest.template.json', 'utf-8', (err, data) => {
    if (err) throw err;

    Object.keys(process.env).forEach((key) => {
        if (key.indexOf('TEAMS_APP_ID') === 0 ||
            key.indexOf('HOST_NAME') === 0) {
            data = data.split(`<${key}>`).join(process.env[key]);
            console.log (`Inserted ${key} value of ${process.env[key]}`);
        }
    });
    
    fs.writeFile('manifest/manifest.json', data, 'utf-8', (err, data) => {
        if (err) throw err;
        zip.addLocalFile(`manifest/manifest.json`);
        zip.addLocalFile(`manifest/pfalcon.jpg`);
        zip.addLocalFile(`manifest/pfalcon.jpg`);

        zip.writeZip(`manifest/obapi.zip`);
        console.log(`Created app package manifest/obapi.zip`);
    });
});


