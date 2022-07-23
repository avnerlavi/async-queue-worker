export interface Publisher {
    publish(message: string, queue: string): Promise<void>; 
}