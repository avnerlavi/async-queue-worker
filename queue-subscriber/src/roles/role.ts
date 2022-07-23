export interface Role {
    readonly name: string;
    execute(message: string): Promise<void>;
}