export class AppError extends Error {
  errno: number;
  httpStatus: number;
  constructor(err: number, statusCode: number, message: string, name: string) {
      super();
      this.errno = err;
      this.httpStatus = statusCode;
      this.message = message;
      this.name = name;
  }
}
export function getAppError(err): Error {
  switch (err.code) {
      case 'ENOTFOUND':
      case 'ER_ACCESS_DENIED_ERROR': return new MySqlAccessDenied();
      case 'ER_DUP_ENTRY': return new DuplicateEntry();
      default: return null;
  }
}
export class InternalServerError extends AppError { constructor() { super(0, 500, 'Erreur sur serveur!', 'InternalServerError'); } }
export class NotFound extends AppError { constructor() { super(1, 404, 'Aucune donnée trouvée!', 'NotFound'); } }
export class NotUpdated extends AppError { constructor() { super(2, 409, 'Aucune mise à jour effectuée!', 'NotUpdated'); } }
export class NotInserted extends AppError { constructor() { super(3, 409, 'Aucun ajout effectuée!', 'NotInserted'); } }
export class NotDeleted extends AppError { constructor() { super(4, 409, 'Aucune suppression effectuée!', 'NotDeleted'); } }
export class NotValidRestMethod extends AppError { constructor() { super(5, 405, 'Erreur method REST!', 'NotValidRestMethod'); } }
export class NotValidApiUrl extends AppError { constructor() { super(6, 405, 'Erreur ApiUrl inexistante!', 'NotValidApiUrl'); } }
export class NotConnected extends AppError { constructor() { super(7, 401, 'Vous n\'êtes pas connectée!', 'NotConnected'); } }
export class MySqlAccessDenied extends AppError { constructor() { super(8, 403, 'Connection à la base de donnée refusée!', 'MySqlAccessDenied'); } }
export class NoValidXrsfTocken extends AppError { constructor() { super(9, 403, 'XrsfTocken non valide!', 'NoValidXrsfTocken'); } }
export class NoValidUser extends AppError { constructor() { super(10, 401, 'Utilisateur non valide!', 'NoValidUser'); } }
export class DuplicateEntry extends AppError { constructor() { super(11, 409, 'Enregistrement déjà existant!', 'DuplicateEntry'); } }
