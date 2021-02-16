import { ApiError, GuildVaultResponse } from "../models/app.dtos";
import { Guild, Player } from "../models/db";
import { dash_case_string, formatted_string } from "../models/types";
import { BlizzardApi } from "./blizzard.api";
import { LocalDB } from "./local.db";

export class AppService {
    private blizzardApi: BlizzardApi;
    private localDb: LocalDB;

    constructor() {
        this.blizzardApi = new BlizzardApi();
        this.localDb = new LocalDB();
    }

    private async getRecentGuildData(realm_slug: dash_case_string, guild_slug: dash_case_string): Promise<Guild> {
        const cached_guild = this.localDb.getGuild(realm_slug, guild_slug);

        if (cached_guild && this.isLessThanXMinutesAgo(60, cached_guild.last_updated)) {
            console.log(`CACHE<GUILD> ${cached_guild.guild_name}-${cached_guild.realm_name}.`)
            return cached_guild;
        }

        const response = await this.blizzardApi.getGuildRoster(realm_slug, guild_slug);
        const mapped_guild = this.localDb.mapGuildResponse(guild_slug, response);
        this.localDb.insertGuild(mapped_guild);
        console.log(`LOAD<GUILD> ${mapped_guild.guild_name}-${mapped_guild.realm_name}.`)
        return mapped_guild;
    }

    private getFallbackPlayerKeyData(realm_slug: dash_case_string, player_name: formatted_string): Player | undefined {
        return this.localDb.getPlayer(realm_slug, player_name);
    }

    private async getRecentPlayerKeyData(realm_slug: dash_case_string, player_name: formatted_string): Promise<Player> {
        const cached_player = this.localDb.getPlayer(realm_slug, player_name);

        if (cached_player && this.isLessThanXMinutesAgo(30, cached_player.last_updated)) {
            console.log(`CACHE<PLAYER> ${cached_player.player_name}-${cached_player.realm_name}.`)
            return cached_player;
        }

        const response = await this.blizzardApi.getCharacterKeystoneData(realm_slug, player_name);
        const mapped_player = this.localDb.mapPlayerResponse(response);
        this.localDb.insertPlayer(mapped_player);
        console.log(`LOAD<PLAYER> ${mapped_player.player_name}-${mapped_player.realm_name}.`)
        return mapped_player;
    }

    async loadGuildVault(realm_slug: dash_case_string, guild_slug: dash_case_string): Promise<GuildVaultResponse | ApiError> {
        const guild = await this.getRecentGuildData(realm_slug, guild_slug);

        const player_data = (await Promise.all(guild.players.map(p => {
            return this.tryRequestWithRetries(
                () => this.getRecentPlayerKeyData(p.realm_slug, p.player_name),
                `load player data for ${p.realm_slug}`,
                () => this.getFallbackPlayerKeyData(p.realm_slug, p.player_name),
            );
        }))).filter(p => !!p) as Player[];

        const newest_data_timestamp = player_data.reduce((acc, cur) => Math.max(acc, cur.last_updated), guild.last_updated);

        return {
            guild_name: guild.guild_name,
            realm_name: guild.realm_name,
            players: player_data.map(p => ({
                player_name: p.player_name,
                weekly_keys_done: p.weekly_keys_done
            })),
            last_updated: newest_data_timestamp
        };
    }

    private async tryRequestWithRetries<T>(fnThatMayError: () => Promise<T>, failureMessage: string, fallbackData: () => T, tries = 0): Promise<T | null> {
        try {
            return await fnThatMayError();
        }
        catch (e) {
            if (tries < 3) {
                console.warn(`RETRY ${tries+1} ${failureMessage}`);
                return this.tryRequestWithRetries(fnThatMayError, failureMessage, fallbackData, tries++);
            }
            console.error(`FAILED after 3 retries: ${failureMessage}`);
            return fallbackData();
        }
    }

    private isLessThanXMinutesAgo(within_minutes: number, timestamp: number) {
        const ONE_MINUTE_IN_MS = 60000;
        const in_milliseconds = within_minutes * ONE_MINUTE_IN_MS;
        const now = Date.now();
        return timestamp + in_milliseconds > now;
    }
}