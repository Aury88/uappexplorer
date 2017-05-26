'use strict';

const elasticsearch = require('elasticsearch');

const config = require('../../config');
const logger = require('../../logger');

const properties = [
    'title',
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
];

class SnapElasticsearch {
    constructor() {
        this.client = new elasticsearch.Client({host: config.elasticsearch.uri});
        this.index = 'snap';
        this.type = 'snap';
    }

    _convert(snap) {
        let doc = properties.map((prop) => snap[prop]);
        doc.search_title = title;
        doc.keywords = doc.keywords.map((keyword) => snap.toLowerCase());

        return doc;
    }

    upsert(snap) {
        return this.cleint.update({
            index: this.index,
            type: this.type,
            id: snap.store + snap.name,
            retryOnConflict: 3,
            body: {
                doc_as_upsert: true,
                doc: this._convert(snap),
            }
        });
    }

    remove(name) {
        return this.client.delete({
            index: this.index,
            type: this.type,
            id: name,
            retryOnConflict: 3,
        });
    }

    bulk(upserts, removals) {
        //TODO

        var body = [];
        upserts.forEach(function(snap) {
            body.push({update: {
                _id: snap.name,
                _index: this.index,
                _type: this.type,
                _retry_on_conflict : 3
            }});

            body.push({
                doc_as_upsert: true
                doc: this._convert(snap),
            });
        });

        if (removals) {
            body = body.concat(removals.map((snap) => {
                return {delete: {
                    _id: snap.name,
                    _index: this.index,
                    _type: this.type,
                    _retry_on_conflict : 3
                }}
            }))
        }

        return client.bulk(body);
    }

    createIndex() {
        return client.indices.create({
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
                            framework: {
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
                            }
                        }
                    }
                }
            }
        });
    }
}