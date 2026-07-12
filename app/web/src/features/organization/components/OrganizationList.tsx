import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
interface props {
  organizations: {
    name: string;
    id: string;
    isOwner: boolean;
    logo?: string
  }[];
}
const OrganizationList = ({ organizations }: props) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {organizations.map((org) => (
        <Link to={`/org/${org.id}`} key={org.id}>
          <Card key={org.id} className="cursor-pointer p-4 grid grid-cols-[auto_1fr] items-center">
            <Avatar className="size-11">
                 <AvatarImage src={org.logo} alt={org.name} />
                  <AvatarFallback className="rounded-lg">{org.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <h3 className="text-foreground text-xl font-medium">{org.name}</h3>
              <p className="text-muted-foreground text-sm capitalize">{org.isOwner ? "owner" : "member"}</p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default OrganizationList;
