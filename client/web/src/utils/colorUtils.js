export const getBackground = (text) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = (hash << 5) - hash + text.charCodeAt(i);
    }

    return `#${((hash >> 24) & 0xff).toString(16).padStart(2, "0")}${(
        (hash >> 16) & 0xff
    ).toString(16).padStart(2, "0")}${((hash >> 8) & 0xff).toString(16).padStart(2, "0")}`;
};

export const getForeground = (text) => {
    const background = getBackground(text);
    const color = background.replace("#", "");

    const r = parseInt(color.substring(0, 2), 16) / 255;
    const g = parseInt(color.substring(2, 4), 16) / 255;
    const b = parseInt(color.substring(4, 6), 16) / 255;

    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    return luminance > 0.5 ? "#000000" : "#FFFFFF";
};
