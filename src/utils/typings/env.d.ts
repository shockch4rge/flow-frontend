declare module NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test';
        API_BASE_URL: string;
    }
}