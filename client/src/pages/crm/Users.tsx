
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserForm } from '@/components/crm/UserForm';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetch('/api/crm/users')
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const handleFormSubmit = (user) => {
    const method = user.id ? 'PUT' : 'POST';
    const url = user.id ? `/api/crm/users/${user.id}` : '/api/crm/users';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((updatedUser) => {
        if (user.id) {
          setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
        } else {
          setUsers([...users, updatedUser]);
        }
        setIsFormOpen(false);
      });
  };

  const handleDelete = (id) => {
    fetch(`/api/crm/users/${id}`, {
      method: 'DELETE',
    }).then(() => {
      setUsers(users.filter((u) => u.id !== id));
    });
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <Button onClick={() => {
            setSelectedUser(null);
            setIsFormOpen(true);
          }}>New User</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Button onClick={() => {
                      setSelectedUser(user);
                      setIsFormOpen(true);
                    }}>Edit</Button>
                    <Button onClick={() => handleDelete(user.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {isFormOpen && (
        <UserForm
          user={selectedUser}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default Users;
