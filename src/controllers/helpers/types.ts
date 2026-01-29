import { ParsedQs } from 'qs';

export type PopOptions = { path: string };

export type MassFilter = {
    day?: string;
    time?: any;
    radius?: number;
};

export type ParamQuery = string | ParsedQs | (string | ParsedQs)[] | undefined;
