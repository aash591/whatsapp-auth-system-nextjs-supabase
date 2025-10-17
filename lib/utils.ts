import { customAlphabet } from 'nanoid';

// Generate a 6-character alphanumeric code (uppercase letters and numbers)
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);

export function generateVerificationCode(): string {
  return nanoid();
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  return phone.replace(/\D/g, '');
}



