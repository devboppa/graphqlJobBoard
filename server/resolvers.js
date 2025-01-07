import { getJobs } from "./db/jobs.js";
import { getCompany } from "./db/companies.js";
export const resolvers = {
  Query: {
    greeting: () => "Hello world!",
    jobs: async () => getJobs(),
  },

  Job: {
    date: (job) => {
      return toIsoDate(job.createdAt);
    },
    company: (job) => {
      return getCompany(job.companyId);
    },
  },
};

function toIsoDate(value) {
  return value.slice(0, "yyyy-mm-dd".length);
}
