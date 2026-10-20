import React, { useState, useEffect } from 'react';
import ElementListEquipage from '../ElementListEquipage';
import SearchBar from '../SearchBar';
import ReactLoading from 'react-loading';
import { getSpaceXData } from '../../services/api';
import '../../assets/style/components/Crew.css'

const ListEquipage = () => {
  const [equipage, setEquipage] = useState([]);
  const [filteredEquipage, setFilteredEquipage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const fetchEquipage = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await getSpaceXData(
          '/astronauts/?limit=100&format=json'
        );

        if (!active) return;

        const astronauts = (response.results || []).map(person => ({
          ...person,
          name: person.name || 'Inconnu',
          agency: person.agency?.name || 'Non renseignée',
          image:
            person.image?.image_url ||
            person.profile_image ||
            null,
          status: person.status?.name || 'Non renseigné'
        }));

        setEquipage(astronauts);
        setFilteredEquipage(astronauts);

      } catch (error) {
        if (!active) return;
        console.error(error);
        setError('Impossible de récupérer les astronautes.');
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchEquipage();

    return () => {
      active = false;
    };
  }, []);

  const handleSearch = (query) => {
    const search = query.toLowerCase();

    const filteredData = equipage.filter((data) => {
      const name = data.name.toLowerCase();
      const agency = data.agency.toLowerCase();

      return name.includes(search) || agency.includes(search);
    });

    setFilteredEquipage(filteredData);
  };

  return (
    <div className="crew-page">
      <div className="container mt-10">
        <div className="row mt-4">
          <div className="col-12 col-md-6">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {error && (
          <p className="text-center text-danger mt-4">
            {error}
          </p>
        )}

        <div className="row mt-4">
          {loading ? (
            <div className="col d-flex justify-content-center align-items-center">
              <ReactLoading type="spokes" color="black" />
            </div>
          ) : filteredEquipage.length > 0 ? (
            filteredEquipage.map((data) => (
              <ElementListEquipage key={data.id} data={data} />
            ))
          ) : (
            <div className="col text-center">
              Aucun astronaute trouvé.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListEquipage;
