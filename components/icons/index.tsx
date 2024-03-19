import EmailIcon from './emailIcon.svg'

type Props = {
    icon: string;
    color: string;
    largura: number;
    altura: number;
}
 
export const Icon = ({icon, color, largura, altura}: Props) => {
    
    return(

        <div style= {{}}>

            {icon === 'emailIcon' && <EmailIcon color={color}/>}
        </div>
    );
}