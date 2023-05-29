import { SearchResult } from './SearchResult';
import styles from '../styles/SearchResults.module.css';

import axios from 'axios';

import { For, Show, Suspense, createResource } from 'solid-js';
import Fa from 'solid-fa';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const params = Object.fromEntries(new URLSearchParams(window.location.search));

const searchModrinth = async (maxResults: number) => {
    return await axios.get(`https://api.modrinth.com/v2/search`, {
        params: {
            query: params.q,
            limit: maxResults,
            offset: (Number(params.p ? params.p : '1') - 1) * maxResults,
            index: 'relevance',
            facets: JSON.stringify([
                ["project_type:mod"]
            ])
        }
    }).then(res => {
        console.log([...res.data.hits]);
        console.log([...res.data.hits].length);
        return [...res.data.hits]
    });
};

const setParam = (param: string, value: any) => {
    params[param] = JSON.stringify(value);

    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]: string[]) => {
        searchParams.set(key, value);
    });

    window.location.search = searchParams.toString();
}

if (Number(params.p) <= 0 || params.p == null) setParam('p', 1);

export const SearchResults = ({ maxResults }: { maxResults: number }) => {
    const [modrinthResults] = createResource(maxResults, searchModrinth);

    return (
        <div class={styles.results}>
            <Suspense fallback="Loading...">
                <h3>Modrinth</h3>
                <div class={styles.nav}>
                    <button class={styles.nav_btn} onClick={() => setParam('p', Number(params.p) - 1)}>
                        <Fa icon={faChevronLeft} scale={2} />
                        <h3 class={styles.nav_btn_text_pre}>Previous</h3>
                    </button>
                    <button class={styles.nav_btn} onClick={() => setParam('p', Number(params.p) + 1)}>
                    <h3 class={styles.nav_btn_text_next}>Next</h3>
                        <Fa icon={faChevronRight} scale={2} />
                    </button>
                </div>
                <For each={ modrinthResults() } fallback={(
                    <Show when={Number(params.p) == 1} fallback={<h4>Sorry, no results on this page.</h4>}>
                        <h4>Sorry, this search didn't show any results.</h4>
                    </Show>
                )}>{result => (
                    <SearchResult title={result.title} logo={result.icon_url ? result.icon_url : '/logo.svg'} description={result.description} id={`modrinth/${result.slug}`} author={result.author} />
                )}</For>
                <div class={styles.nav}>
                        <button class={styles.nav_btn} onClick={() => setParam('p', Number(params.p) - 1)}>
                            <Fa icon={faChevronLeft} scale={2} />
                            <h3 class={styles.nav_btn_text_pre}>Previous</h3>
                        </button>
                        <button class={styles.nav_btn} onClick={() => setParam('p', Number(params.p) + 1)}>
                            <h3 class={styles.nav_btn_text_next}>Next</h3>
                            <Fa icon={faChevronRight} scale={2} />
                        </button>
                    </div>
            </Suspense>
        </div>
    )
}