import {Context} from '../../index';
import { User, Prisma } from '@prisma/client';
import validator from 'validator';
import bcrypt from 'bcryptjs';

import errorHandler from '../../prisma-client-exception.filter';

interface createUser {
    email:string;
    name:string;
    bio:string;
    password:string;
}

interface IAuthPayload {
    userErrors: {}[];
    user: User | null;
}

export const authMutations ={
    userCreate: async (_, {email, name, password, bio}: createUser, {prisma}: Context): Promise<IAuthPayload> => {
   try {
    if(!(validator.isEmail(email))){
        return {
            user:null,
            userErrors:[{message:'Please enter correct email address'}]
        }
    }

    if(!(validator.isLength(password))){
        return {
            user:null,
            userErrors:[{message:'Please enter Passowrd with atleast length 5'}]
        }
    }

    if(!name || !bio){
        return {
            user:null,
            userErrors:[{message:'please add name and bio correctly!!!'}]
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10);



return {
    user: await prisma.user.create({data: 
        {email, password:hashedPassword, name}}),
    userErrors:[]
}
   } catch (error) {
     errorHandler('user.create', error)
   }
   
    }
}