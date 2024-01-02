import { authMutations } from "./auth";
import {postMutations} from "./post";




export const Mutation = {
    ...postMutations,
    ...authMutations
}