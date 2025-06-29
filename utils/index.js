/**
 * Extracts clean error messages from Docker execution details
 * @param {string} details - The raw error details from Docker execution
 * @returns {string} - Clean, user-friendly error message
 */
export function extractError(details) {
  if (!details || typeof details !== "string") {
    return "Unknown error occurred";
  }

  // TypeScript/Deno parsing errors
  const tsParseMatch = details.match(
    /error: The module's source code could not be parsed: (.+?) at file:/
  );
  if (tsParseMatch) {
    return `Syntax Error: ${tsParseMatch[1].trim()}`;
  }

  // Python errors - extract from traceback
  const pythonErrorMatch = details.match(/(\w+Error): (.+?)(?:\n|$)/);
  if (pythonErrorMatch) {
    return `${pythonErrorMatch[1]}: ${pythonErrorMatch[2].trim()}`;
  }

  // Node.js errors - extract ReferenceError, TypeError, etc.
  const nodeErrorMatch = details.match(/(\w+Error): (.+?)(?:\n|    at)/);
  if (nodeErrorMatch) {
    return `${nodeErrorMatch[1]}: ${nodeErrorMatch[2].trim()}`;
  }

  // Generic error patterns
  const genericErrorMatch = details.match(/error: (.+?)(?:\n|$)/i);
  if (genericErrorMatch) {
    return `Error: ${genericErrorMatch[1].trim()}`;
  }

  // Fallback - try to extract any line that looks like an error
  const lines = details.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.includes("Error:") || trimmed.includes("error:")) {
      // Remove file paths and line numbers
      const cleaned = trimmed
        .replace(/at file:\/\/\/[^\s]+/g, "")
        .replace(/at Object\.<anonymous>.+/g, "")
        .replace(/at Module\._compile.+/g, "")
        .replace(/\s+/g, " ")
        .trim();

      if (cleaned.length > 0) {
        return cleaned;
      }
    }
  }

  return "Execution failed with unknown error";
}
