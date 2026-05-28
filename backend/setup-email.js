const fs = require('fs');
const path = require('path');
const readline = require('readline');

const envPath = path.join(__dirname, '.env');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('==================================================');
console.log('       Catalyst Gmail SMTP Configuration          ');
console.log('==================================================\n');
console.log('To send real emails to your inbox, we need to authenticate');
console.log('with Gmail\'s SMTP server using your Gmail App Password.\n');

rl.question('1. Enter your Gmail address (e.g. you@gmail.com): ', (email) => {
  const cleanEmail = email.trim();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    console.log('\n❌ Invalid email address. Setup aborted.');
    rl.close();
    return;
  }

  rl.question('2. Enter your 16-character Gmail App Password: ', (appPassword) => {
    const cleanPassword = appPassword.trim();
    if (!cleanPassword || cleanPassword.length < 12) {
      console.log('\n❌ Invalid App Password. Setup aborted.');
      rl.close();
      return;
    }

    try {
      let envContent = '';
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
      }

      // Remove existing SMTP entries if any
      const lines = envContent.split('\n').filter(line => {
        return !line.startsWith('SMTP_USER=') && !line.startsWith('SMTP_PASS=') && line.trim() !== '';
      });

      // Add new SMTP entries
      lines.push(`SMTP_USER=${cleanEmail}`);
      lines.push(`SMTP_PASS=${cleanPassword}`);

      fs.writeFileSync(envPath, lines.join('\n') + '\n', 'utf8');
      
      console.log('\n==================================================');
      console.log('✅ SMTP Settings Saved successfully to backend/.env!');
      console.log('Please restart the backend server to apply the changes.');
      console.log('==================================================');
    } catch (err) {
      console.error('\n❌ Failed to write configuration:', err);
    }
    rl.close();
  });
});
