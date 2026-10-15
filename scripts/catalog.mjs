import { readFile } from 'node:fs/promises';

export function isHttps(value) {
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; } catch { return false; }
}
export function validateCatalog(catalog) {
  if (catalog.schemaVersion !== 1 || !Array.isArray(catalog.games) || !catalog.company?.id) throw Error('Unsupported or incomplete studio catalogue');
  const date = value => !value || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value) && Number.isFinite(Date.parse(value));
  if (!catalog.updatedAt || !date(catalog.updatedAt)) throw Error('Invalid catalogue update date');
  const ids = new Set(), bundles = new Set();
  for (const game of catalog.games) {
    if (!game.id || ids.has(game.id)) throw Error(`Duplicate/missing game id: ${game.id}`);
    ids.add(game.id);
    if (!['released', 'concept', 'coming-soon'].includes(game.releaseStatus)) throw Error(`Invalid release status: ${game.id}`);
    if (!Array.isArray(game.bundleIds) || !Array.isArray(game.links)) throw Error(`Missing arrays: ${game.id}`);
    for (const id of game.bundleIds) { if (!id || bundles.has(id)) throw Error(`Duplicate/missing bundle id: ${id}`); bundles.add(id); }
    if (!isHttps(game.image) || (game.storeUrl && !isHttps(game.storeUrl))) throw Error(`Invalid game URL: ${game.id}`);
    for (const link of game.links) if (!isHttps(link.url)) throw Error(`Invalid store link: ${game.id}`);
    for (const url of game.screenshots || []) if (!isHttps(url)) throw Error(`Invalid screenshot: ${game.id}`);
    const promo = game.promotion;
    if (!promo || !Number.isInteger(promo.priority) || [game.releasedAt, game.updatedAt, promo.startsAt, promo.endsAt].some(value => !date(value))) throw Error(`Invalid date/promotion: ${game.id}`);
    if (promo.startsAt && promo.endsAt && promo.startsAt >= promo.endsAt) throw Error(`Invalid promotion window: ${game.id}`);
    if (!game.title?.fa || !game.title?.en) throw Error(`Missing title: ${game.id}`);
  }
  const company = catalog.company;
  for (const value of [company.websiteUrl, company.logoUrl, company.wordmarkUrl, company.identityBoardUrl].filter(Boolean)) if (!isHttps(value)) throw Error('Invalid company URL');
  if (!Array.isArray(company.socialLinks)) throw Error('Missing social links');
  for (const link of company.socialLinks) if (!link.id || !isHttps(link.url)) throw Error('Invalid social link');
  return catalog;
}
export function isPromoted(game, surface, now = new Date()) {
  const p = game.promotion;
  return !!(p?.enabled && p[surface] && (!p.startsAt || Date.parse(p.startsAt) <= +now) && (!p.endsAt || +now < Date.parse(p.endsAt)));
}
export function selectGames(catalog, surface, currentBundleId = '', now = new Date()) {
  const field = {website:'showOnWebsite',apps:'showInApps',links:'showOnLinks'}[surface];
  if (!field) throw Error('Unknown catalogue surface');
  return catalog.games.filter(g => g.enabled && g[field] && (surface === 'website' || g.releaseStatus === 'released' && g.storeUrl) && (!currentBundleId || !g.bundleIds.includes(currentBundleId)))
    .sort((a,b) => Number(isPromoted(b,surface,now))-Number(isPromoted(a,surface,now)) || (isPromoted(a,surface,now) ? b.promotion.priority-a.promotion.priority : 0) || (Date.parse(b.releasedAt)||0)-(Date.parse(a.releasedAt)||0) || a.id.localeCompare(b.id, 'en'));
}
export async function loadCatalog() { return validateCatalog(JSON.parse(await readFile(new URL('../data/studio.v1.json', import.meta.url), 'utf8'))); }
