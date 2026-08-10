import { Router } from 'express';
import organizationRouter from './organization/organization.routes';
import inviteRouter from './invite/invite.routes';

const OrganizationModule: Router = Router();
OrganizationModule.use('/', organizationRouter);
OrganizationModule.use('/', inviteRouter);
export default OrganizationModule;
