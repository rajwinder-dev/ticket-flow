import { VolumeIcon } from "../../components/ui/Icons";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import AnnouncementCard from "../../components/ui/AnnouncementCard";

const announcements = [
  {
    id: "a1",
    title: "Server Maintenance",
    message:
      "The system will be down for maintenance on 25th June from 1 AM to 3 AM.",
    date: "2025-06-24T15:00:00Z",
    target: { type: "role", value: "managers" },
    attachment: null,
    announcedBy: "Rajwinder",
  },
  {
    id: "a2",
    title: "New Leave Policy",
    message:
      "We’ve updated our leave policy. Please check the attached PDF for details.",
    date: "2025-06-20T12:00:00Z",
    target: { type: "department", value: "Science" },
    attachment: "/files/leave-policy.pdf",
    announcedBy: "Rajwinder",
  },
  {
    id: "a3",
    title: "Team Outing",
    message: "We’re planning a company-wide team outing next Friday!",
    date: "2025-06-18T12:00:00Z",
    target: { type: "all", value: "Everyone" },
    attachment: null,
    announcedBy: "Rajwinder",
  },
];

const Announcements = () => {
  return (
    <div className="p-4 flex flex-col gap-4 ">
      <PrimaryButton className="w-52">Create Announcement</PrimaryButton>
      <h2 className="mb-4 text-2xl font-bold flex gap-4 items-center"><VolumeIcon /> Announcements</h2>
      <div className="space-y-4">
        {announcements.map((item) => (
          <AnnouncementCard data={item} />
        ))}
      </div>
    </div>
  );
};

export default Announcements;
