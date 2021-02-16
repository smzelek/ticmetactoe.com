import { GuildVaultResponse } from "../../models/app.dtos";
import { dash_case_string, formatted_string } from "../../models/types";

declare const API_URL: string;

class AppService {
    async loadData(realm_slug: dash_case_string, guild_name: formatted_string): Promise<GuildVaultResponse> {
        const data = (await fetch(`${API_URL}/guild_vault/${realm_slug}/${guild_name}`)).json();
        return await data;
    }
}

export default AppService;
