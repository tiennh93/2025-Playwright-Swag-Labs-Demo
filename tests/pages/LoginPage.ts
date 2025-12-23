import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}
  // Selectors
  username = () => this.page.getByTestId('username');
  password = () => this.page.getByTestId('password');
  loginBtn = () => this.page.getByTestId('login-button');

  // Actions
  async login(user: string, pass: string) {
    await this.username().fill(user);
    await this.password().fill(pass);
    await this.loginBtn().click();
  }
}
