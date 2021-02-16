import { Guild, Player } from '../models/db';
import { GuildRosterResponse, PlayerMythicKeystoneProfileResponse } from '../models/blizzard.dtos';
import { dash_case_string, formatted_string } from '../models/types';

export class LocalDB {
    private player_db: Map<Player["player_guid"], Player>;
    private guild_db: Map<Guild["guild_guid"], Guild>;

    constructor() {
        this.player_db = new Map();
        this.guild_db = new Map();
    }

    insertGuild(guild: Guild) {
        this.guild_db.set(guild.guild_guid, guild);
    }

    getGuild(realm_slug: dash_case_string, guild_slug: dash_case_string) {
        return this.guild_db.get(this.getGuildGuid(realm_slug, guild_slug));
    }

    insertPlayer(player: Player) {
        this.player_db.set(player.player_guid, player);
    }

    getPlayer(realm_slug: dash_case_string, player_name: formatted_string) {
        return this.player_db.get(this.getPlayerGuid(realm_slug, player_name));
    }

    mapGuildResponse(guild_slug: dash_case_string, response: GuildRosterResponse): Guild {
        return {
            guild_guid: this.getGuildGuid(response.guild.realm.slug, guild_slug),
            guild_name: response.guild.name,
            guild_slug: guild_slug,
            realm_name: response.guild.realm.name,
            realm_slug: response.guild.realm.slug,
            players: response.members
                .filter(m => m.character.level === 60)
                .map((m) => ({
                    player_guid: this.getPlayerGuid(m.character.realm.slug, m.character.name),
                    player_name: m.character.name,
                    realm_slug: m.character.realm.slug
                })),
            last_updated: Date.now()
        };
    }

    mapPlayerResponse(response: PlayerMythicKeystoneProfileResponse): Player {
        return {
            player_guid: this.getPlayerGuid(response.character.realm.slug, response.character.name),
            player_name: response.character.name,
            realm_slug: response.character.realm.slug,
            realm_name: response.character.realm.name,
            weekly_keys_done: response.current_period.best_runs?.map(r => ({
                dungeon_name: r.dungeon.name,
                key_level: r.keystone_level
            })),
            last_updated: Date.now()
        };
    }

    private getGuildGuid(realm_slug: dash_case_string, guild_slug: dash_case_string) {
        return `${realm_slug}%${guild_slug}`;
    }

    private getPlayerGuid(realm_slug: dash_case_string, player_name: formatted_string) {
        return `${realm_slug}%${player_name}`;
    }
}
