
import prisma from '../../core/database';

export const getAllCustomers = async () => {
  return await prisma.customer.findMany();
};

export const getCustomerById = async (id: number) => {
  return await prisma.customer.findUnique({
    where: { id },
  });
};

export const createCustomer = async (customerData: any) => {
    return await prisma.customer.create({
      data: customerData,
    });
  };

export const updateCustomer = async (id: number, customerData: any) => {
  return await prisma.customer.update({
    where: { id },
    data: customerData,
  });
};

export const deleteCustomer = async (id: number) => {
  return await prisma.customer.delete({
    where: { id },
  });
};
