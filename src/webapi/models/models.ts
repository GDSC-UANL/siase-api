import { Request } from "express";

export interface TokenPayload {
    user: string
    trim: string
    loginDate: number
}

