import { GraphQLError } from "graphql";
import {
  createJob,
  deleteJob,
  getJob,
  getJobs,
  getJobsByCompany,
  updateJob,
} from "./db/jobs.js";
import { getCompany } from "./db/companies.js";
import { UnauthorizedError } from "express-jwt";
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
    createJob: (_root, { input: { title, description } }, { user }) => {
      if (!user) {
        throw new unAuthorizedError("Not authorized to perform the action.");
      }
      return createJob({ companyId: user.companyId, title, description });
    },
    deleteJob: async (_root, { input: { id } }, { user }) => {
      if (!user) {
        throw new unAuthorizedError("Not authorized to delete.");
      }
      const job = await deleteJob(id, user.companyId);
      if (!job) {
        throw new notFoundError("job with id not found in your company.");
      }
      return job;
    },
    updateJob: (_root, { input: { id, title, description } }) => {
      return updateJob({ id, title, description });
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

function unAuthorizedError(message) {
  return new GraphQLError(message, {
    extensions: {
      code: "NOT_AUTHORIZED",
    },
  });
}
