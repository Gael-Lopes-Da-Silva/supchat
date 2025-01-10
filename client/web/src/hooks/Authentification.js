export function authentificationHook(navigate) {
    // TODO: Regarder la validité du token en faisant un appel à l'API
    
    if (!localStorage.getItem('user')) {
        navigate('/login', { state: { expired: true } });
        return;
    }
}