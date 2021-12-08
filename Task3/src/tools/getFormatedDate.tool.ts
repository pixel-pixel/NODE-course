export default function(date = new Date()) {
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}