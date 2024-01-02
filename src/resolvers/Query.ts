import { Context } from "..";

export const Query = {
    posts: async(_, __, {prisma}: Context) => {
return await prisma.post.findMany({
    orderBy: [{
        createdAt: "desc"
    }]
})

    },
  }