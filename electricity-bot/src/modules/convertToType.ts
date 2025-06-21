import {Static, TSchema} from '@sinclair/typebox';
import {TypeCompiler} from '@sinclair/typebox/compiler';
import {schemaErrorToError} from './schemaErrorToError';

export const convertToType = <T extends TSchema>(data: unknown, schema: T): Static<T> => {
    const Compiler = TypeCompiler.Compile(schema);
    if (Compiler.Check(data)) {
        return data;
    }

    throw schemaErrorToError(Compiler.Errors(data).First());
};