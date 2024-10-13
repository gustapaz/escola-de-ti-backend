import { Campaign } from '../../../campanha/domain/entities/campaign.entity';

export interface Objective {
  id: string;
  id_campanha: string;
  titulo: string;
  descricao: string;
  premio_associado: number;
  meta: number;
  campanha?: Campaign;
}
