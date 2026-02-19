export const getMessages = async (req, res) => {
    res.json({ messages: [] });
};

export const sendMessage = async (req, res) => {
    res.json({ message: "Message sent" });
};
