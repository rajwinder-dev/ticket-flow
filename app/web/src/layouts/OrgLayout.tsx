import { useGlobalContext } from '@/context/GlobalContext';
import OrganizationPage from '@/features/organization/pages/OrganizationPage';
import TicketEditDialog from '@/features/ticket/components/TicketEditDialog';
import { TicketEscalateDialog } from '@/features/ticket/components/TicketEscalateDialog';
import { useOrganizations, useTicketStore } from '@org/core';
import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router';

const OrgLayout = () => {
  const { orgId } = useParams();
  const {
    selectedTicket,
    handleCloseTicketForm,
    handlcloseEscalateForm,
    editTicketForm,
    escalateTicketForm,
  } = useTicketStore();
  const { setOrgId } = useGlobalContext();
  useEffect(() => {
    if (orgId) setOrgId(orgId);
  }, [orgId]);
  const { organizations } = useOrganizations({ orgId });
  const isExist = organizations?.data.find((org) => org.id === orgId);
  if (!isExist) return <OrganizationPage />;

  return (
    <>
      {selectedTicket && (
        <TicketEditDialog
          open={editTicketForm}
          setOpen={handleCloseTicketForm}
          ticket={selectedTicket}
        />
      )}
      {selectedTicket && (
        <TicketEscalateDialog
          open={escalateTicketForm}
          setOpen={handlcloseEscalateForm}
          ticket={selectedTicket}
        />
      )}
      <Outlet />
    </>
  );
};

export default OrgLayout;
