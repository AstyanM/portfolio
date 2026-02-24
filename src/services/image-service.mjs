import sharpService from 'astro/assets/services/sharp';

/**
 * Custom image service wrapping Astro's Sharp service.
 * Falls back to the original format when an image is too large for WebP conversion,
 * instead of crashing the build.
 */
const customImageService = {
  ...sharpService,

  async transform(inputBuffer, transformOptions, config) {
    try {
      return await sharpService.transform(inputBuffer, transformOptions, config);
    } catch (error) {
      const isWebPSizeError =
        error?.cause?.message?.includes('too large for the WebP format') ||
        error?.message?.includes('too large for the WebP format');

      if (isWebPSizeError && transformOptions.format === 'webp') {
        const src = transformOptions.src ?? 'unknown';
        console.warn(
          `[image-service] Image too large for WebP, falling back to original format: ${src}`
        );

        return await sharpService.transform(
          inputBuffer,
          { ...transformOptions, format: undefined },
          config
        );
      }

      throw error;
    }
  },
};

export default customImageService;
