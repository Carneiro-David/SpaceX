
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { toast } from 'react-toastify';
import { getSpaceXData } from '../../services/api';

const Membre = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const fetchMember = async () => {
      try {
        setLoading(true);
        setMember(null);

        const response = await getSpaceXData(
          `/astronauts/${id}/?format=json`
        );

        if (!active) return;

        setMember({
          ...response,
          name: response.name || 'Unknown Astronaut',
          agency: response.agency?.name || 'Unknown Agency',
          image:
            response.image?.image_url ||
            response.profile_image ||
            null,
          status: response.status?.name || 'Unknown',
          wikipedia:
            response.wiki ||
            response.wikipedia ||
            null
        });

      } catch (error) {
        if (!active) return;

        console.error(error);

        toast.error(
          'An error has occurred: Unknown Crew Member'
        );

        navigate('/crew');

      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchMember();

    return () => {
      active = false;
    };
  }, [id, navigate]);

  if (loading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          height: '100vh',
          backgroundColor: '#111111'
        }}
      >
        <ReactLoading type="spokes" color="white" />
      </div>
    );
  }

  if (!member) return null;

  const isActive =
    member.status.toLowerCase() === 'active' ||
    member.status.toLowerCase() === 'in training';

  const badgeClass = isActive
    ? 'badge bg-success rounded-circle'
    : 'badge bg-danger rounded-circle';

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#111111',
        color: 'white',
        paddingTop: '1px',
        paddingBottom: '50px'
      }}
    >
      <div className="container mt-10">
        <div className="row justify-content-center mt-4">
          <div className="col-md-6 text-center">

            <h2>
              {member.name}
              <span
                className={badgeClass}
                style={{
                  marginLeft: '10px',
                  width: '10px',
                  height: '10px',
                  padding: '6px'
                }}
              >
                <span className="visually-hidden">
                  {member.status}
                </span>
              </span>
            </h2>

            {member.image && (
              <img
                src={member.image}
                alt={member.name}
                style={{
                  width: '200px',
                  height: 'auto'
                }}
                className="img-fluid mb-3"
              />
            )}

            <p>
              <strong>Agency:</strong> {member.agency}
            </p>

            <p>
              <strong>Status:</strong> {member.status}
            </p>

            {member.wikipedia && (
              <div className="d-flex justify-content-center mb-2">
                <a
                  href={member.wikipedia}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary mr-2"
                >
                  Wikipedia Page
                </a>
              </div>
            )}

            <div className="d-flex justify-content-center">
              <Link
                to="/crew"
                className="btn btn-secondary"
              >
                Return to Crew
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Membre;
