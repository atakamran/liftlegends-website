// Security utility functions

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^09\d{9}$/;
  return phoneRegex.test(phone);
};

export const isStrongPassword = (password: string): boolean => {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /\d/.test(password);
};

export const rateLimitStore = new Map<string, { count: number; lastAttempt: number }>();

export const checkRateLimit = (identifier: string, maxAttempts = 5, windowMs = 300000): boolean => {
  const now = Date.now();
  const record = rateLimitStore.get(identifier) || { count: 0, lastAttempt: 0 };
  
  // Reset if window has passed
  if (now - record.lastAttempt > windowMs) {
    record.count = 0;
  }
  
  record.count++;
  record.lastAttempt = now;
  rateLimitStore.set(identifier, record);
  
  return record.count <= maxAttempts;
};

export const secureHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
};