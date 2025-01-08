import { useParams } from "react-router";
import { getCompany } from "../lib/graphql/queries";
import { useEffect, useState } from "react";
import JobList from "../components/JobList";
function CompanyPage() {
  const { companyId } = useParams();
  const [company, setCompany] = useState();
  useEffect(() => {
    async function fetchCompany(id) {
      const c = await getCompany(id);
      setCompany(c);
      console.log("our company is: ", c);
    }
    fetchCompany(companyId);
  }, [companyId]);

  return (
    <div>
      {company ? (
        <>
          <h1 className="title">{company.name}</h1>
          <div className="box">{company.description}</div>
          <h2 className="title is-5">Jobs at {company.name}</h2>
          <JobList jobs={company.jobs} />
        </>
      ) : (
        <>Loading...</>
      )}
    </div>
  );
}

export default CompanyPage;
