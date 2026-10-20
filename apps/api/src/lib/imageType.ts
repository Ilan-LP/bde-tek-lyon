// Detects the real type of an image from its first bytes (its "magic number"),
// so a renamed file or a forged Content-Type header cannot get through.
// Only jpeg, png and webp are accepted. SVG is deliberately absent: it can carry scripts.
export function detectImageType(buffer: Buffer) {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { ext: 'jpg' };
  }
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { ext: 'png' };
  }
  // WebP is a RIFF container: "RIFF" + 4 size bytes + "WEBP".
  if (
    buffer.length >= 12 &&
    buffer.toString('latin1', 0, 4) === 'RIFF' &&
    buffer.toString('latin1', 8, 12) === 'WEBP'
  ) {
    return { ext: 'webp' };
  }
  return null;
}
