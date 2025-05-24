import styles from './Header.module.css';

function Header(){
    return(
            <div className={styles.header}>
            <header><b>Welcome to Janky</b></header>
            </div>
        
    );
}

export default Header;