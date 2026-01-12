
import prisma from '../../core/database';

export const getAllCustomers = async () => {
  return await prisma.customer.findMany();
};

export const createCustomer = async (customerData: any) => {
    return await prisma.customer.create({
      data: customerData,
    });
  };