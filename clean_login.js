import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cssPath = path.join(__dirname, 'src', 'pages', 'Login', 'Login.css');
let cssText = fs.readFileSync(cssPath, 'utf-8');

// 1. Remove global CSS
cssText = cssText.replace(/\*\s*\{[\s\S]*?body\s*\{\s*background:\s*#020816;\s*\}/, '');

// 2. Fix the 30 duplicates
const starBefore = `.stars::before {
  background-image:
    radial-gradient(1px 1px at 3% 14%, rgba(255,255,255,0.95), transparent),
    radial-gradient(1px 1px at 7% 26%, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 10% 38%, rgba(255,255,255,0.95), transparent),
    radial-gradient(1px 1px at 13% 52%, rgba(255,255,255,0.85), transparent),
    radial-gradient(1px 1px at 16% 66%, rgba(255,255,255,0.95), transparent),
    radial-gradient(1px 1px at 19% 78%, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 22% 90%, rgba(255,255,255,0.95), transparent),
    radial-gradient(1px 1px at 27% 8%, rgba(255,255,255,0.85), transparent),
    radial-gradient(1px 1px at 30% 20%, rgba(255,255,255,0.95), transparent),
    radial-gradient(1px 1px at 33% 32%, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 36% 44%, rgba(255,255,255,0.95), transparent),
    radial-gradient(1px 1px at 39% 56%, rgba(255,255,255,0.85), transparent),
    radial-gradient(1px 1px at 42% 68%, rgba(255,255,255,0.95), transparent),
    radial-gradient(1px 1px at 45% 80%, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 48% 92%, rgba(255,255,255,0.95), transparent),
    radial-gradient(1px 1px at 52% 12%, rgba(255,255,255,0.85), transparent),
    radial-gradient(1px 1px at 55% 24%, rgba(255,255,255,0.95), transparent),
    radial-gradient(1px 1px at 58% 36%, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 61% 48%, rgba(255,255,255,0.95), transparent),
    radial-gradient(1px 1px at 64% 60%, rgba(255,255,255,0.85), transparent),
    radial-gradient(1px 1px at 67% 72%, rgba(255,255,255,0.95), transparent),
    radial-gradient(1px 1px at 70% 84%, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 73% 96%, rgba(255,255,255,0.95), transparent),
    radial-gradient(1px 1px at 76% 18%, rgba(255,255,255,0.85), transparent),
    radial-gradient(1px 1px at 79% 30%, rgba(255,255,255,0.95), transparent),
    radial-gradient(1px 1px at 82% 42%, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 85% 54%, rgba(255,255,255,0.95), transparent),
    radial-gradient(1px 1px at 88% 66%, rgba(255,255,255,0.85), transparent),
    radial-gradient(1px 1px at 91% 78%, rgba(255,255,255,0.95), transparent),
    radial-gradient(1px 1px at 94% 90%, rgba(255,255,255,0.8), transparent);
  opacity: 0.95;
}`;

// split off .content or .login-page to keep the head
const headIdx = cssText.indexOf('.stars::before {');
if (headIdx !== -1) {
    const head = cssText.substring(0, headIdx);
    const afterIdx = cssText.indexOf('.stars::after {');
    const tail = cssText.substring(afterIdx); // .stars::after to end
    cssText = head + starBefore + '\n\n' + tail;
}

fs.writeFileSync(cssPath, cssText.trim() + '\n');
console.log('Login.css fully cleaned from ES module!');
