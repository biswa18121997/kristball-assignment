import prisma from '../utils/prisma.js';
export default async function VerifyLogin(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: 'email and password are required',
                success: false
            });
        }
        const userDB = await prisma.user.findUnique({
            where: { email }
        });
        if (userDB) {
            if (userDB.hashedPassword != password)
                return res.status(401).json({
                    message: 'invalid password',
                    success: false
                });
            req.email = email;
            // @ts-ignore
            req.password = password;
            next();
        }
        else {
            return res.status(404).json({
                message: 'user not found',
                success: false
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'internal server error',
            success: false
        });
    }
}
//# sourceMappingURL=VerifyLogin.js.map