import { Post } from '@prisma/client';
import {Context} from '../../index';
import errorHandler from '../../prisma-client-exception.filter';
interface IPostArgs {
    post:{
        title: string;
        content: string
    }
}

interface IPostPayload {
    userErrors: {}[];
    post: Post | null;
}

export const postMutations = {

    postCreate: async (_, {post}: IPostArgs, {prisma}: Context): Promise<IPostPayload> => {
     try {
        const { title, content}= post
        // validation step
        if(!title || !content)
          return {
      userErrors :[{message: "title and content required"}],
      post: null
          }
        return {
          userErrors :[],
          post: await prisma.post.create({
              data:{
                  title,
                  content,
                  authorId: 1
              }
            })
              }
     } catch (error) {
        errorHandler('postCreate', error)
     }
    },

    postUpdate: async (_, {post, postId} : {post: IPostArgs["post"], postId: string}, {prisma}: Context): Promise<IPostPayload> => {
       try {
        const { title, content}= post
        // validation step
        if(!title && !content)
          return {
      userErrors :[{message: "Atleast update something to proceed"}],
      post: null
          }
          const existingPost = await prisma.post.findUnique({where:{id:Number(postId)}})
          if(!existingPost){
              return {
                  userErrors :[{message: "Post does not exist"}],
                  post: null
                      } 
          }
  
          let payloadToUpdate = {
              title,
              content
          }
          if(!title){
              delete payloadToUpdate.title
          }
          if(!content){
              delete payloadToUpdate.content
          }
        return {
          userErrors :[],
          post: await prisma.post.update({
              data:{ ...payloadToUpdate }
              , 
              where: {
                  id:Number(postId)
              }
            })
              }
       } catch (error) {
        errorHandler('postUpdate', error)
       }
    },

    postDelete: async (_, {postId} : { postId: string}, {prisma}: Context): Promise<IPostPayload> => {
       try {
        const post = await prisma.post.findUnique({where:{id:Number(postId)}})
        if(!post){
            return {
                userErrors :[{message: "Post does not exist"}],
                post: null
                    } 
        }
        await prisma.post.delete({
            where: {
                id:Number(postId)
            }
          })
      return {
        userErrors :[],
        post
            }
       } catch (error) {
        errorHandler('postDelete', error)
       }
    },

}