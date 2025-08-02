import axios from "axios";

const fetchUserStats = async (filter) => {
  const response = await axios.get(
    `${process.env.USER_SERVICE_BASE_URL}/users/analytics?filter=${filter}`
  );
  return response.data;
};

export default fetchUserStats;
