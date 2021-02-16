import { dash_case_string, formatted_string, } from "./types";

export interface PlayerMythicKeystoneProfileResponse {
    character: {
        id: number;
        name: formatted_string;
        realm: {
            name: formatted_string;
            slug: dash_case_string;
        }
    };
    current_period: {
        best_runs: {
            completed_timestamp: number;
            dungeon: {
                id: number;
                name: formatted_string;
            },
            duration: number;
            is_completed_within_time: boolean;
            keystone_level: number;
        }[];
    }
}

export interface GuildRosterResponse {
    guild: {
        id: number;
        name: formatted_string;
        realm: {
            name: formatted_string;
            slug: dash_case_string;
        }
    };
    members: {
        character: {
            id: number;
            level: number;
            name: formatted_string;
            realm: {
                slug: dash_case_string;
            }
        };
        rank: number;
    }[];
}
