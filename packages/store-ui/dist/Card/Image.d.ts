import { PropsWithChildren } from 'react';
interface Props {
    href: string;
    alt: string;
    src: string;
}
declare function CardImage({ alt, src, href }: PropsWithChildren<Props>): JSX.Element;
export default CardImage;
