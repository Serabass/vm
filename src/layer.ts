import * as path from 'path';
import {Composition} from './composition';
import {VM} from './vm';

export class Layer {
    public title: string;
    public width: number;
    public height: number;

    public static fromJSON(compositon: Composition, object: any) {
        let layer = new Layer(compositon);
        layer.title = object.title;
        layer.width = object.width;
        layer.height = object.height;
        return layer;
    }

    constructor(public compositon: Composition) {
    }

    public get path() {
        return path.join(this.compositon.layersPath, this.title + '.json')
            .replace(/\\/g, '/');
    }

    public async save(): Promise<void> {
        let layer: any = {};
        layer.title = this.title;
        layer.width = this.width;
        layer.height = this.height;
        let json = JSON.stringify(layer).replace(/"/g, '\\$&');
        await this.compositon.execNoData(`echo "${json}" > "${this.path}"`);
    }
}
