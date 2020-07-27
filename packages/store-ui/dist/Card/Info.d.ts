import { PropsWithChildren } from 'react';
interface Props {
    title?: string;
    description?: string;
}
declare function CardInfo({ title, description, children }: PropsWithChildren<Props>): JSX.Element;
export default CardInfo;
