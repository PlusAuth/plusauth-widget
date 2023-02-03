export declare class H1FingerVeinService {
    private fetch;
    ping(): Promise<void>;
    version(): Promise<any>;
    deviceStatus(): Promise<Record<string, any>>;
    enroll(fingerIndex: number): Promise<any>;
    verify(fingerIndex: number, templateEnc: string): Promise<any>;
}
