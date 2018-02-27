import { Layer } from './layer';
import { VM } from './vm';
export declare class Composition extends VM {
    static mainFile: string;
    static root: string;
    title: string;
    layers: Layer[];
    static getPathByName(name: string): string;
    static create(name: string): Promise<Composition>;
    static open(name: string): Promise<Composition>;
    connect(): Promise<this>;
    readonly path: string;
    readonly layersPath: string;
    save(): Promise<void>;
}
