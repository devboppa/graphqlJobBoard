import { connection } from "./connection.js";
import { generateId } from "./ids.js";

const getJobTable = () => connection.table("job");

export async function getJobs(limit, offset) {
  console.log("Limit:", limit, "Offset:", offset);
  let query = getJobTable().select().orderBy("createdAt", "desc");
  if (limit) {
    query.limit(limit);
    console.log("Hello...", query.toString());
  }
  if (offset) {
    query.offset(offset);
    console.log("Hello...", query.toString());
  }
  return await query;
}

export async function getJobsByCompany(companyId) {
  return await getJobTable().select().where({ companyId });
}

export async function getJob(id) {
  console.log("id received in getJob is: ", id);
  const query = getJobTable().where({ id }).first();
  console.log("Generated SQL Query:", query.toString());
  const job = await query;
  return job;
}

export async function createJob({ companyId, title, description }) {
  const job = {
    id: generateId(),
    companyId,
    title,
    description,
    createdAt: new Date().toISOString(),
  };
  await getJobTable().insert(job);
  return job;
}

export async function deleteJob(id, companyId) {
  const job = await getJobTable().first().where({ id, companyId });
  if (!job) {
    return null;
  }
  await getJobTable().delete().where({ id });
  return job;
}

export async function updateJob({ id, title, description, companyId }) {
  const job = await getJobTable().first().where({ id, companyId });
  if (!job) {
    return null;
  }
  const updatedFields = { title, description };
  await getJobTable().update(updatedFields).where({ id });
  return { ...job, ...updatedFields };
}
