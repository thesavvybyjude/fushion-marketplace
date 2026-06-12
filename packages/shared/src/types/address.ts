export interface Address {
  id: string;
  userId: string;
  label: string;
  firstName: string;
  lastName: string;
  phone: string;
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
}
