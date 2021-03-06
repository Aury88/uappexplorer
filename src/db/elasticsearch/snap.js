'use strict';

const Elasticsearch = require('./elasticsearch');

class SnapElasticsearch extends Elasticsearch {
    constructor() {
        super();

        this.index = 'snap';
        this.type = 'snap';
  
        this.properties = [
            'name',
            'title',
            'store',
            'description',
            'keywords',
            'author',
            'company',
            'license',
            'architecture',
            'icon_hash',
            'bayesian_average',
            'points',
            'tagline',
            'type',
            'categories',
            'confinement',
        ];
        
        this.search_fields = [
            'search_title^3',
            'description^2',
            'keywords^2',
            'author',
            'company'
        ];
    }

    createIndex() {
        return this.client.indices.create({
            index: this.index,
            body: {
                snap: this.index,
                settings: {
                    analysis: {
                        analyzer: {
                            lower_standard: {
                                type: 'custom',
                                tokenizer: 'standard',
                                filter: 'lowercase'
                            }
                        }
                    }
                },
                mappings: {
                    snap: {
                        properties: {
                            search_title: {
                                type: 'string',
                                analyzer: 'lower_standard'
                            },
                            store: {
                                type: 'string',
                                analyzer: 'lower_standard'
                            },
                            description: {
                                type: 'string',
                                analyzer: 'lower_standard'
                            },
                            keywords: {
                                type: 'string',
                                analyzer: 'lower_standard'
                            },
                            author: {
                                type: 'string',
                                analyzer: 'lower_standard'
                            },
                            company: {
                                type: 'string',
                                analyzer: 'lower_standard'
                            },
                            license: {
                                type: 'string',
                                index: 'not_analyzed'
                            },
                            architecture: {
                                type: 'string',
                                index: 'not_analyzed'
                            },
                            title: {
                                type: 'string',
                                index: 'not_analyzed'
                            },
                            confinement: {
                                type: 'string',
                                index: 'not_analyzed'
                            }
                        }
                    }
                }
            }
        });
    }
}

module.exports = SnapElasticsearch;
