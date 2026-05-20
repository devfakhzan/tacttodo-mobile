export type User = {
  id: string;
  email: string;
};

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

export type AuthPayload = {
  token: string;
  user: User;
};
