import * as child_process from 'child_process';
import {ChildProcess} from 'child_process';

class V {
    constructor(public process: ChildProcess) {
    }

    public static exec(cmd: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            child_process.exec(`vagrant ssh -c "${cmd}" -- -q`, function (err: any, data: string): void {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(data);
            });
        });
    }

    public static ssh(): Promise<V> {
        return new Promise<V>((resolve, reject) => {
            let cp = child_process.exec(`vagrant ssh`);
            cp.stdout.once('data', function () {
                resolve(new V(cp));
            });
        });
    }

    public exec(cmd: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.process.stdin.write(`${cmd}\n`);
            this.process.stdout.once('data', function (data: string) {
                resolve(data);
            });
            this.process.stderr.once('data', function (data: any) {
                reject(data);
            });
        });
    }
}

class Layer {
    constructor(public compositon: Composition) {
    }
}

class Composition {
    public name: string;

    constructor(public v: V) {
    }

    public async getField(): Promise<any> {
        let s = await this.v.exec('cat /vagrant_data/file.json');
        return JSON.parse(s);
    }
}

(async () => {
    let comp = new Composition(await V.ssh());
    console.log((await comp.getField()).field);
    console.log((await comp.getField()).field);
})();
