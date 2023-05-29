import { SearchResult } from './SearchResult';

import axios from 'axios';

import styles from '../styles/SearchResults.module.css';
import { For, Suspense, createResource } from 'solid-js';

// https://api.modrinth.com/v2/search?query=${q}&limit=${maxResults}&index=relevance

const searchModrinth = async ({ q, maxResults }: { q: string, maxResults: number }) => {
    return await axios.get(`https://api.modrinth.com/v2/search`, {
        params: {
            query: q,
            limit: maxResults,
            index: 'relevance',
            facets: JSON.stringify([
                ["project_type:mod"]
            ])
        }
    }).then(res => {
        console.log([...res.data.hits]);
        return [...res.data.hits]
    });
};

export const SearchResults = ({ maxResults }: { maxResults: number }) => {
    const params = Object.fromEntries(new URLSearchParams(window.location.search));
    
    const [modrinthResults] = createResource({ q: params.q, maxResults}, searchModrinth);

    return (
        <div class={styles.results}>
            <Suspense fallback="Loading...">
                <h3>Modrinth</h3>
                <For each={ modrinthResults() }>{result => (
                    <SearchResult title={result.title} logo={result.icon_url ? result.icon_url : '/logo.svg'} description={result.description} id={`modrinth/${result.slug}`} author={result.author} />
                )}</For>
            </Suspense>
        </div>
    )
}