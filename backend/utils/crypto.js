const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const KEY = Buffer.from(process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef', 'utf8');

if (KEY.length !== 32) {
  throw new Error('ENCRYPTION_KEY must be 32 characters long');
}

const encrypt = (plaintext) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString('base64');
};

const decrypt = (cipherText) => {
  const data = Buffer.from(cipherText, 'base64');
  const iv = data.slice(0, IV_LENGTH);
  const authTag = data.slice(IV_LENGTH, IV_LENGTH + 16);
  const encrypted = data.slice(IV_LENGTH + 16);
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
};

module.exports = { encrypt, decrypt };
