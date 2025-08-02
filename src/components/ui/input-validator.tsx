import React from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  phone?: boolean;
  fileSize?: number; // in MB
  fileTypes?: string[];
}

export const validateInput = (value: string, rules: ValidationRule): string | null => {
  if (rules.required && (!value || value.trim() === '')) {
    return 'این فیلد الزامی است';
  }

  if (value && rules.minLength && value.length < rules.minLength) {
    return `حداقل ${rules.minLength} کاراکتر وارد کنید`;
  }

  if (value && rules.maxLength && value.length > rules.maxLength) {
    return `حداکثر ${rules.maxLength} کاراکتر مجاز است`;
  }

  if (value && rules.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'فرمت ایمیل صحیح نیست';
    }
  }

  if (value && rules.phone) {
    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(value)) {
      return 'شماره موبایل باید با 09 شروع شده و 11 رقم باشد';
    }
  }

  if (value && rules.pattern && !rules.pattern.test(value)) {
    return 'فرمت وارد شده صحیح نیست';
  }

  return null;
};

export const validateFile = (file: File, rules: ValidationRule): string | null => {
  if (rules.fileSize && file.size > rules.fileSize * 1024 * 1024) {
    return `حجم فایل نباید بیشتر از ${rules.fileSize} مگابایت باشد`;
  }

  if (rules.fileTypes && !rules.fileTypes.includes(file.type)) {
    return `فقط فایل‌های ${rules.fileTypes.join(', ')} مجاز هستند`;
  }

  return null;
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};