export async function createUser(request) {
	
}

export const getUsers = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};