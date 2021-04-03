import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';

const uri = 'https://system-jwt.herokuapp.com/graphql'; // <-- add the URL of the GraphQL server here

const createApollo = (httpLink: HttpLink): ApolloClientOptions<any> => {
  return {
    cache: new InMemoryCache(),
    link: httpLink.create({ uri }),
  };
};

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
