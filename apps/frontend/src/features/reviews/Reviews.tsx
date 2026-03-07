import MultiTabs from "../../components/ui/MultiTabs";
import RecentReviews from "./components/RecentReviews";
import ReviewHistory from "./components/ReviewHistory";
import ReviewOverview from "./components/ReviewOverview";

const elements = [
  { label: "Recent Reviews", component: <RecentReviews /> },
  { label: "Review history", component: <ReviewHistory /> },
];
const Reviews = () => {
  return (
    <div className="flex flex-col gap-4">
      <ReviewOverview />
      <MultiTabs elements={elements}  />
    </div>
  );
};

export default Reviews;
