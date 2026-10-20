import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import CardRocket from '../layout/CardRocket'
import Rocket from '../layout/Rocket'
import { toast } from 'react-toastify'
import ReactLoading from 'react-loading'
import { getSpaceXData } from '../../services/api'
import '../../assets/style/components/Rockets.css'

const Rockets = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const { id = '' } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    let active = true

    const fetchData = async () => {
      try {
        setLoading(true)

        let response

        if (id) {
          // Fiche détaillée d'une fusée
          response = await getSpaceXData(
            `/launcher_configurations/${id}/?format=json`
          )

          if (active) {
            setData(normalizeRocket(response))
          }
        } else {
          // Liste des fusées SpaceX
          response = await getSpaceXData(
            '/launcher_configurations/?manufacturer__name=SpaceX&limit=100&format=json'
          )
          console.log('Données API Rockets :', response.results)
          console.log('Première fusée :', response.results?.[0])

          if (active) {
            setData(
              (response.results || []).map(normalizeRocket)
            )
          }
        }

      } catch (error) {
        if (!active) return

        console.error(error)
        toast.error('Impossible de récupérer les fusées SpaceX')

        if (id) {
          navigate('/rockets')
        } else {
          setData([])
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      active = false
    }
  }, [id, navigate])

  if (loading) {
    return (
      <div
        className='d-flex align-items-center justify-content-center'
        style={{ height: '100vh' }}
      >
        <ReactLoading type='spokes' color='black' />
      </div>
    )
  }

  return (
    <div className='rockets-page'>
    <div className='container mt-10'>
      {Array.isArray(data) ? (
        <div className='row justify-content-center'>
          {data.map((rocket) => (
            <CardRocket
              key={rocket.id}
              rocket={rocket}
            />
          ))}
        </div>
      ) : (
        <>
          <Link
            className='btn btn-primary my-3'
            to={{ pathname: '/rockets' }}
          >
            Retour
          </Link>

          {data && <Rocket data={data} />}
        </>
      )}
    </div>
    </div>
  )
}

// Adapte les données Launch Library 2
// au format de l'ancienne API SpaceX

	const normalizeRocket = (rocket) => {
	const image =
		rocket.image?.image_url ||
		rocket.image_url ||
		null

	const manufacturer = rocket.manufacturer

	const company =
		(Array.isArray(manufacturer)
		? manufacturer[0]?.name
		: manufacturer?.name) ||
		rocket.families?.[0]?.manufacturer?.[0]?.name ||
		'SpaceX'

	const total = rocket.total_launch_count
	const successful = rocket.successful_launches

	const successRate =
		total > 0 && successful != null
		? (successful / total) * 100
		: null

	return {
		...rocket,

		id: rocket.id,
		name: rocket.name || rocket.full_name || 'Unknown Rocket',
		description: rocket.description || '',

		flickr_images: image ? [image] : [],

		height: {
		meters: rocket.length ?? null
		},

		diameter: {
		meters: rocket.diameter ?? null
		},

		mass: {
		kg: rocket.launch_mass != null
			? rocket.launch_mass * 1000
			: null
		},

		first_flight: rocket.maiden_flight ?? null,
		company: company,
		country: rocket.country?.name ?? null,
		type: rocket.full_name || rocket.name,
		active: rocket.active ?? null,

		wikipedia: rocket.wiki_url || null,

		success_rate_pct: successRate,
		cost_per_launch: rocket.launch_cost ?? null,

		// Données techniques non fournies
		// par cet endpoint
		engines: {
		number: null,
		type: null,
		version: null,
		layout: null,
		propellant_1: null,
		propellant_2: null,
		thrust_to_weight: null,
		thrust_vacuum: { kN: null },
		thrust_sea_level: { kN: null },
		isp: {
			sea_level: null,
			vacuum: null
		}
		},

		boosters: null,

		landing_legs: {
		number: null,
		material: null
		},

		// Statistiques réellement disponibles
		total_launch_count: total,
		successful_launches: successful,
		failed_launches: rocket.failed_launches ?? null,
		successful_landings: rocket.successful_landings ?? null,
		to_thrust: rocket.to_thrust ?? null
	}
}


export default Rockets
