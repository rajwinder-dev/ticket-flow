import { faker } from '@faker-js/faker';
import { readableId } from '../../core/utils/utils';
import { ResentEmailWebhookSchema } from '@org/zod';

export function getOrgantionMock() {
  const organization = faker.company.name();
  return {
    name: organization,
    slug: slugify(organization),
    type: 'PERSONAL',
    description: faker.lorem.sentence(),
    teamSize: faker.datatype.number({ min: 1, max: 10 }),
  } as const;
}
export function getRoleMock() {
  return {
    name: faker.person.jobTitle(),
    description: faker.lorem.sentence(),
    code: readableId('ROL'),
  } as const;
}
export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-') // spaces/underscores → -
    .replace(/[^\w-]+/g, '') // remove special characters
    .replace(/--+/g, '-') // collapse multiple -
    .replace(/^-+|-+$/g, ''); // trim -
}
export function getRandomUser() {
  return {
    username: faker.internet.userName(),
    email: `${crypto.randomUUID()}@${faker.internet.domainName()}.com`,
    password: faker.internet.password(),
    phone: `+${faker.number.int({ min: 1, max: 99 })}${faker.string.numeric(9)}`,
  };
}

export function getRandomResendMock({
  email,
  type = 'email.delivered',
}: {
  email: string;
  type?: 'email.delivered';
}) {
  const payload: ResentEmailWebhookSchema = {
    type,
    created_at: faker.date.recent().toISOString(),
    data: {
      email_id: faker.string.uuid(),
      created_at: faker.date.recent().toISOString(),
      from: faker.internet.email(),
      to: [email],
      cc: faker.helpers.multiple(() => faker.internet.email(), {
        count: { min: 0, max: 2 },
      }),
      bcc: faker.helpers.multiple(() => faker.internet.email(), {
        count: { min: 0, max: 2 },
      }),
      message_id: `<${faker.string.uuid()}@${faker.internet.domainName()}>`,
      subject: faker.lorem.sentence(),
      attachments: faker.helpers.multiple(
        () => ({
          id: faker.string.uuid(),
          filename: faker.system.fileName(),
          content_type: faker.helpers.arrayElement([
            'application/pdf',
            'image/png',
            'image/jpeg',
            'text/plain',
          ]),
          content_disposition: faker.helpers.arrayElement([
            'inline',
            'attachment',
          ]) as 'inline' | 'attachment',
          ...(faker.datatype.boolean()
            ? { content_id: faker.string.uuid() }
            : {}),
        }),
        { count: { min: 0, max: 2 } },
      ),
    },
  };
  const headers = {
    'svix-id': faker.datatype.string(),
    'svix-timestamp': faker.datatype.string(),
    'svix-signature': faker.datatype.string(),
  };
  return { payload, headers } as const;
}
