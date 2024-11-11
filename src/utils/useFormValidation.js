import { useState, useCallback } from 'react';

// Validation rules
const VALIDATION_RULES = {
  required: (value) => value !== null && value !== undefined && value.toString().trim() !== '',
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  minLength: (value, min) => value && value.toString().length >= min,
  maxLength: (value, max) => value && value.toString().length <= max,
  numeric: (value) => !isNaN(value) && !isNaN(parseFloat(value)),
  positiveNumber: (value) => !isNaN(value) && parseFloat(value) > 0,
  date: (value) => value instanceof Date && !isNaN(value),
  futureDate: (value) => value instanceof Date && value > new Date(),
  pastDate: (value) => value instanceof Date && value < new Date(),
  url: (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }
};

// Error messages
const ERROR_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  minLength: (min) => `Must be at least ${min} characters`,
  maxLength: (max) => `Must be no more than ${max} characters`,
  numeric: 'Must be a valid number',
  positiveNumber: 'Must be a positive number',
  date: 'Please enter a valid date',
  futureDate: 'Date must be in the future',
  pastDate: 'Date must be in the past',
  url: 'Please enter a valid URL',
  custom: (message) => message
};

export const useFormValidation = (initialValues = {}, validationSchema = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate a single field
  const validateField = useCallback((name, value) => {
    const fieldRules = validationSchema[name];
    if (!fieldRules) return '';

    for (const rule of fieldRules) {
      let isValid = true;
      let errorMessage = '';

      if (typeof rule === 'string') {
        // Simple rule like 'required'
        isValid = VALIDATION_RULES[rule](value);
        errorMessage = ERROR_MESSAGES[rule];
      } else if (typeof rule === 'object') {
        // Complex rule with parameters
        const { type, params, message } = rule;
        if (VALIDATION_RULES[type]) {
          isValid = VALIDATION_RULES[type](value, ...params);
          errorMessage = message || ERROR_MESSAGES[type](...params);
        }
      } else if (typeof rule === 'function') {
        // Custom validation function
        const result = rule(value, values);
        if (typeof result === 'string') {
          isValid = false;
          errorMessage = result;
        } else {
          isValid = result;
          errorMessage = ERROR_MESSAGES.custom('Invalid value');
        }
      }

      if (!isValid) {
        return errorMessage;
      }
    }

    return '';
  }, [validationSchema, values]);

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationSchema).forEach(fieldName => {
      const fieldError = validateField(fieldName, values[fieldName]);
      if (fieldError) {
        newErrors[fieldName] = fieldError;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validationSchema, values, validateField]);

  // Handle input change
  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  // Handle input blur
  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field on blur if it has been touched
    if (touched[name]) {
      const fieldError = validateField(name, values[name]);
      setErrors(prev => ({ ...prev, [name]: fieldError }));
    }
  }, [touched, validateField, values]);

  // Handle form submission
  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true);
    
    try {
      // Mark all fields as touched
      const allTouched = {};
      Object.keys(validationSchema).forEach(fieldName => {
        allTouched[fieldName] = true;
      });
      setTouched(allTouched);

      // Validate form
      if (validateForm()) {
        await onSubmit(values);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Form submission error:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, values, validationSchema]);

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Set field value programmatically
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  // Set field error programmatically
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    validateField,
    validateForm
  };
};

// Helper function to create validation rules
export const createValidationRule = (type, params = [], message = null) => ({
  type,
  params,
  message
});

// Common validation schemas
export const COMMON_VALIDATIONS = {
  email: [
    'required',
    'email'
  ],
  password: [
    'required',
    { type: 'minLength', params: [6], message: 'Password must be at least 6 characters' }
  ],
  amount: [
    'required',
    'numeric',
    { type: 'positiveNumber', message: 'Amount must be greater than 0' }
  ],
  title: [
    'required',
    { type: 'minLength', params: [2], message: 'Title must be at least 2 characters' },
    { type: 'maxLength', params: [100], message: 'Title must be no more than 100 characters' }
  ],
  description: [
    { type: 'maxLength', params: [500], message: 'Description must be no more than 500 characters' }
  ]
};
