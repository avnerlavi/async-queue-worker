export interface ConsumerStrategy {
    readonly role: string;
    execute(message: string): Promise<void>;
}