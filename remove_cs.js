const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else {
            callback(path.join(dir, f));
        }
    });
}

const baseDir = "c:/Users/dines/OneDrive/Desktop/feb project/PURPLE";

walkDir(baseDir, (filepath) => {
    if (!filepath.endsWith('.html')) return;

    try {
        let content = fs.readFileSync(filepath, 'utf-8');
        let lines = content.split('\n');
        let changed = false;

        let new_lines = lines.filter(line => {
            // Delete nav link to customer service
            if (line.includes('>Customer Service</a></li>') && line.includes('customer-service.html')) {
                changed = true;
                return false;
            }
            return true;
        }).map(line => {
            // Change cta in services.html
            if (line.includes('href="customer-service.html#"') && line.includes('class="service-cta"')) {
                changed = true;
                return line.replace('customer-service.html#', 'contact.html#');
            }

            // Change button in dashboard
            if (line.includes('href="customer-service.html"') && line.includes('class="dash-btn')) {
                changed = true;
                return line.replace('customer-service.html', 'contact.html');
            }
            return line;
        });

        if (changed) {
            fs.writeFileSync(filepath, new_lines.join('\n'), 'utf-8');
            console.log("Updated: " + filepath);
        }
    } catch (e) {
        console.error("Error processing " + filepath + ": " + e);
    }
});
