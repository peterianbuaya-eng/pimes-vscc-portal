/**
 * Generates a student portal username from a student's full name.
 * Format: first letter of first name + last name, no spaces, no uppercase.
 * E.g. "Franchesca Brielle Buaya" -> "fbuaya"
 * E.g. "Buaya, Franchesca Brielle" -> "fbuaya"
 */
export const generateUsername = (name) => {
  if (!name) return '';
  let firstName = '';
  let lastName = '';
  
  if (name.includes(',')) {
    const parts = name.split(',');
    lastName = parts[0].trim();
    const firstPart = parts[1].trim().split(/\s+/)[0];
    firstName = firstPart;
  } else {
    const parts = name.trim().split(/\s+/);
    firstName = parts[0] || '';
    lastName = parts[parts.length - 1] || '';
  }
  
  const firstLetter = firstName.charAt(0).toLowerCase();
  const cleanLastName = lastName.replace(/\s+/g, '').toLowerCase();
  return (firstLetter + cleanLastName).replace(/[^a-z0-9]/g, '');
};
