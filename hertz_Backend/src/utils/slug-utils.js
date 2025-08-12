/**
 * Slug Generator Utility
 * Provides consistent slug generation and validation across the application
 */

/**
 * Generate a URL-friendly slug from a given string
 * @param {string} text - The text to convert to a slug
 * @returns {string} - URL-friendly slug
 */
export const generateSlug = (text) => {
  if (!text || typeof text !== 'string') {
    throw new Error('Text must be a non-empty string');
  }

  return text
    .toLowerCase()
    .trim()
    // Replace special characters and spaces
    .replace(/ & /g, "-and-")
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    // Handle multiple consecutive dashes
    .replace(/-+/g, "-")
    // Remove leading/trailing dashes
    .replace(/^-+|-+$/g, "");
};

/**
 * Validate if a slug is properly formatted
 * @param {string} slug - The slug to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidSlug = (slug) => {
  if (!slug || typeof slug !== 'string') {
    return false;
  }

  // Check if slug contains only lowercase letters, numbers, and hyphens
  // Should not start or end with hyphen, and no consecutive hyphens
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
};

/**
 * Ensure slug uniqueness by appending a number if needed
 * @param {string} baseSlug - The base slug
 * @param {Function} checkExistence - Function that returns true if slug exists
 * @returns {Promise<string>} - Unique slug
 */
export const ensureUniqueSlug = async (baseSlug, checkExistence) => {
  let slug = baseSlug;
  let counter = 1;

  while (await checkExistence(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

/**
 * Generate a unique slug for categories
 * @param {string} name - Category name
 * @param {Function} Category - Category model
 * @param {string} excludeId - ID to exclude from uniqueness check (for updates)
 * @returns {Promise<string>} - Unique category slug
 */
export const generateUniqueCategorySlug = async (name, Category, excludeId = null) => {
  const baseSlug = generateSlug(name);
  
  const checkExistence = async (slug) => {
    const query = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const existing = await Category.findOne(query);
    return !!existing;
  };

  return await ensureUniqueSlug(baseSlug, checkExistence);
};

/**
 * Generate a unique slug for subcategories within a parent category
 * @param {string} name - Subcategory name
 * @param {Array} existingSubcategories - Array of existing subcategories
 * @param {string} excludeId - ID to exclude from uniqueness check (for updates)
 * @returns {string} - Unique subcategory slug
 */
export const generateUniqueSubcategorySlug = (name, existingSubcategories = [], excludeId = null) => {
  const baseSlug = generateSlug(name);
  let slug = baseSlug;
  let counter = 1;

  const filteredSubcategories = excludeId 
    ? existingSubcategories.filter(sub => sub._id.toString() !== excludeId)
    : existingSubcategories;

  while (filteredSubcategories.some(sub => sub.slug === slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};