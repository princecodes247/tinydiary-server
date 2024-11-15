import { Router } from 'express'
import { AuthenticatedRequest } from '../../types'
import { createNote, getNoteById, getNotes } from './note.service'

const noteRoutes = Router()

// Fetch current authenticated note
noteRoutes.get('/notes', async (
    req: AuthenticatedRequest,
    res,
    next
) => {
    try {
        const notes = await getNotes()
        res.send(notes)
    } catch (error) {
        next(error)
    }
})

// Create a new note
noteRoutes.post('/notes', async (
    req: AuthenticatedRequest,
    res,
    next
) => {
    try {
        const noteData = req.body;
        const createdNote = await createNote(noteData);
        res.status(201).json(createdNote);
    } catch (error) {
        next(error);
    }
})

// Edit an existing note
noteRoutes.get('/notes/:id', async (
    req: AuthenticatedRequest,
    res,
    next
) => {
    try {
        const noteId = req.params.id;
        const note = await getNoteById(noteId);
        res.json(note);
    } catch (error) {
        next(error);
    }
})

export default noteRoutes
