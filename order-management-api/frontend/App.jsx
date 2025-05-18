import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  const [status, setStatus] = useState({});

  useEffect(() => {
    async function fetchStatus() {
      const res = await fetch('/health');
      const json = await res.json();
      setStatus(json);
    }
    fetchStatus();
  }, []);

  return (
    <div>
      <h1>Status dos Serviços</h1>
      <ul>
        <li>PostgreSQL: {status.database}</li>
        <li>Kafka: {status.kafka}</li>
        <li>Elasticsearch: {status.elasticsearch}</li>
        <li>Zookeeper: {status.zookeeper}</li>
      </ul>
    </div>
  );
}
