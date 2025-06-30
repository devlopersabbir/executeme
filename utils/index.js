/**
 * Extracts clean error messages from Docker execution details
 * @param {string} input - The raw error details from Docker execution
 * @returns {string} - Clean, user-friendly error message
 */
export function extractError(input) {
  const regex = /^(Command failed: docker run[\s\S]*?\/app")([\s\S]*)$/m;

  const match = input.match(regex);
  return match ? match[2] : "Unexpected error occured!";
}
