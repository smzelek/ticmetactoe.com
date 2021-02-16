import { dash_case_string, formatted_string, guid, milliseconds_since_epoch_timestamp } from "./types";

export interface Guild {
    guild_guid: guid;
    guild_name: formatted_string;
    guild_slug: dash_case_string;
    realm_name: formatted_string;
    realm_slug: dash_case_string;
    players: PlayerIdentifiers[];
    last_updated: milliseconds_since_epoch_timestamp;
}

export interface PlayerIdentifiers extends Pick<Player, "player_guid" | "player_name" | "realm_slug"> {
}

export interface Player {
    player_guid: guid;
    player_name: formatted_string;
    realm_slug: dash_case_string;
    realm_name: formatted_string;
    weekly_keys_done: Key[];
    // highest_keys_done: Map<Key["dungeon_name"], Key>;
    last_updated: milliseconds_since_epoch_timestamp;
}

export interface Key {
    dungeon_name: formatted_string;
    key_level: number;
}
