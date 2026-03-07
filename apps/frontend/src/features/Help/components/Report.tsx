import { Input } from "../../../components/ui/Input";
import { PrimaryButton } from "../../../components/ui/PrimaryButton";
import { Textarea } from "../../../components/ui/TextArea";

const Report = () => {
  return (
    <div className="flex h-full items-center justify-center bg-white p-4 py-8">
      <div className="mx-auto flex w-[500px] flex-col items-center gap-4">
        <h3 className="text-2xl font-semibold">Report Issue</h3>
        <Input
          type="email"
          label="From: "
          disabled
          value={"Rajwindersxxx@gmail.com"}
        />
        <Input type="email" label="to: " disabled value={"support@tiven.xyz"} />
        <Input type="text" label="subject" placeholder="provde subject  " />
        <Textarea placeholder="write issue" label="Description" />
        <PrimaryButton>Send</PrimaryButton>
      </div>
    </div>
  );
};

export default Report;
