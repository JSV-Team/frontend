const API_URL = "http://localhost:3001/api";

export const getActivities = async () => {
  const res = await fetch(`${API_URL}/activities`);
  return res.json();
};

export const getPendingActivities = async (userId) => {
  const res = await fetch(`${API_URL}/pending-activities?userId=${userId}`);
  return res.json();
};

export const joinActivity = async (data) => {
  const res = await fetch(`${API_URL}/activities/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
};

export const deletePendingActivity = async (id) => {
  const res = await fetch(`${API_URL}/pending-activities/${id}`, {
    method: "DELETE"
  });

  return res.json();
};