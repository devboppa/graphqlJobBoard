import { GraphQLClient, gql } from "graphql-request";
import { getAccessToken } from "../auth.js";
const client = new GraphQLClient("http://localhost:9000/graphql", {
  headers: () => {
    const accessToken = getAccessToken();
    if (accessToken) {
      return {
        Authorization: `Bearer ${accessToken}`,
      };
    }
    return {};
  },
});

export async function getJobs() {
  const query = gql`
    query {
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
  const { jobs } = await client.request(query);
  return jobs;
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
  const { job } = await client.request(query, variables);
  console.log("job returned from query is: ", job);
  return job;
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
  const { company } = await client.request(query, variables);
  console.log("company returned from query is: ", company);
  return company;
}

export async function createJob({ title, description }) {
  const mutation = gql`
    mutation ($input: createJobInput!) {
      job: createJob(input: $input) {
        id
      }
    }
  `;
  const { job } = await client.request(mutation, {
    input: {
      title,
      description,
    },
  });
  return job;
}
