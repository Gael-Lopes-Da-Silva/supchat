export const isSafeUrl = (url) => {  // evite les injections xss dans l'url par exemple un truc du style "javascript:alert('hacked mdr')"
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  };