import { Post } from '@prisma/client';
import {Context} from '../index';

interface IPostCreate {
    title: string;
    content: string;
}

interface IPostPayload {
    userErrors: {}[];
    post: Post | null;
}

export const Mutation = {
    postCreate: async (_, {title, content}: IPostCreate, {prisma}: Context): Promise<IPostPayload> => {
      // validation step
      if(!title || !content)
        return {
    userErrors :[{message: "title and content required"}],
    post: null
        }
     const post = await prisma.post.create({
        data:{
            title,
            content,
            authorId: 1
        }
      })
      return {
        userErrors :[],
        post: post
            }
    }
  }