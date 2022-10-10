export function filterPartnersByValue(partners, value) {
  const lowerCasedValue = value.toLowerCase();
  return value
    ? partners.filter(partner =>
        partner.name.toLowerCase().includes(lowerCasedValue)
      )
    : partners;
}
