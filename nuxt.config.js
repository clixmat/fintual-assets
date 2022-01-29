export default {
    head: {
        title: 'fintual-demo',
        htmlAttrs: {
            lang: 'es'
        },
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' },
            { name: 'format-detection', content: 'telephone=no' }
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    },
    axios: {},
    build: {},
    buildModules: ['@nuxtjs/eslint-module'],
    components: true,
    modules: ['@nuxtjs/axios']
}
