// update with scoring as necessary

export class User {
    constructor (username, email) {
        this.username = username;
        this.email = email;
        this.friendList = [];
    }
    toString() {
        return this.username;
    }
}

// Firestore data converter
export const userConverter = {
    toFirestore: (user) => {
        return {
            username: user.username,
            email: user.email,
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new User(data.username, data.email, data.friendList);
    }
};