import * as child_process from 'child_process';
import {ChildProcess} from 'child_process';

export class VM {
    public process: ChildProcess;

    public static vagrantExec(cmd: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            cmd = cmd.replace(/"/g, '\\$&');
            child_process.exec(`vagrant ssh -c "${cmd}" -- -q`, function (err: any, data: string): void {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(data);
            });
        });
    }

    public static async fileExists(fileName: string): Promise<boolean> {
        return (await this.vagrantExec(`[[ ! -f "${fileName}" ]] || echo "exists"`)) === 'exists\n';
    }

    public static async directoryExists(dirName: string): Promise<boolean> {
        return (await this.vagrantExec(`[[ ! -d "${dirName}" ]] || echo "exists"`)) === 'exists\n';
    }

    public static async mkdir(dirName: string, p: boolean = true): Promise<boolean> {
        return (await this.vagrantExec(`mkdir ${ p ? '-p' : '' } "${dirName}"`)) === '';
    }

    public connect(): Promise<this> {
        return new Promise<this>((resolve, reject) => {
            let cp = child_process.exec(`vagrant ssh`);
            cp.stdout.once('data', () => {
                this.process = cp;
                resolve(this);
            });
        });
    }

    public disconnect(): Promise<this> {
        return new Promise<this>((resolve) => {
            this.process.kill();
            resolve(this);
        });
    }

    public exec(cmd: string): Promise<string> {
        cmd = cmd.replace(/"/g, '\\$&');
        return new Promise<string>((resolve, reject) => {
            this.process.stdin.write(`${cmd}\n`);
            this.process.stdout.once('data', function (data: string) {
                resolve(data);
            });
            this.process.stderr.once('data', function (data: string) {
                reject(data);
            });
        });
    }

    public execNoData(cmd: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.process.stdin.write(`${cmd}\n`);
            resolve();
        });
    }
}
