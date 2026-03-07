import { PieIcon } from "../../../components/ui/Icons";

function SenderMessage({
  message,
  image,
}: {
  message: string;
  image?: string;
}) {
  return (
    <div className="flex gap-4 py-4 justify-end items-end">
      <div className="px-4 py-2 rounded-md text-sm text-gray-800 bg-gary2 shadow-sm2 lg:max-w-1/2 border border-gray-200">
        <p className="text-gray-800">{message}</p>
      </div>
      {!image && (
        <div className="shadow-md rounded-full h-12 w-12 flex items-center justify-center bg-lightWhite cursor-pointer">
          <PieIcon />
        </div>
      )}
      {image && (
        <div className="shadow-md rounded-full h-12 w-12 flex items-center justify-center bg-lightWhite cursor-pointer overflow-hidden">
          <img src={image} className="fill" alt="image " />
        </div>
      )}
    </div>
  );
}
export default SenderMessage
