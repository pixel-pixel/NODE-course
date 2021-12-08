import Roles from "../enums/Roles.enum";

type User = {
    _id: string
    email: string
    password: string
    role: Roles
}

export type { User }