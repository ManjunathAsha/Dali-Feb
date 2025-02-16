/**
 * This file defines TypeScript interfaces representing various entities and
 * props used in the application. Each interface corresponds to a specific
 * type of entity, providing a clear structure for data used within components
 * and API responses.
 */

export type Translations = {
  [key: string]: string | Translations;
};