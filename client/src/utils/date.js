export function formatLocalDate(date) {
  if (!date) return "";

  const d = new Date(date);

  if (isNaN(d)) return "";

  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}