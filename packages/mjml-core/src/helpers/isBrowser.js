export default () => typeof window === "object" && typeof document === 'object' && document.nodeType === 9 && !(window.process && window.process.type)
