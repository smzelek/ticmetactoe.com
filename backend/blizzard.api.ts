import { BLIZZARD_API_ROUTES } from '../constants/routes';
import BlizzAPI, * as blizzapi from 'blizzapi';
import { GuildRosterResponse, PlayerMythicKeystoneProfileResponse } from '../models/blizzard.dtos';

const BLIZZARD_CLIENT_ID = '481ca68b8ab04f3e9f23989fd65f9ffe';
const BLIZZARD_CLIENT_SECRET = 'B42MCk8SoB0bxVumHVg0Y0SlnPwbvjX5';

export class BlizzardApi {
    private client: BlizzAPI;

    constructor() {
        this.client = new blizzapi.default({
            region: 'us',
            clientId: BLIZZARD_CLIENT_ID,
            clientSecret: BLIZZARD_CLIENT_SECRET
        });
    }

    async getCharacterKeystoneData(realm_slug: string, player_name: string): Promise<PlayerMythicKeystoneProfileResponse> {
        return await this.client.query(BLIZZARD_API_ROUTES.player_keystone_profile(realm_slug, player_name.toLowerCase()), {
            params: {
                namespace: 'profile-us',
                locale: 'en_US'
            }
        })
    }

    async getGuildRoster(realm_slug: string, guild_name: string): Promise<GuildRosterResponse> {
        return await this.client.query(BLIZZARD_API_ROUTES.guild_roster(realm_slug, guild_name), {
            params: {
                namespace: 'profile-us',
                locale: 'en_US'
            }
        })
    }
}
