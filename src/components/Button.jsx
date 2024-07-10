import PropTypes from 'prop-types';

const Button = ({ className, children, ...props }) => {
  return (
    <button
      className={`flex items-center justify-center gap-2 font-medium py-2 px-3 rounded-xl ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Button;
