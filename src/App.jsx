import { useState } from 'react';
import axios from 'axios';
import { ShieldCheck, ShieldAlert, Activity } from 'lucide-react';
import './App.css';

function App() {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('Ready to send requests...');
  const [requestCount, setRequestCount] = useState(0);

  const testRateLimiter = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/data');
      setStatus('success');
      setMessage(`Success: ${res.data.data} (IP: ${res.data.ip})`);
      setRequestCount(prev => prev + 1);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        setStatus('blocked');
        setMessage(error.response.data.detail);
      } else {
        setStatus('error');
        setMessage('Backend connection failed! Is Uvicorn running?');
      }
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1>GateGuard Control Panel</h1>
      <p style={{ color: '#888', marginBottom: '2rem' }}>Enterprise API Rate Limiter Testing</p>

      <div style={{ margin: '2rem 0', padding: '3rem 2rem', border: '1px solid #333', borderRadius: '12px', backgroundColor: '#1a1a1a' }}>
        {status === 'idle' && <Activity size={56} color="#888" style={{ margin: '0 auto' }} />}
        {status === 'success' && <ShieldCheck size={56} color="#4ade80" style={{ margin: '0 auto' }} />}
        {status === 'blocked' && <ShieldAlert size={56} color="#f87171" style={{ margin: '0 auto' }} />}
        {status === 'error' && <ShieldAlert size={56} color="#facc15" style={{ margin: '0 auto' }} />}

        <h3 style={{ marginTop: '1.5rem', color: status === 'blocked' ? '#f87171' : '#fff' }}>
          {message}
        </h3>
        <p style={{ color: '#aaa' }}>Total Successful Requests: {requestCount}</p>
      </div>

      <button
        onClick={testRateLimiter}
        style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer', borderRadius: '8px', backgroundColor: '#646cff', color: 'white', border: 'none', fontWeight: 'bold' }}
      >
        Send API Request
      </button>
    </div>
  );
}

export default App;