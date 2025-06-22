import type { ValueError } from '@sinclair/typebox/errors';

export const schemaErrorToError = (error: ValueError | undefined): Error => {
    return new Error(`Validation error at ${error?.path ?? 'unknown'}: ${error?.message ?? 'Unknown error'}`);
};