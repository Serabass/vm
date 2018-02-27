import * as path from 'path';
import {Layer} from './layer';
import {VM} from './vm';

export class Composition extends VM {
    public static mainFile: string = 'comp.json';
    public static root: string = '/vagrant_data/comps';
    public title: string;
    public layers: Layer[] = [];

    public static getPathByName(name: string) {
        return path
            .join(Composition.root, name)
            .replace(/\\/g, '/');
    }

    public static async create(name: string): Promise<Composition> {
        let pathByName = Composition.getPathByName(name);

        if (!await this.directoryExists(pathByName)) {
            await this.mkdir(pathByName);
        }

        let filePath = path.join(pathByName, Composition.mainFile).replace(/\\/g, '/');
        await Composition.vagrantExec(`echo {} > ${filePath}`);
        let composition = new Composition();
        composition.title = name;
        return composition;
    }

    public static async open(name: string) {
        let pathByName = Composition.getPathByName(name);

        if (!this.directoryExists(pathByName)) {
            throw new Error(`Directory ${name} does not exist`);
        }

        let filePath = path.join(pathByName, Composition.mainFile).replace(/\\/g, '/');
        let layersDirPath = path.join(pathByName, 'layers').replace(/\\/g, '/');
        let contents = await Composition.vagrantExec(`cat ${filePath}`);
        let json = JSON.parse(contents);
        let composition = new Composition();

        composition.title = json.title;

        if (await this.directoryExists(layersDirPath)) {
            let response: string = await Composition.vagrantExec(`ls ${layersDirPath}`);
            let files: string[] = response.split('\n');
            files.pop();

            if (files.length > 0) {
                for (let file of files) {
                    let layerFileContents = await Composition.vagrantExec(`cat ${layersDirPath}/${file}`);
                    let layerJSON = JSON.parse(layerFileContents);
                    let layer = new Layer(composition);
                    layer.title = layerJSON.title;
                    layer.width = layerJSON.width;
                    layer.height = layerJSON.height;
                    composition.layers.push(layer);
                }
            }
        }

        return composition;
    }

    public async connect(): Promise<this> {
        await super.connect();
        await this.execNoData(`cd ${this.path}`);
        return this;
    }

    public get path(): string {
        return Composition.getPathByName(this.title);
    }

    public get layersPath() {
        return path.join(this.path, 'layers')
            .replace(/\\/g, '/');
    }

    public async save(): Promise<void> {
        let obj: any = {};
        obj.title = this.title;
        let json = JSON.stringify(obj).replace(/"/g, '\\$&');
        let compPath = path.join(this.path, Composition.mainFile).replace(/\\/g, '/');
        await this.execNoData(`echo "${json}" > "${compPath}"`);

        if (!await VM.directoryExists(this.layersPath)) {
            await VM.mkdir(this.layersPath);
        }

        for (let layer of this.layers) {
            await layer.save();
        }
    }
}
