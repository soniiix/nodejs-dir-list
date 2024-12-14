/**
 * Formats a file size in bytes into a human-readable string with the appropriate unit.
 * @param {number} size The file size (in bytes) to format
 * @returns {string} The formatted file size with its unit (e.g. 23.5 MB)
 */
export function formatSize(size) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
    let result = size
    let unitIndex = 0

    if (size < 1024) {
        result /= 1024
        unitIndex = 1
    }
    else {
        while (result > 1024) {
            result /= 1024
            unitIndex++
        }
    }
    
    result = result < 0.1 ? '0.1' : result.toFixed(1).replace('.0', '')

    return `${result} ${units[unitIndex]}`
}