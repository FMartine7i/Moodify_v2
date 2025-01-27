import bcrypt from 'bcrypt';
import User from '../models/user_schema.js';
const registerUser = async (req, res) => {
    try {
        const { email, username, password, profilePicture } = req.body;
        // validar que el email o el user no existan
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser)
            return res.status(400).json({ error: 'El usuario o el email ya existen' });
        // hashear password
        const hashedPassword = await bcrypt.hash(password, 10);
        //crear nuevo usuario
        const newUser = new User({
            email,
            username,
            password: hashedPassword,
            profilePicture
        });
        await newUser.save();
        res.status(201).json({ message: 'Usuario creado exitosamente', user: { email, username, profilePicture: newUser.profile_picture } });
    }
    catch (err) {
        console.error('Error al registrar nuevo usuario', err);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
};
export { registerUser };
