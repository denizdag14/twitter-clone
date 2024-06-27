import NextAuth from "next-auth";
import { getFirestore, collection, addDoc, setDoc, doc, serverTimestamp, getDoc } from "firebase/firestore";
import { app } from "@/firebase";
import GoogleProvider from 'next-auth/providers/google';

const db = getFirestore(app);

const handler = NextAuth({
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async session({session, token}){
            const userRef = doc(db, "users", token.sub);
            const userDoc = await getDoc(userRef);
            if (!userDoc.exists()) {
                await setDoc(userRef, {
                    headerImage: 'https://fakeimg.pl/600x200/1da1f2/ffffff?text=twitter+clone',
                    image: session.user.image,
                    name: session.user.name,
                    email: session.user.email,
                    bio: '',
                    created_time: serverTimestamp(),
                    username: session.user.email.split('@')[0].toLocaleLowerCase(),
                    uid: token.sub,
                });
            }
            session.user.username = session.user.email.split('@')[0].toLocaleLowerCase();
            session.user.uid = token.sub;
            return session;
        }
    }
});

export { handler as GET, handler as POST};