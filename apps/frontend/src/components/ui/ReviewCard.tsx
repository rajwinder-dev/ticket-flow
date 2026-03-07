import StarRating from "./StarRating";

interface type {
  data: {
    srNo: number;
    goal: string;
    department: string;
    review: { type: string; rating: number; data: string };
    assignedBy: string;
    assignedTo: string;
    reviewBy: string;
  };
}
const ReviewCard = ({ data }: type) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md transition hover:shadow-lg">
      <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
        <p>
          <span className="font-semibold text-gray-700">Sr:</span> {data.srNo}
        </p>
        <p>
          <span className="font-semibold text-gray-700">Department:</span>{" "}
          {data.department}
        </p>
      </div>

      <p className="text-lg font-semibold text-blue-700">
        {data.review.type}: <span className="text-gray-800">{data.goal}</span>
      </p>

      <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
        <p>
          <span className="font-medium">Assigned By:</span> {data.assignedBy}
        </p>
        <p>
          <span className="font-medium">To:</span> {data.assignedTo}
        </p>
      </div>

      <div className="mt-4 border-t pt-4">
        <div className="flex items-center justify-between">
          <StarRating rating={data.review.rating} />
          <p className="text-xs text-gray-400">Reviewed by: {data.reviewBy}</p>
        </div>
        <p className="mt-2 rounded-md bg-green-50 dark:bg-green-900 px-4 py-2 text-gray-800 dark:text-gray-800">
          {data.review.data}
        </p>
        <p className="mt-1 text-right text-xs text-gray-400">
          ReviewAt: 12/04/2024
        </p>
      </div>
    </div>
  );
};

export default ReviewCard;
