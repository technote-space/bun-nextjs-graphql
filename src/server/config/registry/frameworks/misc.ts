import { container } from 'tsyringe';
import { DITokens } from '#/config/constants';
import { getStringEnv } from '#/config/helper';
import users from '#/config/users';
import { StdErrorNotification } from '#/frameworks/errorNotifications/stdErrorNotification';
import { Auth0SSOClient } from '#/frameworks/sso/auth0';
import { SSOClientMock } from '#/frameworks/sso/client.mock';
import { JwtUserSessionProvider } from '#/interfaceAdapters/controllers/shared/jwtUserSessionProvider';

if (process.env.E2E) {
  container.registerInstance(
    DITokens.SSOClient,
    new SSOClientMock(
      users.map((user) => ({
        id: user.email,
        email: user.email,
      })),
    ),
  );
} else {
  container.registerInstance(
    DITokens.SSOClient,
    new Auth0SSOClient({
      domain: getStringEnv('AUTH0_DOMAIN'),
      clientId: getStringEnv('AUTH0_CLIENT_ID'),
      clientSecret: getStringEnv('AUTH0_CLIENT_SECRET'),
      connection: getStringEnv(
        'AUTH0_CONNECTION',
        'Username-Password-Authentication',
      ),
    }),
  );
}

container.registerSingleton(
  DITokens.UserSessionProvider,
  JwtUserSessionProvider,
);

if (process.env.NODE_ENV === 'development') {
  container.registerInstance(DITokens.HandleErrorNotifications, [
    new StdErrorNotification(),
  ]);
} else {
  container.registerInstance(DITokens.HandleErrorNotifications, []);
}
