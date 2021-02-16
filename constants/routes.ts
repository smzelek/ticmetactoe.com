import { dash_case_string } from "../models/types";

export const BLIZZARD_API_ROUTES: { [key: string]: (...args: any[]) => string } = {
    guild_roster: (
        realm_slug: dash_case_string,
        guild_slug: dash_case_string
    ) => `/data/wow/guild/${realm_slug}/${guild_slug}/roster`,
    player_keystone_profile: (
        realm_slug: dash_case_string,
        player_name: dash_case_string
    ) => `/profile/wow/character/${realm_slug}/${player_name}/mythic-keystone-profile`
};
