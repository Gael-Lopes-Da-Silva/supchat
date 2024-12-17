import React, { useEffect, useState } from 'react';

const DashboardPage = () => {
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
 // on foutra la logique pour fetch les workspaces ici
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
      {/* On va mapper les workspaces ici*/}  { }
      </div>
    </div>
  );
};

export default DashboardPage;
