import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: [true, "Email is required"], unique: [true, "Email already exists"] },
    password: { type: String, required: [true, "Password is required"] },
    fullname: { type: String },
    address: { type: String },
    phone: { type: String },
    role: { type: String, enum: ["customer", "admin"], default: "customer" }
}, {
    timestamps: true
})

const User = mongoose.model("User", userSchema);

export default User;