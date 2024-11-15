import { toObjectId } from 'monarch-orm';
import { collections } from '../../db';

export const getNotes = async () => {
    const notes = await collections.notes.find().exec();
    console.log({ notes })
    return notes
}


export const getNoteById = async (id: string) => {
    const formattedId = toObjectId(id)
    if (!formattedId) return
    const note = await collections.notes.findOne({ _id: formattedId }).exec();
    if (!note) return
    console.log({ note })
    return note
}


export const createNote = async ({ title, content, userId }: { title: string, content: string, userId: string }) => {
    const formattedUserId = toObjectId(userId);
    if (!formattedUserId) return;

    const note = await collections.notes.insertOne({
        title,
        content,
        userId: formattedUserId
    }).exec();

    console.log({ note });
    return note;
}
