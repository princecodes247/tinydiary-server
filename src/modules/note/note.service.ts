import { toObjectId } from 'monarch-orm';
import { collections, TNoteInput } from '../../db';

export const getNotes = async (page = 1, limit = 10) => {
    const notes = await collections.notes.find().skip((page - 1) * 10).limit(limit).populate({
        owner: true,
        contributors: true,
    }).exec();
    const count = await collections.notes.countDocuments()
    console.log({ notes })
    return { data: notes, meta: { total: count } }
}


export const getNoteById = async (id: string) => {
    const formattedId = toObjectId(id)
    if (!formattedId) return
    const note = await collections.notes.findOne({ _id: formattedId }).populate({
        owner: true
    }).exec();
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
        owner: formattedUserId,
        contributors: [formattedUserId]
    }).exec();

    console.log({ note });
    return note;
}

export const deleteNote = async (id: string) => {
    const formattedUserId = toObjectId(id);
    await collections.notes.findOneAndDelete({ _id: formattedUserId }).exec()
}