import {
  ApolloClient,
  ApolloLink,
  concat,
  InMemoryCache,
  createHttpLink,
  gql,
} from "@apollo/client";

import { getAccessToken } from "../auth.js";

const httpLink = createHttpLink({
  uri: "http://localhost:9000/graphql",
});

const authLink = new ApolloLink((operation, forward) => {
  console.log("[customLink] operation: ", operation);
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
  return forward(operation);
});

const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
});

export async function getJobs() {
  const query = gql`
    query Jobs {
      jobs {
        id
        date
        title
        company {
          id
          name
        }
      }
    }
  `;

  const { data } = await apolloClient.query({ query });
  return data.jobs;
}

export async function getJob(id) {
  const query = gql`
    query ($id: ID!) {
      job(id: $id) {
        id
        title
        description
        date
        company {
          id
          name
        }
      }
    }
  `;
  const variables = { id };
  console.log("variables: ", variables);
  const { data } = await apolloClient.query({ query, variables });
  console.log("job returned from query is: ", data.job);
  return data.job;
}

export async function getCompany(id) {
  const query = gql`
    query ($id: ID!) {
      company(id: $id) {
        name
        description
        jobs {
          id
          title
          description
          date
        }
      }
    }
  `;
  const variables = { id };
  console.log("variables: ", variables);
  const { data } = await apolloClient.query({ query, variables });
  console.log("company returned from query is: ", data.company);
  return data.company;
}

export async function createJob({ title, description }) {
  const mutation = gql`
    mutation ($input: createJobInput!) {
      job: createJob(input: $input) {
        id
      }
    }
  `;

  const { data } = await apolloClient.mutate({
    mutation,
    variables: {
      input: {
        title,
        description,
      },
    },
  });
  return data.job;
}
