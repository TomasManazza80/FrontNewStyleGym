// PlanCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PurpleBtn from '../PurpleBtn/PurpleBtn';
import './PlanCard.css'; // Debes crear este archivo CSS también

const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: 'easeOut' }
    }
};

const PlanCard = ({ title, price, description, features, buttonText, isFeatured }) => {
    return (
        <motion.div
            className={`col-md-4 mb-4 ${isFeatured ? 'featured-plan' : ''}`}
            variants={cardVariants}
        >
            <div className="r22-plan-card">
                <h3 className="r22-plan-title">{title}</h3>
                <p className="r22-plan-price">{price}</p>
                <p className="r22-plan-desc">{description}</p>
                <ul className="r22-plan-features">
                    {features.map((feature, index) => (
                        <li key={index}>
                            <FontAwesomeIcon icon={faCheck} className="r22-feature-icon" /> {feature}
                        </li>
                    ))}
                </ul>
                <PurpleBtn btnTitle={buttonText} />
            </div>
        </motion.div>
    );
};

export default PlanCard;