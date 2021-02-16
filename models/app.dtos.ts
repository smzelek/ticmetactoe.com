import { Key, Player } from "./db";
import { guid, formatted_string, dash_case_string, milliseconds_since_epoch_timestamp } from "./types";

export interface GuildVaultResponse {
    guild_name: formatted_string;
    realm_name: formatted_string;
    players: PlayerVault[];
    last_updated: milliseconds_since_epoch_timestamp;
}

export interface PlayerVault {
    player_name: formatted_string;
    weekly_keys_done: Key[];
}

export interface ApiError {
    code: number;
    status: string;
}
