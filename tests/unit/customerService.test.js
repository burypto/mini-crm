const customerService = require('../../src/services/customerService');
const { Customer } = require('../../src/models');


jest.mock('../../src/models', () => ({
  Customer: {
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn()
  },
  logger: {
    info: jest.fn()
  }
}));

describe('CustomerService Unit Tests (Mock/Stub)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createCustomer -> Telefon zaten varsa hata fırlatmalı (Stub)', async () => {
    
    Customer.findOne.mockResolvedValue({ id: 1, phone: '905321112233' });

    await expect(customerService.createCustomer({ phone: '905321112233' }))
      .rejects.toThrow('Bu telefon numarasıyla kayıtlı bir müşteri zaten var.');
    
    expect(Customer.findOne).toHaveBeenCalledTimes(1);
  });

  test('createCustomer -> Yeni müşteri başarıyla oluşturulmalı (Mock)', async () => {
  
    Customer.findOne.mockResolvedValue(null);
    Customer.create.mockResolvedValue({ id: 2, firstName: 'Test' });

    const result = await customerService.createCustomer({ firstName: 'Test', phone: '905320000000' });

    expect(result.firstName).toBe('Test');
    expect(Customer.create).toHaveBeenCalledWith(expect.objectContaining({ firstName: 'Test' }));
  });
});
