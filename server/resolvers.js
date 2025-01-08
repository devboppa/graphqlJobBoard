import { getJob, getJobs } from "./db/jobs.js";
import { getCompany } from "./db/companies.js";
export const resolvers = {
  Query: {
    greeting: () => "Hello world!",
    jobs: () => getJobs(),
    job: (_root, { id }) => {
      console.log("id received is: ", id);
      return getJob(id);
    },
  },

  Job: {
    date: (job) => {
      return toIsoDate(job.createdAt);
    },
    company: (job) => getCompany(job.companyId),
  },
};

function toIsoDate(value) {
  return value.slice(0, "yyyy-mm-dd".length);
}
