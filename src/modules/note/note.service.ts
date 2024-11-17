import { toObjectId } from 'monarch-orm';
import { collections, TNoteInput } from '../../db';

export const getNotes = async (page = 1, limit = 10) => {
    const notes = await collections.notes.find().skip((page - 1) * 10).limit(limit).exec();
    const count = await collections.notes.countDocuments()
    console.log({ notes })
    return { data: notes, meta: { total: count } }
}


export const getNoteById = async (id: string) => {
    const formattedId = toObjectId(id)
    if (!formattedId) return
    const note = await collections.notes.findOne({ _id: formattedId }).exec();
    if (!note) return
    console.log({ note })
    return note
}


export const createNote = async (inputData: TNoteInput) => {
    const formattedUserId = toObjectId(inputData.owner);
    if (!formattedUserId) return;

    const note = await collections.notes.insertOne({
        title: inputData.title,
        content: inputData.content,
        owner: formattedUserId
    }).exec();

    console.log({ note });
    return note;
}
