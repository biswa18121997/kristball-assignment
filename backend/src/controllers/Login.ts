import jwt from "jsonwebtoken";
import type { Request, Response} from 'express';
import 'dotenv/config';
import prisma from '../utils/prisma.js'
export default async function Login(req : Request, res: Response) {
    try {
        

        const userData = await prisma.user.findUnique({
            where : {email : req.email},
            include: { base: true }
        });
        
        if (userData) {
            // simple password check (DB seeded with plain password for demo)--no hashing tools or libabyt has been used so thet checking of assignment is easier
            // @ts-ignore
            if (userData.hashedPassword !== req.password) {
                return res.status(401).json({
                    message: "invalid password",
                    success: false,
                });
            }

            const newToken = jwt.sign(
                {
                    id: userData.id,
                    email: req.email,
                    role: userData.role,
                    baseId: userData.baseId,
                },
                process.env.JWT_SECRET_KEY as string,
                { expiresIn: "1h" }
            );

            res.status(200).json({
                message: "login successful",
                success: true,
                token: newToken,
                userData: {
                    id: userData.id,
                    name: userData.name,
                    role: userData.role,
                    base: userData.base,
                },
            });
        } else {
            return res.status(404).json({
                message: "user not found",
                success: false,
            });
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message : 'internal server error',
            success : false
        })
    }
}