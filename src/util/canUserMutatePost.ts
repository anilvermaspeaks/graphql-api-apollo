import { Context } from ".."
import errorHandler from '../prisma-client-exception.filter';
interface ICanUserMutatePost {
    userId: number,
    postId: number
    prisma: Context["prisma"];
}

export const canUserMutatePost = async ({
    userId,
    postId,
    prisma
}) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
    
        if (!user) {
            return {
                userErrors: [{ message: "user not authorize to perform this action" }]
            }
        }
    
        const post = await prisma.post.findUnique({
            where: {
                id: +postId
            }
        })
    
        if (post?.authorId !== user.id) {
            return {
                userErrors: [{ message: "user not authorize to perform this action" }]
            }
        }
    } catch (error) {
        errorHandler('post/update/delete', error)
    }

}