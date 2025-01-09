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

export const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
  // defaultOptions: {
  //   query: {
  //     fetchPolicy: "network-only",
  //   },
  //   watchQuery: {
  //     fetchPolicy: "network-only",
  //   },
  // },
});

export const jobsQuery = gql`
  query Jobs($limit: Int, $offset: Int) {
    jobs(limit: $limit, offset: $offset) {
      items {
        id
        date
        title
        company {
          id
          name
        }
      }
      totalCount
    }
  }
`;

const jobDetailFragment = gql`
  fragment JobDetail on Job {
    id
    title
    description
    date
    company {
      id
      name
    }
  }
`;

export const jobByIdQuery = gql`
  query ($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;

export async function getJob(id) {
  const variables = { id };
  console.log("variables: ", variables);
  const { data } = await apolloClient.query({ query: jobByIdQuery, variables });
  console.log("job returned from query is: ", data.job);
  return data.job;
}
export const companyByIdQuery = gql`
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

export const createJobMutation = gql`
  mutation ($input: createJobInput!) {
    job: createJob(input: $input) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;
