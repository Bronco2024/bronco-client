export const FormatDateTimestampToDate = (timestamp) => {
    if (timestamp && timestamp.seconds) {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString('he-IL');
    }
    return '';
};

export const IsDateNowGreaterThanAdDate = (adAvailableUntil) => {
    try {
        const timeOfAd = adAvailableUntil.toDate();
        const now = new Date();
        return now.getTime() > timeOfAd.getTime()
    } catch (error) {
        console.error(error)
    }
}