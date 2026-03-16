export type AuthTokenPayload = {
  userId: string;
  email: string;
  name: string;
};

export interface IAuthTokenService {
  generate(payload: {
    userId: string;
    email: string;
    name: string;
  }): Promise<{ accessToken: string; refreshToken: string }>;
}
