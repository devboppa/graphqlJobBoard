import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { formatDate } from "../lib/formatters";
import { useEffect, useState } from "react";
import { getJob } from "../lib/graphql/queries";

function JobPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState({});
  const [jobFound, setJobFound] = useState(false);

  useEffect(() => {
    async function fetchJob() {
      console.log("job id is: ", jobId);
      const j = await getJob(jobId);
      if (j) {
        setJob(j);
        setJobFound(true);
      }
    }

    fetchJob();
  }, [jobId]);

  return (
    <div>
      {jobFound ? (
        <>
          <h1 className="title is-2">{job.title}</h1>
          <h2 className="subtitle is-4">
            <Link to={`/companies/${job.company.id}`}>{job.company.name}</Link>
          </h2>
          <div className="box">
            <div className="block has-text-grey">
              Posted: {formatDate(job.date, "long")}
            </div>
            <p className="block">{job.description}</p>
          </div>
        </>
      ) : (
        <p>Job not found</p>
      )}
    </div>
  );
}

export default JobPage;
