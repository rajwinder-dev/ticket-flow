import { faker } from "@faker-js/faker";
import { prisma } from "../../src/core/utils/prismaClient";

export async function getDepartmentId(department?: string) {
  const data = await prisma.departments.findFirst(
    department ? { where: { department } } : undefined // or just {}
  );
  return data?.id;
}

export async function getEmployeeId() {
  const data = await prisma.employees.findFirst({
    where: {
      email: "test@gmail.com",
    },
  });
  return data?.id;
}
export async function getRandomEmployee(index?: number) {
  const data = await prisma.employees.findMany();
  return data[index || 0];
}
export async function getRandomRole(index?: number) {
  const data = await prisma.roles.findMany();
  return data[index || 0];
}
export async function getRandomAuth(index?: number) {
  const data = await prisma.authorization.findMany({
    where: {
      Roles: {
        name: "employee",
      },
    },
  });
  return data[index || 0];
}
export async function getRandomDepartment(index?: number) {
  const data = await prisma.departments.findMany();
  return data[index || 0];
}
export async function getRoleId() {
  const data = await prisma.roles.findUnique({
    where: {
      name: "testRole",
    },
  });
  return data?.id;
}
export async function getNewEmployeeData(department?: string) {
  const departmentId = await getDepartmentId(department);
  return {
    uuid: String(faker.finance.creditCardNumber()),
    gender: faker.person.sex(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    nationalId: faker.string.numeric({ length: { min: 5, max: 10 } }),
    idType: faker.string.alpha(10),
    email: faker.internet.email(),
    phoneNumber: faker.phone.number({ style: "international" }),
    dateOfBirth: faker.date.birthdate().toISOString().split("T")[0],
    address: faker.location.streetAddress(),
    hireDate: faker.date.past().toISOString().split("T")[0],
    jobTitle: "test job",
    description: "added for testing",
    departmentId: departmentId,
  };
}
export async function testCatchAsync(
  callback: () => Promise<void>,
  errorStack?: boolean
) {
  try {
    await callback();
  } catch (error) {
    if (errorStack === true) return console.error(error);
  }
}
