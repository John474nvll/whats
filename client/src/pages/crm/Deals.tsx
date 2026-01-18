
import React, { useState, useEffect } from 'react';

const CRMDeals: React.FC = () => {
  const [deals, setDeals] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/crm/deals')
      .then(res => res.json())
      .then(data => setDeals(data));
  }, []);

  const stages = ['Lead', 'Contacted', 'Proposal', 'Negotiation', 'Won', 'Lost'];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sales Pipeline</h1>
      <div className="flex space-x-4 overflow-x-auto">
        {stages.map(stage => (
          <div key={stage} className="flex-shrink-0 w-72 bg-gray-100 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">{stage}</h2>
            <div className="space-y-4">
              {deals.filter(deal => deal.stage === stage).map(deal => (
                <div key={deal.id} className="bg-white p-3 rounded-md shadow">
                  <p className="font-bold">{deal.title}</p>
                  <p className="text-sm text-gray-600">{deal.company?.name}</p>
                  <p className="text-sm font-medium">${deal.value.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CRMDeals;
