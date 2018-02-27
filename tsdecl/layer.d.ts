import { Composition } from './composition';
export declare class Layer {
    compositon: Composition;
    title: string;
    width: number;
    height: number;
    static fromJSON(compositon: Composition, object: any): Layer;
    constructor(compositon: Composition);
    readonly path: string;
    save(): Promise<void>;
}
