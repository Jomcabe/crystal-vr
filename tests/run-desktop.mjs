import {chromium} from 'playwright';
import checkDesktop from './desktop-checks.cjs';
const browser=await chromium.launch({headless:true});
try {
  const page=await browser.newPage();
  console.log(JSON.stringify(await checkDesktop(page,process.argv[2]||'https://jocabe.com/crystal-vr/'),null,2));
} finally {await browser.close();}
