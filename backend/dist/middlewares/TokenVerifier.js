import jwt from "jsonwebtoken";
import "dotenv/config";
export default function TokenVerifier(req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(403).json({
                message: "authentication token expired",
                success: false
            });
        }
        const userData = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = userData.id;
        req.email = userData.email;
        req.role = userData.role;
        req.baseId = userData.baseId;
        next();
    }
    catch (err) {
        return res.status(403).json({
            message: "invalid token",
            success: false
        });
    }
}
//# sourceMappingURL=TokenVerifier.js.map