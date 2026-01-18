
import { Switch, Route } from "wouter";
import CRMDashboard from "./Dashboard";
import CRMUsers from "./Users";
import CRMCompanies from "./Companies";
import CRMContacts from "./Contacts";
import CRMDeals from "./Deals";
import NotFound from "@/pages/not-found";

export default function CRMRoutes() {
  return (
    <Switch>
      <Route path="/crm" component={CRMDashboard} />
      <Route path="/crm/users" component={CRMUsers} />
      <Route path="/crm/companies" component={CRMCompanies} />
      <Route path="/crm/contacts" component={CRMContacts} />
      <Route path="/crm/deals" component={CRMDeals} />
      <Route component={NotFound} />
    </Switch>
  );
}
