import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import User from "../models/User";
import dbConnect from "./dbConnect";




export const authOptions = {
    session: {
        strategy: "jwt",
    },

    providers: [
        CredentialsProvider({
            async authorize(credentials, req) {
                await dbConnect();
                const { email, password } = credentials;
                console.log(credentials , 'credentias');
                const user = await User.findOne({ email });
                if (!user) {
                    throw new Error("Invalid name or password");
                }
                console.log(user , 'user');

                if (!user?.password) {
                    throw new Error("Please login via the method you used to signup");
                }
                const isPasswordMatched = await bcrypt.compare(
                    password,
                    user?.password
                );
                if (!isPasswordMatched) {
                    throw new Error("Invalid email or password");
                }
            return user;
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
    signIn: "/login",
    },
   
}