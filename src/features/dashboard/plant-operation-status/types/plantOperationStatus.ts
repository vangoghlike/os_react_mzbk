export type PlantOperationBankStatus = {
  name: string;
  status: string;
  dAccm: string;
  kw: string;
  pf: string;
};

export type PlantOperationInfoRow = {
  label: string;
  value: string;
};

export type PlantOperationPanel = {
  title: string;
  rows: PlantOperationInfoRow[];
};
