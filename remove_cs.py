import os
import glob

base_dir = r"c:/Users/dines/OneDrive/Desktop/feb project/PURPLE/"
for filepath in glob.glob(os.path.join(base_dir, '**', '*.html'), recursive=True):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        new_lines = []
        changed = False
        for line in lines:
            # Delete nav link to customer service
            if '>Customer Service</a></li>' in line and 'customer-service.html' in line:
                changed = True
                continue
            
            # Change cta in services.html
            if 'href="customer-service.html#"' in line and 'class="service-cta"' in line:
                new_lines.append(line.replace('customer-service.html#', 'contact.html#'))
                changed = True
                continue
            
            # Change button in dashboard
            if 'href="customer-service.html"' in line and 'class="dash-btn' in line:
                new_lines.append(line.replace('customer-service.html', 'contact.html'))
                changed = True
                continue
                
            new_lines.append(line)
        
        if changed:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.writelines(new_lines)
            print(f"Updated: {filepath}")
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
