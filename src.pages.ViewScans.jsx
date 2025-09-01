import { useEffect, useState } from 'react';
import { getScans, getPDF } from '../utils/api';

export default function ViewScans({ token }) {
  const [scans, setScans] = useState([]);

  useEffect(() => {
    getScans(token).then(res => setScans(res.data));
  }, []);

  const handleDownload = async (id) => {
    const res = await getPDF(id, token);
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `scan_${id}.pdf`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div>
      {scans.map(scan => (
        <div key={scan.id}>
          <h3>{scan.patient_name} ({scan.patient_id})</h3>
          <p>{scan.scan_type} - {scan.region}</p>
          <img src={scan.image_url} width={100} />
          <button onClick={() => handleDownload(scan.id)}>Download PDF</button>
        </div>
      ))}
    </div>
  );
}
