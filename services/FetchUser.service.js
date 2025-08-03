import axios from "axios";

const fetchUserStats = async (filter = "weekly", token) => {
  try {
    const response = await axios.get(
      `${process.env.USER_SERVICE_BASE_URL}/analytics?filter=${filter}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user stats:", error.message);
    return [];
  }
};

export default fetchUserStats;
