declare const CardTheme: {
    card: {
        margin: string;
        width: string;
        maxWidth: string[];
        maxHeight: string;
        background: string;
        flexWrap: string;
        image: {
            width: string[];
            display: string;
            maxHeight: string;
            objectFit: string;
            link: {
                flex: number;
            };
            content: {
                width: string;
            };
        };
        info: {
            padding: number[];
            flexDirection: string;
            justifyContent: string;
            alignItems: string;
            width: string[];
            action: {
                marginTop: number;
            };
        };
    };
};
export default CardTheme;
