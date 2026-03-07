import { format } from "date-fns";

interface props {
  data: {
    id: string
    title: string;
    message: string;
    date: string;
    target: { type: string; value: string };
    attachment?: string | null;
    announcedBy: string;
  };
}
const AnnouncementCard = ({ data }: props) => {
  return (
    <div className="rounded-xl border border-gray-300 bg-white p-5 shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-purple-700">{data.title}</h3>
        <span className="text-sm text-gray-500">
          {format(new Date(data.date), "dd MMM yyyy")}
        </span>
      </div>

      <div className="mt-1 text-sm text-gray-600">
        {getAudienceLabel(data.target)} • Announced by  {data.announcedBy}
        <span className="font-medium text-gray-900">{data.announcedBy}</span>
      </div>

      <p className="mt-3 text-base text-gray-800">{data.message}</p>

      {data.attachment && (
        <a
          href={data.attachment}
          className="mt-3 inline-block text-sm text-blue-600 underline hover:text-blue-800"
          download
        >
          📎 Download Attachment
        </a>
      )}
    </div>
  );
};

export default AnnouncementCard;
const getAudienceLabel = (target: { type: string; value: string }) => {
  switch (target.type) {
    case "all":
      return "📢 Everyone";
    case "role":
      return `👤 Role: ${target.value}`;
    case "department":
      return `🏢 Department: ${target.value}`;
    default:
      return "Unknown";
  }
};
