import axios from "axios";

const fetchOrgStats = async (filter = "weekly", token) => {
  try {
    const response = await axios.get(
      `${process.env.ORG_SERVICE_BASE_URL}/analytics?filter=${filter}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Org stats:", error.message);
    return [];
  }
};

export default fetchOrgStats;
