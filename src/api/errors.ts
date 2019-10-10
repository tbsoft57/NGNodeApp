import { AppError } from './_lib/appError';
export * from './_lib/appError';

export class myError extends AppError { constructor() { super(100, 500, 'Erreur de test!', 'myError'); } }
