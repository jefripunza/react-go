export type AuthOn = "live" | "management";

export interface IAuthLogin {
  email: string;
  password: string;
}

export interface IGoogleLogin {
  access_token: string;
}
