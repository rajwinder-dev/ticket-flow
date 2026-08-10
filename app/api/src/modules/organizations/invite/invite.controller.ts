import { InviteUserOrganizationInput } from '@org/zod';
import { catchAsync } from '../../../core/utils/catchAsync';
import response from '../../../core/utils/response';
import { InviteService } from './invite.service';

class InviteControllerClass {
  sendInvite = catchAsync(async (req, res, _next) => {
    const { email, roleId } = req.body as InviteUserOrganizationInput;
    await InviteService.inviteMember({
      actor: {
        userId: req.user.id,
        email: req.user.email,
        username: req.user.username,
        organizationName: req.organization.name,
      },
      input: {
        organizationId: req.organization.id,
        email,
        roleId,
      },
    });
    response(res, { message: 'Invite Sent successfully' });
  });
  acceptInvite = catchAsync(async (req, res, _next) => {
    const token = req.params.token as string;
    const verifyToken = await InviteService.acceptInvite(
      req.user.id,
      req.user.email,
      token,
    );
    response(res, verifyToken, 200, {
      otherFields: { message: 'Joined Organization successfully' },
    });
  });
  InviteDetails = catchAsync(async (req, res, _next) => {
    const token = req.params.token as string;
    const data = await InviteService.getInviteDetails(token);
    response(res, data, 200);
  });
}
export const InviteController = new InviteControllerClass();
