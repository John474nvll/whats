
import prisma from '../../core/database';

export const getAllCustomers = async () => {
  return await prisma.customer.findMany();
};
