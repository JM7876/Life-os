const fs = require('fs');
const path = './src/app/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Fix: Add Calendar import after 'use client'
if (!content.includes("import Calendar from")) {
  content = content.replace("'use client';", "'use client';\nimport Calendar from './components/Calendar';");
}

// Fix: Replace the dashboard content div with conditional rendering
content = content.replace(
  /<div className=`p-4 lg:p-6 transition-all duration-300 \$\{chatOpen \? 'lg:mr-96' : ''\}`>/,
  `<div className={\`p-4 lg:p-6 transition-all duration-300 \${chatOpen ? 'lg:mr-96' : ''}\`}>
          {activeTab === 'calendar' ? (
            <Calendar />
          ) : (
            <>`
);

// Find and close the fragment before Chat Panel
content = content.replace(
  /        <\/div>\n\n        \{\/\* Chat Panel \*\/\}/,
  `        </div>
          </>
          )}
        </div>

        {/* Chat Panel */}`
);

fs.writeFileSync(path, content);
console.log('Fixed!');
