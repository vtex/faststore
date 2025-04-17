interface ClientProfileData {
  id: string
  email: string
  firstName: string
  lastName: string
  documentType: string
  document: string
  phone: string
  corporateName: string | null
  tradeName: string | null
  corporateDocument: string | null
  stateInscription: string | null
  corporatePhone: string | null
  isCorporate: boolean
  userProfileId: string
  customerClass: string | null
}

export const clientProfileData: ClientProfileData = {
  id: 'clientProfileData',
  email: 'contact@stellarcorp.com',
  firstName: 'John',
  lastName: 'Smith',
  documentType: 'cnpj',
  document: '12345678000199',
  phone: '+1 (555) 123-4567',
  corporateName: 'Stellar Corp',
  tradeName: 'Stellar',
  corporateDocument: '12345678000199',
  stateInscription: null,
  corporatePhone: '+1 (555) 123-4567',
  isCorporate: true,
  userProfileId: '5a3692de-358a-4bea-8885-044bce33bb93',
  customerClass: null,
}
