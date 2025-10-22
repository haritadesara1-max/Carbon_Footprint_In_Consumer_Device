import { z } from 'zod';

// E-waste request validation
export const ewasteRequestSchema = z.object({
  itemType: z.string()
    .trim()
    .min(3, 'Item type must be at least 3 characters')
    .max(100, 'Item type must be less than 100 characters'),
  quantity: z.number()
    .int('Quantity must be a whole number')
    .positive('Quantity must be positive')
    .max(10000, 'Quantity must be less than 10,000'),
  address: z.string()
    .trim()
    .min(10, 'Address must be at least 10 characters')
    .max(500, 'Address must be less than 500 characters'),
  pickupDate: z.date()
    .min(new Date(), 'Pickup date must be in the future')
});

// Carbon tracking validation
export const carbonTrackingSchema = z.object({
  monthYear: z.string()
    .regex(/^\d{4}-\d{2}$/, 'Month/year must be in YYYY-MM format'),
  file: z.custom<File>()
    .refine((file) => file instanceof File, 'File is required')
    .refine((file) => file.size <= 10_000_000, 'File size must be less than 10MB')
    .refine(
      (file) => ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type),
      'File must be PDF, JPEG, or PNG'
    )
});

// Auth validation
export const signupSchema = z.object({
  email: z.string()
    .trim()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters'),
  fullName: z.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .optional(),
  companyName: z.string()
    .trim()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters')
    .optional()
});

export const signinSchema = z.object({
  email: z.string()
    .trim()
    .email('Invalid email address'),
  password: z.string()
    .min(1, 'Password is required')
});
