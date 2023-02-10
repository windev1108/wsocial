import 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: User;
    }

    interface User {
        id: string;
        email: string;
        image: string;
        name: string;
    }
}
