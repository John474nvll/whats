
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CompanyForm } from '@/components/crm/CompanyForm';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetch('/api/crm/companies')
      .then((res) => res.json())
      .then((data) => setCompanies(data));
  }, []);

  const handleFormSubmit = (company) => {
    const method = company.id ? 'PUT' : 'POST';
    const url = company.id ? `/api/crm/companies/${company.id}` : '/api/crm/companies';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(company),
    })
      .then((res) => res.json())
      .then((updatedCompany) => {
        if (company.id) {
          setCompanies(companies.map((c) => (c.id === updatedCompany.id ? updatedCompany : c)));
        } else {
          setCompanies([...companies, updatedCompany]);
        }
        setIsFormOpen(false);
      });
  };

  const handleDelete = (id) => {
    fetch(`/api/crm/companies/${id}`, {
      method: 'DELETE',
    }).then(() => {
      setCompanies(companies.filter((c) => c.id !== id));
    });
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Companies</CardTitle>
          <Button onClick={() => {
            setSelectedCompany(null);
            setIsFormOpen(true);
          }}>New Company</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{company.website}</TableCell>
                  <TableCell>{company.phone}</TableCell>
                  <TableCell>{company.address}</TableCell>
                  <TableCell>
                    <Button onClick={() => {
                      setSelectedCompany(company);
                      setIsFormOpen(true);
                    }}>Edit</Button>
                    <Button onClick={() => handleDelete(company.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {isFormOpen && (
        <CompanyForm
          company={selectedCompany}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default Companies;
