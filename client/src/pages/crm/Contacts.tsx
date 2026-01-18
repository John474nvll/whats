
import React, { useState, useEffect } from 'react';

const CRMContacts: React.FC = () => {
  const [contacts, setContacts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/crm/contacts')
      .then(res => res.json())
      .then(data => setContacts(data));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">CRM Contacts</h1>
      <div className="bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contacts.map(contact => (
              <tr key={contact.id}>
                <td className="px-6 py-4 whitespace-nowrap">{contact.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{contact.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{contact.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">{contact.company?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CRMContacts;
