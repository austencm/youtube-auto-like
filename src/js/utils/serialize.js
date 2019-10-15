export default function serialize(obj) {
  return Object.keys(obj).map(k => `${encodeURIComponent(k)}: ${encodeURIComponent(obj[k])}`).join(encodeURI(','));
}
