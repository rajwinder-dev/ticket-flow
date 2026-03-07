import { PieIcon } from "../../../components/ui/Icons";

function ReceiverMessage({
  message,
  image,
}: {
  message: string;
  image?: string;
}) {
  return (
    <div className="flex gap-4 py-4">
      {!image && (
        <div className="bg-lightWhite flex h-12 w-12 cursor-pointer items-center justify-center rounded-full shadow-md">
          <PieIcon />
        </div>
      )}
      {image && (
        <div className="bg-lightWhite flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full shadow-md">
          <img src={image} className="fill" alt="image " />
        </div>
      )}
      <div className="from-gradient1 to-gradient2 shadow-sm2 flex items-center rounded-md border border-gray-200 bg-gradient-to-r px-4 py-2 text-sm text-gray-800 lg:max-w-1/2">
        <p className="text-gray-800">{message}</p>
      </div>
    </div>
  );
}
export default ReceiverMessage;
