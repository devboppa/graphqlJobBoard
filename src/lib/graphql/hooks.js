import { useQuery, useMutation } from "@apollo/client";
import {
  companyByIdQuery,
  createJobMutation,
  jobsQuery,
  jobByIdQuery,
} from "../../lib/graphql/queries";

export function useCompany(id) {
  const { data, loading, error } = useQuery(companyByIdQuery, {
    variables: {
      id,
    },
  });
  return {
    company: data?.company,
    loading,
    error: Boolean(error),
  };
}

export function useJobs() {
  const { data, loading, error } = useQuery(jobsQuery, {
    fetchPolicy: "network-only",
  });
  return {
    jobs: data?.jobs || [],
    loading,
    error: Boolean(error),
  };
}

export function useJob(id) {
  const { data, loading, error } = useQuery(jobByIdQuery, {
    variables: {
      id: id,
    },
  });
  return {
    job: data?.job,
    loading,
    error: Boolean(error),
  };
}

export function useCreateJob() {
  const [mutate, { loading }] = useMutation(createJobMutation);

  async function createJob(title, description) {
    const {
      data: { job },
    } = await mutate({
      variables: {
        input: {
          title,
          description,
        },
      },
      update: (cache, { data }) => {
        console.log("[createJob] result: ", data);
        cache.writeQuery({
          query: jobByIdQuery,
          variables: { id: data.job.id },
          data,
        });
      },
    });
    return job;
  }

  return {
    createJob,
    loading,
  };
}
