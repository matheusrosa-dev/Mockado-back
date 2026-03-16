export type GoogleUser = {
  googleId: string;
  email: string;
  name: string;
};

export interface IGoogleAuthService {
  verifyToken(token: string): Promise<GoogleUser>;
}
