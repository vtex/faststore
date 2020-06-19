"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: '.vtex-config',
});
module.exports = {
    siteMetadata: {
        title: 'Store Theme - VTEX Base Store',
        description: 'Store created with gatsby for a POC using VTEX API',
        author: 'Emerson Laurentino',
    },
    plugins: [
        require.resolve('gatsby-plugin-react-helmet'),
        require.resolve('gatsby-plugin-theme-ui'),
        require.resolve('gatsby-plugin-netlify'),
        {
            resolve: require.resolve('@vtex/gatsby-source-vtex'),
            options: {
                tenant: process.env.GATSBY_VTEX_TENANT,
                environment: process.env.GATSBY_VTEX_ENVIRONMENT,
            },
        },
        {
            resolve: 'gatsby-plugin-manifest',
            options: {
                name: 'Store Theme - VTEX Base Store',
                short_name: 'Store Theme',
                start_url: '/',
                background_color: '#0a034e',
                theme_color: '#0a034e',
                display: 'minimal-ui',
            },
        },
    ],
};
