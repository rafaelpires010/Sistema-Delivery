import { TenantFuncionamento } from "./TenantFuncionamento";
import { TenantInfo } from "./TenantInfo";
import { Zone } from "./Zone";

export type Tenent = {
  id: number;
  slug: string;
  nome: string;
  main_color: string;
  second_color: string;
  img: string;
  OnClose: boolean;
  tenantInfo: TenantInfo;
  tenantFuncionamento: TenantFuncionamento;
  zone: Zone;
};
