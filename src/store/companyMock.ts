import type { CompanyDetails } from '../types/socialProfile';

// Mock company details
let companyDetails: CompanyDetails = {
  company_name: 'The King of Gym Equipment',
  logo_url: '/assets/logo.png', // TODO: Add actual logo
  phone: '7228800146',
  email: 'thekingofgymequipment@gmail.com',
  address: 'Shalin Sky, RO Water Plant, Ahmedabad, Gujarat – 380059',
  gst_number: '24AAAAA0000A1Z5',
  bank_details: {
    account_name: 'The King of Gym Equipment',
    account_number: 'XXXXXXXXXXXX',
    ifsc_code: 'XXXXXXXX',
    bank_name: 'Bank Name'
  },
  website_primary: 'https://thekingofgymequipment.com',
  website_secondary: 'https://thekingofgymequipment.net'
};

// Get company details
export function getMockCompanyDetails(): CompanyDetails {
  return { ...companyDetails };
}

// Update company details
export function updateMockCompanyDetails(updates: Partial<CompanyDetails>): CompanyDetails {
  companyDetails = {
    ...companyDetails,
    ...updates
  };
  return { ...companyDetails };
}
