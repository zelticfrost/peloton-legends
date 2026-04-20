const FLAG_MAP: Record<string, string> = {
  "Slovenia": "si",
  "Denmark": "dk",
  "Belgium": "be",
  "Netherlands": "nl",
  "France": "fr",
  "Spain": "es",
  "Italy": "it",
  "Great Britain": "gb",
  "USA": "us",
  "Australia": "au",
  "Colombia": "co",
  "Eritrea": "er",
  "Norway": "no",
  "Switzerland": "ch",
  "Ecuador": "ec"
};

export function getFlagUrl(nationality: string): string | null {
  const code = FLAG_MAP[nationality];
  if (!code) return null;
  return `https://flagcdn.com/w40/${code}.png`;
}
