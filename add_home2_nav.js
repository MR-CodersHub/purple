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
    if (filepath.endsWith('home2.html')) return; // Already correctly added here

    try {
        let content = fs.readFileSync(filepath, 'utf-8');
        let lines = content.split('\n');
        let changed = false;
        let new_lines = [];

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            new_lines.push(line);

            // Check if this line contains the link to Home
            // Can be href="index.html" or href="../index.html"
            if (line.includes('>Home</a></li>')) {
                // Determine if we are in root or in a subfolder
                let isSubfolder = filepath.includes('\\pages\\') || filepath.includes('/pages/');
                let home2Href = isSubfolder ? "../home2.html" : "home2.html";

                // Construct the Home2 link based on indentation (copy indentation from Current line)
                let indentation = line.match(/^\s*/)[0];
                let homeLine = `${indentation}<li><a href="${home2Href}" class="nav-link">Home2</a></li>`;

                // Only add if next line is not already Home2
                if (i + 1 < lines.length && !lines[i + 1].includes('Home2')) {
                    new_lines.push(homeLine);
                    changed = true;
                }
            }
        }

        if (changed) {
            fs.writeFileSync(filepath, new_lines.join('\n'), 'utf-8');
            console.log("Updated navigation in: " + filepath);
        }
    } catch (e) {
        console.error("Error processing " + filepath + ": " + e);
    }
});
