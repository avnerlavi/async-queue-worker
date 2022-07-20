export interface Producer {
    produce(message: string, queue: string): Promise<void>; 
}