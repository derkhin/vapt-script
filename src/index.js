const path = require('path');
const fs = require('fs/promises');
const handlebars = require('handlebars');

async function generateHTML(jsonData) {
    const templatePath = path.join(__dirname, 'templates/template.hbs');
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const compiledTemplate = handlebars.compile(templateContent);
    const html = compiledTemplate({ data: jsonData });

    const htmlFilePath = path.join(__dirname, 'generated.html');
    await fs.writeFile(htmlFilePath, html, 'utf-8');
    console.log('HTML file generated successfully.');
}

async function convertTextToJSON(file_name) {
    const reportFileName = path.join(__dirname, `reports/${file_name}.txt`);
    try {
        const reportData = await fs.readFile(reportFileName, 'utf-8');
        const lines = reportData.trim().split('\n');
        const entity = [];
        lines.forEach((line, index) => {
            const strippedLine = line.trim();
            entity.push({ value: strippedLine, index: index + 1 });
        });
        console.log('[+] entity')
        return entity;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

(async () => {
    let files = ['subdomains', 'aliveIp', 'HostPort'];
    const solidData = await Promise.all(files.map(async (file_name) => {
        return {
            [file_name]: await convertTextToJSON(file_name)
        };
    }));
    solidData.unshift({ "sidebar": files })
    if (solidData.length) {
        console.log(JSON.stringify(solidData))
        await generateHTML(solidData)
    }
})();