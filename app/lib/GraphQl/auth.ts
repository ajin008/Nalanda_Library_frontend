import { signupProp } from "../api/auth";

export const signupUserGraphQL = async (data: signupProp) => {
  const finalData = { ...data, role: "user" };

  const query = `
    mutation RegisterUser($name: String!, $email: String!, $password: String!, $role: String!){
    registerUser(name:$name, email:$email, password:$password,role:$role){
    id name  email role}
    }`;

  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query,
      variables: finalData,
    }),
  });

  return result.json();
};
