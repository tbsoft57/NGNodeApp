import { environment } from '../../environments/environment';
import { User } from '../_models/user';

export const app = {
  production: environment.production,
  name: environment.appName,
  pageTitle: '',
  user: null
};
