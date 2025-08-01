const bcrypt = require('bcryptjs');
const Agent = require('../models/Agent');



const createAgent = async (req, res) => {
    const { name, email, mobileNumber, password } = req.body;

    try {
        let agent = await Agent.findOne({ email });
        if (agent) {
            return res.status(400).json({ message: 'Agent with this email already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        agent = new Agent({
            name,
            email,
            mobileNumber,
            password: hashedPassword,
        });

        await agent.save();
        res.status(201).json({ message: 'Agent created successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getAgents = async (req, res) => {
    try {
        const agents = await Agent.find().select('-password'); // Exclude password field
        res.json(agents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { createAgent, getAgents };