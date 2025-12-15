import mongoose from "mongoose";
export const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enums: ['commander', 'logistics_personnel', 'military_personnel']
    },
});
export const UserModel = mongoose.model('users', UserSchema);
//# sourceMappingURL=User.js.map