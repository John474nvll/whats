
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Appointments = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const appointments = [
    { time: '10:00 AM', title: 'Meeting with Acme Inc.', contact: 'John Doe' },
    { time: '2:00 PM', title: 'Follow-up with SaaS Co.', contact: 'Jane Smith' },
    { time: '4:30 PM', title: 'Internal Strategy Session', contact: 'Team' },
  ];

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Appointments for {date?.toLocaleDateString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Contact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appt) => (
                  <TableRow key={appt.time}>
                    <TableCell>{appt.time}</TableCell>
                    <TableCell>{appt.title}</TableCell>
                    <TableCell>{appt.contact}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Appointments;
