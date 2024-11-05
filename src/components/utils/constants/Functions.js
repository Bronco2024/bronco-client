export const FormatDateTimestampToDate = (timestamp) => {
    if (timestamp && timestamp.seconds) {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString('he-IL');
    }
    return '';
};