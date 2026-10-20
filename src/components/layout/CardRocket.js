import { Link } from "react-router-dom";
import '../../assets/style/components/Rockets.css';

const CardRocket = ({ rocket }) => {
    return (
        <div className='col-6 col-lg-3 d-flex mb-3'>
            <div className='card m-2 w-100 rocket-card'>
                <img
                    src={rocket.flickr_images?.[0]}
                    className='card-img-top'
                    alt={rocket.name}
                />

                <div className='card-body'>
                    <h5 className='card-title'>{rocket.name}</h5>

                    <p className='card-text d-flex flex-column'>
                        <span>Hauteur : {rocket.height?.meters ?? 'N/D'}</span>
                        <span>Diamètre : {rocket.diameter?.meters ?? 'N/D'}</span>
                        <span>Masse : {rocket.mass?.kg ?? 'N/D'}</span>
                    </p>

                    <Link
                        className='btn btn-primary'
                        to={`/rocket/${rocket.id}`}
                    >
                        Voir plus
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CardRocket;