import { getCollection } from '@/lib/mongodb';

export interface EmailValidationResult {
  isUnique: boolean;
  existingIn: string[];
  message?: string;
}

/**
 * Validates email uniqueness across all user collections
 * @param email - The email to validate
 * @returns Promise<EmailValidationResult> - Result with uniqueness status and where email exists
 */
export async function validateEmailUniqueness(email: string): Promise<EmailValidationResult> {
  try {
    console.log('Validating email uniqueness for:', email);
    const normalizedEmail = email.toLowerCase().trim();
    const existingIn: string[] = [];

    // Check in users collection (regular signup)
    console.log('Checking users collection...');
    const usersCollection = await getCollection('users');
    const existingUser = await usersCollection.findOne({ email: normalizedEmail });
    if (existingUser) {
      existingIn.push('regular signup');
      console.log('Found existing user');
    }

    // Check in peopleRegistrations collection
    console.log('Checking peopleRegistrations collection...');
    const peopleCollection = await getCollection('peopleRegistrations');
    const existingPeople = await peopleCollection.findOne({ email: normalizedEmail });
    if (existingPeople) {
      existingIn.push('people registration');
      console.log('Found existing people registration');
    }

    // Check in instituteRegistrations collection
    console.log('Checking instituteRegistrations collection...');
    const instituteCollection = await getCollection('instituteRegistrations');
    const existingInstitute = await instituteCollection.findOne({ email: normalizedEmail });
    if (existingInstitute) {
      existingIn.push('institute registration');
      console.log('Found existing institute registration');
    }

    const isUnique = existingIn.length === 0;
    
    let message: string | undefined;
    if (!isUnique) {
      if (existingIn.length === 1) {
        message = `This email is already registered for ${existingIn[0]}. Please use a different email address.`;
      } else {
        message = `This email is already registered for: ${existingIn.join(', ')}. Please use a different email address.`;
      }
    }

    return {
      isUnique,
      existingIn,
      message
    };
  } catch (error) {
    console.error('Email validation error:', error);
    // In case of database error, allow the registration to proceed
    // The database will handle duplicate key errors if they occur
    return {
      isUnique: true,
      existingIn: [],
      message: undefined
    };
  }
}

/**
 * Validates email format
 * @param email - The email to validate
 * @returns boolean - Whether the email format is valid
 */
export function validateEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Comprehensive email validation including format and uniqueness
 * @param email - The email to validate
 * @returns Promise<EmailValidationResult> - Complete validation result
 */
export async function validateEmail(email: string): Promise<EmailValidationResult> {
  // First check email format
  if (!validateEmailFormat(email)) {
    return {
      isUnique: false,
      existingIn: [],
      message: 'Invalid email format. Please enter a valid email address.'
    };
  }

  // Then check uniqueness
  return await validateEmailUniqueness(email);
}
