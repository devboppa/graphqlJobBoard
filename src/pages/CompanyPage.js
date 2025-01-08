import { useQuery } from "@apollo/client";
import { useParams } from "react-router";
import { companyByIdQuery } from "../lib/graphql/queries";
import JobList from "../components/JobList";
function CompanyPage() {
  const { companyId } = useParams();
  const { data, loading, error } = useQuery(companyByIdQuery, {
    variables: {
      id: companyId,
    },
  });

  if (error) {
    return <>Data not available.</>;
  }
  if (loading) {
    return <>Loading...</>;
  }

  const { company } = data;

  return (
    <div>
      <>
        <h1 className="title">{company.name}</h1>
        <div className="box">{company.description}</div>
        <h2 className="title is-5">Jobs at {company.name}</h2>
        <JobList jobs={company.jobs} />
      </>
    </div>
  );
}

export default CompanyPage;
