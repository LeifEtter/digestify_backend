const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
    AddFood,
}

async function AddFood(req, res) {
    try {
        const fooddata = await prisma.food.create({
            data: {
                id: req.body.id,
                name: req.body.name,
                description: req.body.description
            },
        })
        
        console.log(fooddata)

        return res
            .status(201)
            .json({msg: "Succesfully added the food item!"})
    } catch(error) {
        console.log(error)
        return res.status(400).json({ msg: "Couldn't add food item." });
    }
}