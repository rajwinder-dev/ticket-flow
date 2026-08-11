import { faker } from '@faker-js/faker';
import { readableId } from '../../core/utils/utils';

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
