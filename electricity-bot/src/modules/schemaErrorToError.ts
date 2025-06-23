import type {ValueError} from '@sinclair/typebox/errors';

export const schemaErrorToError = (error: ValueError | undefined): Error => {
    return Error(`Data is not valid: ${error?.path} (${error?.message})`);
};