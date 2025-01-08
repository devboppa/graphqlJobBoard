import { GraphQLError } from "graphql";
import {
  createJob,
  deleteJob,
  getJob,
  getJobs,
  getJobsByCompany,
} from "./db/jobs.js";
import { getCompany } from "./db/companies.js";
export const resolvers = {
  Query: {
    greeting: () => "Hello world!",
    jobs: () => getJobs(),
    job: async (_root, { id }) => {
      console.log("job id received is: ", id);
      const job = await getJob(id);
      if (!job) {
        throw new notFoundError("no job with given id found: " + id);
      }
      return job;
    },
    company: async (_root, { id }) => {
      console.log("company id received is: ", id);
      const company = await getCompany(id);
      if (!company) {
        throw notFoundError("No company with given id found: " + id);
      }
      return company;
    },
  },

  Job: {
    date: (job) => {
      return toIsoDate(job.createdAt);
    },
    company: (job) => getCompany(job.companyId),
  },
  Company: {
    jobs: (company) => getJobsByCompany(company.id),
  },

  Mutation: {
    createJob: (_root, { input: { title, description } }) => {
      const companyId = "FjcJCHJALA4i";
      return createJob({ companyId, title, description });
    },
    deleteJob: (_root, { input: { id } }) => {
      return deleteJob(id);
    },
  },
};

function toIsoDate(value) {
  return value.slice(0, "yyyy-mm-dd".length);
}

function notFoundError(message) {
  return new GraphQLError(message, {
    extensions: {
      code: "NOT_FOUND",
    },
  });
}
