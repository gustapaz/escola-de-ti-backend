import { Knex } from 'knex';
import { RefreshTokenRepository } from '../../../domain/repository/refresh-token.repository';
import { InjectKnex } from 'nestjs-knex';

export class RefreshTokenRepositoryImpl implements RefreshTokenRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  //remover
  async createAccount(
    id: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    await this.knex('conta')
      .insert({
        id_entregador: id,
        access_token: accessToken,
        refresh_token: refreshToken,
      })
      .returning('id');
  }

  async getStoredTokens(id: string): Promise<any> {
    return await this.knex
      .from('conta')
      .select('refresh_token')
      .where({ id_entregador: id });
  }

  async updateAccount(id: string, accessToken: string, refreshToken: string) {
    return await this.knex('conta')
      .where({ id_entregador: id })
      .update({ refresh_token: refreshToken, access_token: accessToken });
  }
}
