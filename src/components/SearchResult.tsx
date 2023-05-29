import styles from '../styles/SearchResult.module.css';

interface SearchResultProps {
    logo: string,
    title: string,
    description: string,
    id: string,
    author: string
}

export const SearchResult = (props: SearchResultProps) => (
    <a class={styles.result} href={`/view#${props.id}`}>
        <img src={props.logo} alt="Mod Logo..." class={styles.logo} />
        <div class={styles.content}>
            <span class={styles.title}>{`${props.title} - ${props.author}`}</span>
            <p>{props.description}</p>
        </div>
    </a>
);