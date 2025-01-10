import './Link.css';

const Link = ({ text, onClick }) => {
    return (
        <span className='link' onClick={onClick}>{text}</span>
    );
};

export default Link;