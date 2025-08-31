import * as Sentry from "@sentry/react";

export const FormatDateTimestampToDate = (timestamp) => {
    if (timestamp && timestamp.seconds) {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString('he-IL');
    }
    return '';
};

export const IsDateNowGreaterThanAdDate = (adAvailableUntil) => {
    try {
        if (!adAvailableUntil) return;
        const timeOfAd = adAvailableUntil.toDate();
        const now = new Date();
        return now.getTime() > timeOfAd.getTime()
    } catch (error) {
        console.error(error)
        Sentry.captureException(`Error IsDateNowGreaterThanAdDate`, {
            tags: {
                component: "Functions"
            },
            extra: {
                info: error
            }
        });
    }
}

export const DeletedAttributesAfterUpdateForm = (data) => {
    let newData = data;
    switch (data.category) {
        case 'סוסים':
            delete newData.title;
            delete newData.seed_type;
            delete newData.semen_type;
            delete newData.accessory;
            break;

        case 'זרע':
            delete newData.title;
            delete newData.age;
            delete newData.gender;
            delete newData.accessory;
            delete newData.breed;
            break;

        case 'אביזרים':
            delete newData.title;
            delete newData.age;
            delete newData.gender;
            delete newData.breed;
            delete newData.seed_type;
            delete newData.semen_type;
            delete newData.hasCertificate;
            break;

        default:
            delete newData.age;
            delete newData.gender;
            delete newData.breed;
            delete newData.seed_type;
            delete newData.semen_type;
            delete newData.accessory;
            delete newData.price;
            delete newData.hasCertificate;
            break;
    }

    return newData;
}

export function isPhoneNumberIsraeliValid(phoneNumber) {
    const israeliPhoneRegex = /^(?:(?:(\+?972|\(\+?972\)|\+?\(972\))(?:\s|\.|-)?([1-9]\d?))|(0[23489]{1})|(0[57]{1}[0-9]))(?:\s|\.|-)?([^0\D]{1}\d{2}(?:\s|\.|-)?\d{4})$/;
    return israeliPhoneRegex.test(phoneNumber);
}