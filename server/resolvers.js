import { getJob, getJobs, getJobsByCompany } from "./db/jobs.js";
import { getCompany } from "./db/companies.js";
export const resolvers = {
  Query: {
    greeting: () => "Hello world!",
    jobs: () => getJobs(),
    job: (_root, { id }) => {
      console.log("job id received is: ", id);
      return getJob(id);
    },
    company: (_root, { id }) => {
      console.log("company id received is: ", id);
      return getCompany(id);
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
};

function toIsoDate(value) {
  return value.slice(0, "yyyy-mm-dd".length);
}
