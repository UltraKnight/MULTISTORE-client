// Define reusable regex components
const whitespace = '\\s*'; // Matches zero or more whitespace characters
const pipe = '\\|'; // Matches the pipe character '|'
const optionalPipe = '\\|?'; // Matches an optional pipe character

// Matches the core separator content: optional colon, 3+ dashes, optional colon
// Examples: "---", ":---", "---:", ":---:"
const cellSeparator = ':?-{3,}:?';
const tableCell = '[^|]+';

// Build the full regex pattern parts
// 1. Start of string, optional whitespace, optional leading pipe, optional whitespace
const startPattern = `^${whitespace}${optionalPipe}${whitespace}`;

// 2. The first required cell separator
const firstCell = `${cellSeparator}${whitespace}`;

// 3. One or more additional cells (must be preceded by a pipe)
const additionalCells = `(${pipe}${whitespace}${cellSeparator}${whitespace})+`;

// 4. Optional trailing pipe, optional whitespace, and end of string
const endPattern = `${optionalPipe}${whitespace}$`;

// Combine all parts into the final RegExp object
const tableSeparatorRegex = new RegExp(`${startPattern}${firstCell}${additionalCells}${endPattern}`);
const tableHeaderRegex = new RegExp(
  `^${whitespace}${optionalPipe}${whitespace}${tableCell}${whitespace}(${pipe}${whitespace}${tableCell}${whitespace})+${optionalPipe}${whitespace}$`,
);

export const testSeparatorTableRow = (text: string) => tableSeparatorRegex.test(text) || tableHeaderRegex.test(text);
