import TimeAgo from 'javascript-time-ago';
import fr from 'javascript-time-ago/locale/fr.json';

TimeAgo.addDefaultLocale(fr);
const timeAgo = new TimeAgo('fr-FR');

export default function getFormattedTime(time: string | number | Date) {
  return timeAgo.format(new Date(time));
}