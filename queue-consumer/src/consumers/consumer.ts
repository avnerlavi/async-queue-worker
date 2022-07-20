import { ConsumerStrategy } from "../strategies/consumerStrategy";

export interface Consumer {
    readonly consumerStrategy: ConsumerStrategy;
    readonly consumerTag: string;
    consume(): Promise<void>;
}