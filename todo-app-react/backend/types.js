const zod = require("zod")

const createTodo = zod.object({
    title: zod.string(),
    description: zod.string()
})

const updateTodo = zod.object({
    id: zod.string()
})

const emailSchema = zod.string().email()
const passwordSchema = zod.string().min(6)

module.exports = {
    createTodo,
    updateTodo,
    emailSchema,
    passwordSchema
}