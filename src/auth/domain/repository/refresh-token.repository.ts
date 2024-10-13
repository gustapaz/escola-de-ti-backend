export abstract class RefreshTokenRepository {
  abstract createAccount(
    id: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<void>;
  abstract getStoredTokens(id: string): Promise<any[]>;
  abstract updateAccount(
    id: string,
    access_token: string,
    refresh_token: string,
  ): Promise<number>;
}
