
import { useState } from 'react';
import styles from './styles.module.css';
import SearchIcon from './searchIcon.svg';
import { useAppContext } from '../../contexts/app';

type Props = {
    onSearch: (searchValue: string) => void;
}

export const SearchInput = ({ onSearch }: Props) => {
    const { tenent } = useAppContext();

    const [focused, setFocused] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {


        //if (event.code === 'Enter'){

        onSearch(searchValue);
        //}
    };


    return (

        <div
            className={styles.container}
            style={{ borderColor: focused ? tenent?.main_color : '#FFFFFF' }}>

            <div
                className={styles.button}
                onClick={() => onSearch(searchValue)}



            >
                <SearchIcon className={styles.searchicon} color={tenent?.main_color} />

            </div>

            <input

                type="text"
                className={styles.input}
                placeholder="O que  você procura?"
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyUp={handleKeyUp}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />

        </div>

    );
}