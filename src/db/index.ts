import { createClient, createdAt, createDatabase, createSchema, InferSchemaInput, InferSchemaOutput, literal, objectId, string, updatedAt } from "monarch-orm";
import env from "../config";


const UserSchema = createSchema("users", {
    name: string(),
    email: string(),
    password: string(),
    accountType: literal("free", "paid"),
    createdAt: createdAt(),
    updatedAt: updatedAt()
})

export const _NoteSchema = createSchema("notes", {
    title: string(),
    content: string(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    owner: objectId()
})

const NoteSchema = _NoteSchema.relations(({ one }) => ({
    owner: one(UserSchema, "_id")
}))



const client = createClient(env.DB_URI)
const { collections, db } = createDatabase(client.db(), {
    users: UserSchema,
    notes: NoteSchema
});

export type TUser = InferSchemaOutput<typeof UserSchema>
export type TUserInput = InferSchemaInput<typeof UserSchema>

export type TNote = InferSchemaOutput<typeof NoteSchema>
export type TNoteInput = InferSchemaInput<typeof NoteSchema>
export { collections, db };
