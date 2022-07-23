import { EmailRole } from "./emailRole";
import { Role } from "./role";

export class RoleFactory {
    private static roleStrategies: Record<string, () => Promise<Role>> = {
        'email': async function () {
            return EmailRole.create();
         }
    }

    public static async createRole(roleType: string): Promise<Role> {
        if (!(roleType in this.roleStrategies)) {
            throw new Error(`role cannot be created for given role of ${roleType}!`);
        }

        return this.roleStrategies[roleType]();
    }
}