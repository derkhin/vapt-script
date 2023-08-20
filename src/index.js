const path = require('path');
const fs = require('fs/promises');
const handlebars = require('handlebars');

async function generateHTML(jsonData) {
    const templatePath = path.join(__dirname, 'templates/template.hbs');
    const templateContent = await fs.readFile(templatePath, 'utf-8');

    const compiledTemplate = handlebars.compile(templateContent);
    const html = compiledTemplate(jsonData);

    const htmlFilePath = path.join(__dirname, 'generated.html');
    await fs.writeFile(htmlFilePath, html, 'utf-8');
    console.log('HTML file generated successfully.');
}

async function fetchJSONAndStore() {
    const jsonFileName = 'reports.json';
    const jsonFilePath = path.join(__dirname, jsonFileName);

    try {
        const jsonData = await fs.readFile(jsonFilePath, 'utf-8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

(async () => {
    const jsonData = await fetchJSONAndStore();
    if (jsonData) {
        console.log(jsonData)
        await generateHTML(jsonData)
    }
})();