import { ApolloClientBuilder, GraphqlClient, GraphqlDocsService } from '@app/core/graphql';
import { AuthGraphqlClient, UnauthenticatedGraphqlClient } from '@app/data/constants';
import {
  AnalyticsGraphqlInterceptor,
  AnalyticsHttpInterceptor,
  AuthenticationGraphqlInterceptor,
  AuthTokenInterceptor,
  AxiosResponseInterceptor,
  BusTokenGraphqlInterceptor,
  ExternalApiHeadersInterceptor,
  JsonContentHeaderInterceptor,
  MiddlewareTokenGraphqlInterceptor,
  TimeoutInterceptor,
} from '@app/data/interceptor';
import { NotificationNavigation } from '@app/modules/shared';
import { updateStrings } from '@app/resource';
import * as GraphqlDocs from '@app/resource/graphql/graphql-documents.json';
import {
  configureDateFormatter,
  FirebaseCrashlyticsService,
  FirebaseRemoteConfigService,
  HttpClient,
  HttpRequestBuilder,
  LoggingService,
  StoreLinkService,
} from '@taki-react/core';
import { useScreens } from 'react-native-screens';
import { Container } from 'typedi';

export function configApp(env: any) {
  useScreens();
  configLoggingService();
  configHttpBuilder(env);
  configGraphqlClient(env);
  configureDateFormatter();
  configNotificationListener();
  configStoreLinkService(env);
  fetchRemoteConfigStrings();
}

function configNotificationListener() {
  Container.get(NotificationNavigation).configureNotificationListener();
}

function fetchRemoteConfigStrings() {
  Container.get(FirebaseRemoteConfigService)
    .fetchStrings()
    .then(strings => updateStrings(strings || {}));
}

function configLoggingService() {
  const crashlytics = new LoggingService(Container.get(FirebaseCrashlyticsService));
  Container.set(LoggingService, crashlytics);
}

function configHttpBuilder(env: any) {
  const baseUrl = env.BOTICARIO_API_URL;
  const client = Container.get(HttpClient);

  const interceptors = [
    Container.get(AuthTokenInterceptor),
    Container.get(AxiosResponseInterceptor),
    Container.get(ExternalApiHeadersInterceptor),
    Container.get(JsonContentHeaderInterceptor),
    Container.get(TimeoutInterceptor),
    Container.get(AnalyticsHttpInterceptor),
  ];

  const builder = new HttpRequestBuilder().configure({ baseUrl, client, interceptors });
  Container.set(HttpRequestBuilder, builder);
}

function configGraphqlClient(env: any) {
  Container.get(GraphqlDocsService).config(
    GraphqlDocs,
    'src/app/resource/graphql/query',
    'src/app/resource/graphql/mutation',
  );
  const graphqlUrl = env.GRAPHQL_URL;
  const interceptors = [
    Container.get(BusTokenGraphqlInterceptor),
    Container.get(MiddlewareTokenGraphqlInterceptor),
    Container.get(AuthenticationGraphqlInterceptor),
    Container.get(AnalyticsGraphqlInterceptor),
  ];

  const graphqlClient = Container.get(ApolloClientBuilder).build(graphqlUrl, interceptors);
  Container.set(GraphqlClient, graphqlClient);

  const authInterceptors = [Container.get(BusTokenGraphqlInterceptor)];
  const authGraphqlClient = Container.get(ApolloClientBuilder).build(graphqlUrl, authInterceptors);
  Container.set(AuthGraphqlClient, authGraphqlClient);

  const unauthenticatedGraphqlClient = Container.get(ApolloClientBuilder).build(
    graphqlUrl,
    [],
  );
  Container.set(UnauthenticatedGraphqlClient, unauthenticatedGraphqlClient);
}

function configStoreLinkService(env) {
  const service = new StoreLinkService(env.STORE_URL);
  Container.set(StoreLinkService, service);
}
