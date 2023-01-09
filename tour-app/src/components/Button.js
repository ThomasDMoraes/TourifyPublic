function Button(props) {
    const { text, onClick } = props;

    if (props.children) {
        return (
            <button
                type={props.type}
                className={props.className}
                onClick={onClick}
                disabled={props.disabled}
            >
                {props.children}
            </button>
        );
    }
    if (!props.icon && props.text) {
        return (
            <button
                type={props.type}
                className={props.className}
                onClick={onClick}
                disabled={props.disabled}
            >
            <span>{text}</span>
            </button>
        );
    }
    if (props.icon && !props.text) {
        return (
            <button
                type={props.type}
                className={props.className}
                onClick={onClick}
                alt={props.alt}
                disabled={props.disabled}
            >
                <img src={props.icon} alt={props.alt}/>
            </button>
        );
    }
    if (props.right) {
        return (
            <button
                type={props.type}
                className={props.className}
                onClick={onClick}
                disabled={props.disabled}>
                <span>{text}</span>
                <img src={props.icon} />
            </button>
        );
    }
    return (
        <button
            type={props.type}
            className={props.className}
            onClick={onClick}
            disabled={props.disabled}>
            <img src={props.icon} />
            <span>{text}</span>
        </button>
    );
}

export default Button;