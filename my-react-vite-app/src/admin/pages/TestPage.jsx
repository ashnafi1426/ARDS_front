const TestPage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Test Page</h1>
      <p>This is a simple test page to verify admin routing works.</p>
      <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0' }}>
        <h2>User Management Test</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#ddd' }}>
              <th style={{ padding: '8px', border: '1px solid #ccc' }}>ID</th>
              <th style={{ padding: '8px', border: '1px solid #ccc' }}>Name</th>
              <th style={{ padding: '8px', border: '1px solid #ccc' }}>Email</th>
              <th style={{ padding: '8px', border: '1px solid #ccc' }}>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ccc' }}>1</td>
              <td style={{ padding: '8px', border: '1px solid #ccc' }}>John Doe</td>
              <td style={{ padding: '8px', border: '1px solid #ccc' }}>john@example.com</td>
              <td style={{ padding: '8px', border: '1px solid #ccc' }}>Student</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ccc' }}>2</td>
              <td style={{ padding: '8px', border: '1px solid #ccc' }}>Jane Smith</td>
              <td style={{ padding: '8px', border: '1px solid #ccc' }}>jane@example.com</td>
              <td style={{ padding: '8px', border: '1px solid #ccc' }}>Advisor</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestPage;