import axios from "axios";

const fetchOrgStats = async (filter) => {
  const response = await axios.get(
    `${process.env.ORG_SERVICE_BASE_URL}/orgs/analytics?filter=${filter}`
  );
  return response.data;
};

export default fetchOrgStats;
