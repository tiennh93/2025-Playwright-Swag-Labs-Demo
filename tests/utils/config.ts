/**
 * Configuration utilities for test environment
 */

export const BASE_URL = process.env.BASE_URL || 'https://www.saucedemo.com';

/**
 * Get base URL with trailing slash
 */
export const getBaseUrl = (): string => BASE_URL;

/**
 * Get base URL without trailing slash
 */
export const getBaseUrlWithoutSlash = (): string => BASE_URL.replace(/\/$/, '');
