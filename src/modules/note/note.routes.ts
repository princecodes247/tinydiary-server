import { Router } from 'express';
import { hasAuth } from '../auth/auth.middleware';
import { createNewNoteController, fetchNotesController, getNoteController } from './note.controller';


const noteRouter = Router();

noteRouter.get('/notes', fetchNotesController);
noteRouter.post('/notes', hasAuth, createNewNoteController);
noteRouter.get('/notes/:id', getNoteController);

export default noteRouter;
