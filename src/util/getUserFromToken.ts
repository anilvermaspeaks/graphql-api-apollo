
import JWT from 'jsonwebtoken';
import { JWTTOKENSIGNATURE} from "../secrets";

export const getUserFromToken = async (token:string)=>{
   try {
   return await JWT.verify(token, JWTTOKENSIGNATURE) as { userId: number}
   } catch (error) {

    return null;
}
};
