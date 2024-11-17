import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../../types';
import { createNote, getNoteById, getNotes } from './note.service';

// Fetch current authenticated notes
export const fetchNotesController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const notes = await getNotes();
        res.send(notes);
    } catch (error) {
        next(error);
    }
};

// Create a new note
export const createNewNoteController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const noteData = req.body;
        const createdNote = await createNote({
            ...noteData,
            owner: req.user?._id
        });
        res.status(201).json(createdNote);
    } catch (error) {
        next(error);
    }
};

// Get a note by ID
export const getNoteController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const noteId = req.params.id;
        const note = await getNoteById(noteId);
        res.json(note);
    } catch (error) {
        next(error);
    }
};
