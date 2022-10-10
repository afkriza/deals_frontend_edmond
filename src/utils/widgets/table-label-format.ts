const DAY_GRANULATION_DATE_FORMAT = /^\d{2}\.\d{2}\.\d{4}$/;

export function formatTableLabel(label: string) {
    if (label?.match(DAY_GRANULATION_DATE_FORMAT)) {
        const dateParts = label.split('.');

        return `${dateParts[0]}.${dateParts[1]}`;
    }

    return label;
}
