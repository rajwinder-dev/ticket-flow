import EmailProviderForm from "../EmailproviderForm";
import SmtpFallbackForm from "../SmtpFallbackForm";

const GeneralTab = () => {
  return (
    <div className="flex flex-col gap-4">
      <EmailProviderForm />
      <SmtpFallbackForm />
    </div>
  );
};

export default GeneralTab;
