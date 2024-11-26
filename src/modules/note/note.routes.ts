import { Router } from 'express';
import { hasAuth } from '../auth/auth.middleware';
import { createNewNoteController, deleteNoteController, fetchNotesController, getNoteController } from './note.controller';


const noteRouter = Router();

noteRouter.get('/notes', hasAuth, fetchNotesController);
noteRouter.post('/notes', hasAuth, createNewNoteController);
noteRouter.get('/notes/:id', getNoteController);
noteRouter.delete('/notes/:id', deleteNoteController)

export default noteRouter;
