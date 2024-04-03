import {Property} from 'csstype';
import {differenceInSeconds, parseISO} from 'date-fns';


function getFirstLettersOfWords(sentence: string): string {
    if (!sentence) {
        return 'N/A'
    }
    return sentence
        .split(' ')
        .map(word => word.charAt(0))
        .join('');
}

const avatarColors: Property.Color[] = [
    "red",
    "green",
    "blue",
    "purple",
    "orange",
    "yellow",
    "magenta",
    "greenyellow",
    "cyan",
    "tomato",
    "darkblue",
    "brown",
    "lime",
    "gold",
    "fuchsia",
]

function getAvatarBackgroundColor(groupId: number): Property.Color {
    const colorIndex = groupId % avatarColors.length
    return avatarColors[colorIndex]
}

function calculateAgeFromLastActivityAt(lastActivityAtString: string): string {
    const lastActivityAt = parseISO(lastActivityAtString)

    const ageSeconds = differenceInSeconds(Date.now(), lastActivityAt)

    const MINUTE_AS_SECONDS = 60
    const HOUR_AS_SECONDS = 60 * MINUTE_AS_SECONDS
    const DAY_AS_SECONDS = 24 * HOUR_AS_SECONDS
    const WEEK_AS_SECONDS = 7 * DAY_AS_SECONDS
    const MONTH_AS_SECONDS = 30.5 * DAY_AS_SECONDS
    const YEAR_AS_SECONDS = 365 * DAY_AS_SECONDS

    function getPluralEnding(value: number): string {
        return value > 1 ? 's' : ''
    }

    if (ageSeconds < 40) {
        return 'just now'
    }
    if (ageSeconds < HOUR_AS_SECONDS) {
        const minutes = Math.floor(ageSeconds / MINUTE_AS_SECONDS)
        return `${minutes} min` + getPluralEnding(minutes)
    }
    if (ageSeconds < DAY_AS_SECONDS) {
        const hours = Math.floor(ageSeconds / HOUR_AS_SECONDS)

        return `${hours} hour` + getPluralEnding(hours)
    }
    if (ageSeconds < WEEK_AS_SECONDS) {
        const days = Math.floor(ageSeconds / DAY_AS_SECONDS)
        return `${days} day` + getPluralEnding(days)
    }
    if (ageSeconds < MONTH_AS_SECONDS) {
        const weeks = Math.floor(ageSeconds / WEEK_AS_SECONDS)
        return `${weeks} week` + getPluralEnding(weeks)
    }
    if (ageSeconds < YEAR_AS_SECONDS) {
        const months = Math.floor(ageSeconds / MONTH_AS_SECONDS)
        return `${months} month` + getPluralEnding(months)
    }

    const years = Math.floor(ageSeconds / YEAR_AS_SECONDS)
    return `${years} year` + getPluralEnding(years)
}

export const GroupDisplayHelper = {
    getFirstLettersOfWords,
    getAvatarBackgroundColor,
    calculateAgeFromLastActivityAt,
}
