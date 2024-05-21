import EmailIcon from './emailIcon.svg'
import Card from './card.svg'
import Checked from './checked.svg'
import Cupom from './cupom.svg'
import Location from './location.svg'
import Money from './money.svg'
import Rightarrow from './rightarrow.svg'
import Dots from './dots.svg'
import Edit from './edit.svg'
import Delete from './delete.svg'
import Cart from './cart.svg'

type Props = {
    icon: string;
    color: string;
    largura: number;
    altura: number;
}

export const Icon = ({ icon, color, largura, altura }: Props) => {

    return (

        <div style={{}}>

            {icon === 'emailIcon' && <EmailIcon color={color} />}
            {icon === 'card' && <Card color={color} />}
            {icon === 'checked' && <Checked color={color} />}
            {icon === 'cupom' && <Cupom color={color} />}
            {icon === 'location' && <Location color={color} />}
            {icon === 'money' && <Money color={color} />}
            {icon === 'rightarrow' && <Rightarrow color={color} />}
            {icon === 'dots' && <Dots color={color} />}
            {icon === 'edit' && <Edit color={color} />}
            {icon === 'delete' && <Delete color={color} />}
            {icon === 'cart' && <Cart color={color} />}
        </div>
    );
}