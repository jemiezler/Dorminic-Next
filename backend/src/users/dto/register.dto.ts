export class RegisterDTO {
  readonly email: string;
  readonly password: string;
  readonly name: {
    first: string;
    last: string;
  };
  readonly username: string;
  readonly roles: string[];
}
