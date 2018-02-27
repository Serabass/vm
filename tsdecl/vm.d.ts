/// <reference types="node" />
import { ChildProcess } from 'child_process';
export declare class VM {
    process: ChildProcess;
    static vagrantExec(cmd: string): Promise<string>;
    static fileExists(fileName: string): Promise<boolean>;
    static directoryExists(dirName: string): Promise<boolean>;
    static mkdir(dirName: string, p?: boolean): Promise<boolean>;
    connect(): Promise<this>;
    disconnect(): Promise<this>;
    exec(cmd: string): Promise<string>;
    execNoData(cmd: string): Promise<void>;
}
