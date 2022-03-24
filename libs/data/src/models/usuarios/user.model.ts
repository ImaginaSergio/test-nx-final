import { ApiItem, ApiFile } from '../common.model';
import { IProgreso, IProceso, ICurso, IProgresoGlobal, IExamen, IGrupo, IEmpresa } from '..';

export enum UserRolEnum {
  ADMIN = 'admin',
  SUPERVISOR = 'supervisor',
  PROFESOR = 'profesor',
  EDITOR = 'editor',
  ESTUDIANTE = 'estudiante',
}

export enum UserOrigenEnum {
  GOOGLE = 'google',
  RECOMENDADO = 'recomendado',
  FACEBOOK = 'facebook',
  PINTEREST = 'pinterest',
  TIKTOK = 'tiktok',
  INSTAGRAM = 'instagram',
  LINKEDIN = 'linkedin',
  YOUTUBE = 'youtube',
  TWITTER = 'twitter',
  TELEGRAM = 'telegram',
  WHATSAPP = 'whatsapp',
  FOROS = 'foros',
  PODCAST = 'podcast',
}

export interface IUser extends ApiItem {
  email: string;
  username: string;
  fullName: string;
  nombre?: string;
  apellidos?: string;

  pais: string;
  localidad: string;
  trabajoRemoto: boolean;
  posibilidadTraslado: boolean;
  onboardingCompletado: boolean;

  rol?: UserRolEnum;

  avatar?: ApiFile;
  remember_me_token?: string;
  progresoGlobal: IProgresoGlobal;

  preferencias?: any;

  origen?: UserOrigenEnum;

  empresa?: IEmpresa;
  grupos?: IGrupo[];
  cursos?: ICurso[];
  examenes?: IExamen[];
  procesos?: IProceso[];
  progresos?: IProgreso[];
  certificaciones?: any[];

  config2fa?: { secret: string; qr: string; uri: string };

  activo: boolean;

  meta?: { rutasCompletadas_list: number[]; rol?: UserRolEnum };
}
