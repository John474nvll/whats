
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ContactForm } from '@/components/crm/ContactForm';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetch('/api/crm/contacts')
      .then((res) => res.json())
      .then((data) => setContacts(data));
  }, []);

  const handleFormSubmit = (contact) => {
    const method = contact.id ? 'PUT' : 'POST';
    const url = contact.id ? `/api/crm/contacts/${contact.id}` : '/api/crm/contacts';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    })
      .then((res) => res.json())
      .then((updatedContact) => {
        if (contact.id) {
          setContacts(contacts.map((c) => (c.id === updatedContact.id ? updatedContact : c)));
        } else {
          setContacts([...contacts, updatedContact]);
        }
        setIsFormOpen(false);
      });
  };

  const handleDelete = (id) => {
    fetch(`/api/crm/contacts/${id}`, {
      method: 'DELETE',
    }).then(() => {
      setContacts(contacts.filter((c) => c.id !== id));
    });
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
          <Button onClick={() => {
            setSelectedContact(null);
            setIsFormOpen(true);
          }}>New Contact</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>{contact.platform}</TableCell>
                  <TableCell>
                    <Button onClick={() => {
                      setSelectedContact(contact);
                      setIsFormOpen(true);
                    }}>Edit</Button>
                    <Button onClick={() => handleDelete(contact.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {isFormOpen && (
        <ContactForm
          contact={selectedContact}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default Contacts;
