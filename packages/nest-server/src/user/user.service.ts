import { Injectable } from '@nestjs/common';
import {User} from "./user.interface";

@Injectable()
export class UserService {
    users: User[] = []

    findAll() {
        return this.users
    }

    findOneById(id: string) {
        return this.users.find(user => user.id === id)
    }

    findOneBySocketId(socketId: string) {
        return this.users.find(user => user.socketId === socketId)
    }

    register(newUser: User) {
        this.users.push(newUser)
    }

    modify(modifiedUser: User): void {
        const userIdx = this.users.findIndex(user => user.id === modifiedUser.id)

        if (userIdx < 0) return;

        this.users[userIdx] = {
            ...this.users[userIdx],
            ...modifiedUser
        }
    }

    remove(id: string) {
        this.users = this.users.filter(user => user.id !== id)
    }
}
