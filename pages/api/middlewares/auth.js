import {hash, compare} from 'bcryptjs';


export async function hashPassowrd(password) {
  const hashedPassword = await hash(password, 12);
  console.log(hashedPassword);
  return hashedPassword;
}

export async function verifyPassword(password, hashedPassword){
  const isValid = await compare(password, hashedPassword);
  return isValid;
}
