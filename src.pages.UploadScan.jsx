import { useState } from 'react';
import { uploadScan } from '../utils/api';

export default function UploadScan({ token }) {
  const [form, setForm] = useState({ patient_name:'', patient_id:'', scan_type:'RGB', region:'Frontal', scan:null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    try {
      await uploadScan(formData, token);
      alert('Scan uploaded successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Patient Name" onChange={e => setForm({...form, patient_name:e.target.value})} />
      <input placeholder="Patient ID" onChange={e => setForm({...form, patient_id:e.target.value})} />
      <select onChange={e => setForm({...form, scan_type:e.target.value})}>
        <option>RGB</option>
      </select>
      <select onChange={e => setForm({...form, region:e.target.value})}>
        <option>Frontal</option>
        <option>Upper Arch</option>
        <option>Lower Arch</option>
      </select>
      <input type="file" onChange={e => setForm({...form, scan:e.target.files[0]})} />
      <button type="submit">Upload</button>
    </form>
  );
}
