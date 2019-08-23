// Place here global interface and variable that should be available globally
declare var module;

declare module '*.json' {
    const value: any;
    export default value;
}
