package com.example.instantsearch.app;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;

import com.algolia.instantsearch.helpers.Searcher;
import com.algolia.instantsearch.helpers.InstantSearch;

public class MainActivity extends AppCompatActivity {
    private static final String ALGOLIA_APP_ID = "{{appId}}";
    private static final String ALGOLIA_SEARCH_API_KEY = "{{apiKey}}";
    private static final String ALGOLIA_INDEX_NAME = "{{indexName}}";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        final Searcher searcher = Searcher.create(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY, ALGOLIA_INDEX_NAME);
        final InstantSearch helper = new InstantSearch(this, searcher);
        helper.search(); // First empty search to display default results
    }
}
