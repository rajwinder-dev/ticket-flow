const StarRating = ({ rating = 0, max = 5 }) => {
  return (
    <div className="flex items-center gap-1 justify-center">
      {Array.from({ length: max }).map((_, index) => (
        <span key={index} className={index < rating ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      ))}
    </div>
  );
};
export default StarRating
