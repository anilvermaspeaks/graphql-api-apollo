import { Context } from '../../index';
import { User, Prisma } from '@prisma/client';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import { JWTTOKENSIGNATURE } from '../../secrets'

import errorHandler from '../../prisma-client-exception.filter';


interface createUser {
    email: string;
    name: string;
    bio: string;
    password: string;
}

interface IAuthPayload {
    userErrors: {}[];
    token: String | null;
}

export const authMutations = {
    userCreate: async (_, { email, name, password, bio }: createUser, { prisma }: Context): Promise<IAuthPayload> => {
        try {
            if (!(validator.isEmail(email))) {
                return {
                    token: null,
                    userErrors: [{ message: 'Please enter correct email address' }]
                }
            }

            if (!(validator.isLength(password))) {
                return {
                    token: null,
                    userErrors: [{ message: 'Please enter Passowrd with atleast length 5' }]
                }
            }

            if (!name || !bio) {
                return {
                    token: null,
                    userErrors: [{ message: 'please add name and bio correctly!!!' }]
                }
            }

            const hashedPassword = await bcrypt.hash(password, 10);


            const user = await prisma.user.create({
                data:
                    { email, password: hashedPassword, name }
            })

            await prisma.profile.create({
                data:
                    { bio, userId: user.id }
            })


            const token = await JWT.sign({
                email: user.email,
                userId: user.id
            }, JWTTOKENSIGNATURE, {
                expiresIn: 360000
            })
            return {
                token: token,
                userErrors: []
            }
        } catch (error) {
            errorHandler('user.create', error)
        }

    },

    userLogin: async (_, { email, password }: createUser, { prisma }: Context): Promise<IAuthPayload> => {
      
        try {
            const user = await prisma.user.findUnique({ where: { email } })
            if (!user) {
                return {
                    userErrors: [{ message: 'invalid credentials' }],
                    token: null
                }
            }
            const isMatch = await bcrypt.compare(password, user.password);
            
            if(!isMatch){
                return {
                    userErrors: [{ message: 'invalid credentials' }],
                    token: null
                }
            }
            const token = await JWT.sign({
                email: user.email,
                userId: user.id
            }, JWTTOKENSIGNATURE, {
                expiresIn: 360000
            })
            return {
                userErrors: [],
                token: token
            }
        } catch (error) {
            errorHandler('userLogin', error) 
        }


    }
}
