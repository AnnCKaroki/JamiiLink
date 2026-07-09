'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client'; // Importing your custom client wrapper

export default function AdminApprovalPortal() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    async function fetchPendingUsers() {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role, is_approved')
        .eq('is_approved', false);

      if (!error && data) {
        setPendingUsers(data);
      }
      setLoading(false);
    }
    fetchPendingUsers();
  }, [actionMessage]);


  async function handleApprove(userId) {
    setLoading(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        is_approved: true,
        approved_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      setActionMessage(`Error: ${error.message}`);
    } else {
      setActionMessage('Success! Profile updated and family member approved.');
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
    }
    setLoading(false);
  }

  if (loading) return <div style={{ padding: '20px' }}>Analyzing system clearance matrix...</div>;

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>🛡️ Security Gateway: Admin Approval Portal</h1>
      <p>The following registered accounts are waiting for localized clearance to view family trees and directories.</p>

      {actionMessage && (
        <div style={{ backgroundColor: '#e2e8f0', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>
          {actionMessage}
        </div>
      )}

      {pendingUsers.length === 0 ? (
        <p style={{ color: 'green', fontWeight: 'bold' }}>✓ No pending approval requests found. The platform gateway is secure.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', textAlign: 'left' }}>
              <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>Full Name</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>Initial System Role</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>Action Authorization</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map((user) => (
              <tr key={user.id}>
                <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>{user.full_name}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}><span style={{ backgroundColor: '#fee2e2', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{user.role}</span></td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>
                  <button
                    onClick={() => handleApprove(user.id)}
                    style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Grant Access Clearance
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
