// utils/flags.ts
type Currency = { flag: number; code: string; name: string };

const currencies: Record<string, Currency> = {
  au: {
    flag: require("@/assets/flags/au.webp"),
    code: "AUD",
    name: "Australian Dollar",
  },
  br: {
    flag: require("@/assets/flags/br.webp"),
    code: "BRL",
    name: "Brazilian Real",
  },
  ca: {
    flag: require("@/assets/flags/ca.webp"),
    code: "CAD",
    name: "Canadian Dollar",
  },
  ch: {
    flag: require("@/assets/flags/ch.webp"),
    code: "CHF",
    name: "Swiss Franc",
  },
  cn: {
    flag: require("@/assets/flags/cn.webp"),
    code: "CNY",
    name: "Chinese Yuan",
  },
  cz: {
    flag: require("@/assets/flags/cz.webp"),
    code: "CZK",
    name: "Czech Koruna",
  },
  dk: {
    flag: require("@/assets/flags/dk.webp"),
    code: "DKK",
    name: "Danish Krone",
  },
  eu: { flag: require("@/assets/flags/eu.webp"), code: "EUR", name: "Euro" },
  gb: {
    flag: require("@/assets/flags/gb.webp"),
    code: "GBP",
    name: "British Pound",
  },
  hk: {
    flag: require("@/assets/flags/hk.webp"),
    code: "HKD",
    name: "Hong Kong Dollar",
  },
  hu: {
    flag: require("@/assets/flags/hu.webp"),
    code: "HUF",
    name: "Hungarian Forint",
  },
  id: {
    flag: require("@/assets/flags/id.webp"),
    code: "IDR",
    name: "Indonesian Rupiah",
  },
  in: {
    flag: require("@/assets/flags/in.webp"),
    code: "INR",
    name: "Indian Rupee",
  },
  is: {
    flag: require("@/assets/flags/is.webp"),
    code: "ISK",
    name: "Icelandic Króna",
  },
  jp: {
    flag: require("@/assets/flags/jp.webp"),
    code: "JPY",
    name: "Japanese Yen",
  },
  kr: {
    flag: require("@/assets/flags/kr.webp"),
    code: "KRW",
    name: "South Korean Won",
  },
  mx: {
    flag: require("@/assets/flags/mx.webp"),
    code: "MXN",
    name: "Mexican Peso",
  },
  my: {
    flag: require("@/assets/flags/my.webp"),
    code: "MYR",
    name: "Malaysian Ringgit",
  },
  no: {
    flag: require("@/assets/flags/no.webp"),
    code: "NOK",
    name: "Norwegian Krone",
  },
  nz: {
    flag: require("@/assets/flags/nz.webp"),
    code: "NZD",
    name: "New Zealand Dollar",
  },
  ph: {
    flag: require("@/assets/flags/ph.webp"),
    code: "PHP",
    name: "Philippine Peso",
  },
  pl: {
    flag: require("@/assets/flags/pl.webp"),
    code: "PLN",
    name: "Polish Złoty",
  },
  ro: {
    flag: require("@/assets/flags/ro.webp"),
    code: "RON",
    name: "Romanian Leu",
  },
  se: {
    flag: require("@/assets/flags/se.webp"),
    code: "SEK",
    name: "Swedish Krona",
  },
  sg: {
    flag: require("@/assets/flags/sg.webp"),
    code: "SGD",
    name: "Singapore Dollar",
  },
  th: {
    flag: require("@/assets/flags/th.webp"),
    code: "THB",
    name: "Thai Baht",
  },
  tr: {
    flag: require("@/assets/flags/tr.webp"),
    code: "TRY",
    name: "Turkish Lira",
  },
  us: {
    flag: require("@/assets/flags/us.webp"),
    code: "USD",
    name: "US Dollar",
  },
  za: {
    flag: require("@/assets/flags/za.webp"),
    code: "ZAR",
    name: "South African Rand",
  },
};

export function getFlag(code: string): number {
  return (currencies[code.toLowerCase()] ?? currencies.us).flag; // fallback to US flag
}

export function getCurrencyName(code: string): string {
  return (currencies[code.toLowerCase()] ?? currencies.us).name; // fallback to US Dollar
}
