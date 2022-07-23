import { Role } from "../roles/role";

export interface Subscriber {
    readonly role: Role;
    subscribe(): Promise<void>;
}