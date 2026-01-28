import React from 'react';

const RiskHistoryTable = ({ riskHistory }) => {
  if (!riskHistory || riskHistory.length === 0) return <p>No risk history found.</p>;

  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-gray-200">
          <th className="border px-2 py-1">Date</th>
          <th className="border px-2 py-1">Risk Score</th>
          <th className="border px-2 py-1">Risk Level</th>
        </tr>
      </thead>
      <tbody>
        {riskHistory.map((r) => (
          <tr key={r.id}>
            <td className="border px-2 py-1">{new Date(r.calculated_at).toLocaleDateString()}</td>
            <td className="border px-2 py-1">{r.risk_score}</td>
            <td className="border px-2 py-1">{r.risk_level}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RiskHistoryTable;
