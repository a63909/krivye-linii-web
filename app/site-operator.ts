import settings from "../config/site-operator.json";

type SiteOperator = {
  published: boolean;
  name: string;
  taxId: string | null;
  address: string | null;
  serviceArea: string | null;
};

const profile: SiteOperator = settings;

export const siteOperator = profile.published ? profile : null;

export function operatorRequisites(): [string, string][] {
  if (!siteOperator) return [];

  const rows: [string, string][] = [["Исполнитель", siteOperator.name]];
  if (siteOperator.taxId) rows.push(["ИНН", siteOperator.taxId]);
  if (siteOperator.address) rows.push(["Адрес", siteOperator.address]);
  rows.push(["Электронная почта", "web@curvedlines.ru"]);
  return rows;
}
