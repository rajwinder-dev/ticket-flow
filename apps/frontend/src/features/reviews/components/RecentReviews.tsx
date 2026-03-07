// RecentReviews.jsx

import ReviewCard from "../../../components/ui/ReviewCard";
const data = [
  {
    srNo: 1,
    department: "HR",
    goal: "Improve Communication Skills",
    goalId: "G101",
    assignedTo: "Alice Johnson",
    assignedBy: "Bob Smith",
    task: "Improve Communication Skills",
    review: {
      data: "Excellent progress in team meetings.",
      rating: 4,
      type: "goal",
    },
    reviewBy: "manager",
  },
  {
    srNo: 2,
    department: "IT",
    goal: "Enhance System Security",
    goalId: "G102",
    assignedTo: "Mark Lee",
    assignedBy: "Susan Clark",
    task: "Update firewall rules and conduct audit",
    review: {
      data: "Security protocols have improved, but report needs refinement.",
      rating: 3,
      type: "goal",
    },
    reviewBy: "admin",
  },
  {
    srNo: 3,
    department: "Finance",
    goal: "Reduce Budget Overruns",
    goalId: "G103",
    assignedTo: "Tina Brown",
    assignedBy: "Robert Miles",
    task: "Implement expense tracking system",
    review: {
      data: "Cost reduction achieved, but tracking still manual.",
      rating: 2,
      type: "goal",
    },
    reviewBy: "manager",
  },
  {
    srNo: 4,
    department: "Marketing",
    goal: "Increase Social Media Engagement",
    goalId: "G104",
    assignedTo: "John Carter",
    assignedBy: "Emily Watson",
    task: "Develop and post weekly content",
    review: {
      data: "Social media reach has increased significantly.",
      rating: 5,
      type: "goal",
    },
    reviewBy: "admin",
  },
  {
    srNo: 5,
    department: "Operations",
    goal: "Optimize Workflow Efficiency",
    goalId: "G105",
    assignedTo: "Rachel Green",
    assignedBy: "Tom Holland",
    task: "Map and improve process chain",
    review: {
      data: "Great workflow charts, but implementation pending.",
      rating: 3,
      type: "task",
    },
    reviewBy: "manager",
  },
];

const RecentReviews = () => {
  return (
    <div className="flex flex-col gap-6">
      {data.map((item) => (
        <ReviewCard data={item} key={item.srNo}/>
      ))}
    </div>
  );
};

export default RecentReviews;

// components/StarRating.jsx
