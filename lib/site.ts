// Link para donar de monto libre (por ejemplo, Cafecito o un link de Mercado Pago). Mientras esté vacío, el botón
// "Colaborar" lleva a /colaborar.
export const DONATION_URL = "";

// Donaciones con Mercado Pago, de monto fijo: un "Link de pago" por monto (Mercado Pago → Tu negocio → Link de pago).
// Pegá cada link en url. Los que queden vacíos no se muestran.
export const DONATION_LINKS: { amount: string; url: string }[] = [
  { amount: "$1.000", url: "https://mpago.la/32b11FF" },
  { amount: "$3.000", url: "https://mpago.la/1UV8aC5" },
  { amount: "$10.000", url: "https://mpago.la/2u7SnXv" },
];

// Mail de contacto. Mientras esté vacío, el botón "Contacto" lleva a /creditos#contacto, que avisa que pronto estará.
export const CONTACT_EMAIL = "";
