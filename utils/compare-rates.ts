export function getTimeSeriesForRate(days: string) {
  // today
  const endDate = new Date();
  let startDate = new Date();

  switch (days) {
    case "1d":
      startDate.setDate(endDate.getDate() - 1);
      break;
    case "7d":
      startDate.setDate(endDate.getDate() - 7);
      break;
    case "30d":
      startDate.setDate(endDate.getDate() - 30);
      break;
    case "90d":
      startDate.setDate(endDate.getDate() - 90);
      break;
    case "1y":
      startDate.setDate(endDate.getDate() - 365);
      break;
    case "max":
      startDate.setDate(0);
      break;
    default:
      startDate.setDate(endDate.getDate() - 1);
      break;
  }

  return {
    startDate: formatISODate(startDate.toISOString()),
    endDate: formatISODate(endDate.toISOString()),
  };
}

function formatISODate(date: string): string {
  return date.split("T").at(0) ?? date;
}

export function getCurrencyRateChange(
  quote: string,
  rates: Record<string, Record<string, number>> | undefined,
) {
  if (!rates) return 0;

  const ratesValue = Object.values(rates);
  const startRate = ratesValue[0];
  const endRate = ratesValue[ratesValue.length - 1];

  const rateChange =
    ((endRate[quote] - startRate[quote]) / startRate[quote]) * 100;

  return rateChange;
}
