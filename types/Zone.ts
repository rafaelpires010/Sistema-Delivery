export type Zone = {
  maxDistanceKm: number; // Distância máxima para a zona
  fixedFee: number; // Taxa fixa de frete para a zona
  fixedDistanceKm: number; // Distância que a taxa fixa cobre sem adicional
  additionalKmFee: number; // Taxa adicional por quilômetro acima da distância fixa
};
