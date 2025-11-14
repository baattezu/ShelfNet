export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  roles?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export default User;
