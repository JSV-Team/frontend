import { useEffect, useState } from "react";
import { getActivities } from "../api/activityApi";

function Activities() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const loadActivities = async () => {
      const data = await getActivities();
      setActivities(data);
    };

    loadActivities();
  }, []);

  return (
    <div>
      <h2>Activities</h2>

      {activities.map((item) => (
        <div key={item.id}>
          <h3>{item.name}</h3>
        </div>
      ))}
    </div>
  );
}

export default Activities;