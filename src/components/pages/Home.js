
// import axios from 'axios'
import { getSpaceXData } from '../../services/api'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import ReactLoading from 'react-loading'
import '../../assets/style/components/Home.css'

// const API = 'https://lldev.thespacedevs.com/2.3.0'

const formatNumber = (value) =>
  typeof value === 'number'
    ? value.toLocaleString('fr-FR')
    : 'N/D'

const picture = (item) =>
  item?.image?.image_url || item?.image_url || null

const Home = () => {
  const [agency, setAgency] = useState(null)
  const [rockets, setRockets] = useState([])
  const [pads, setPads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
      let active = true

      const load = async () => {
        try {
          setLoading(true)
          setError('')

          const [
            agencyData,
            rocketsData,
            launchesData
          ] = await Promise.all([
            getSpaceXData('/agencies/121/?format=json'),
            getSpaceXData(
              '/launcher_configurations/?manufacturer__name=SpaceX&limit=100&format=json'
            ),
            getSpaceXData(
              '/launches/?lsp__id=121&limit=100&ordering=-net&format=json'
            )
          ])

          if (!active) return

          setAgency(agencyData)
          setRockets(rocketsData.results || [])

          const distinctPads = new Map()

          for (const launch of (launchesData.results || [])) {
            const pad = launch.pad

            if (pad?.id && !distinctPads.has(pad.id)) {
              distinctPads.set(pad.id, pad)
            }
          }

          setPads(Array.from(distinctPads.values()))

        } catch (e) {
          if (!active) return

          const message = e.response?.status === 429
            ? 'Limite de requêtes API atteinte.'
            : `Impossible de récupérer les données SpaceX : ${e.message}`

          setError(message)
          toast.error(message)

        } finally {
          if (active) {
            setLoading(false)
          }
        }
      }

      load()

      return () => {
        active = false
      }
  }, [])

  if (loading) {
    return (
      <section className='d-flex justify-content-center'>
        <ReactLoading
          type='spokes'
          color='black'
          className='pt-15'
        />
      </section>
    )
  }

  if (error) {
    return (
      <section className='p-5 text-center'>
        <h2>API indisponible</h2>
        <p>{error}</p>
      </section>
    )
  }

  if (!agency) {
    return (
      <section className='p-5 text-center'>
        Aucune donnée SpaceX reçue.
      </section>
    )
  }

  const socials = agency.social_media_links || []
  const website = agency.info_url || 'https://www.spacex.com/'
  const xLink = socials.find(
    x => x.social_media?.name === 'X'
  )?.url

  return (
    <>
      <section className='section-block launcher-background'>
        <div className='d-flex align-items-center flex-column h-100 w-100 text-white launcher'>
          <h1 className='spaceX title'>
            {agency.name || 'SpaceX'}
          </h1>

          <div>
            <a
              className='text-white'
              href={website}
              title='Site officiel'
              target='_blank'
              rel='noreferrer'
            >
              <i className='fa-solid fa-globe fa-lg mx-2' />
            </a>

            {xLink && (
              <a
                className='text-white'
                href={xLink}
                title='SpaceX sur X'
                target='_blank'
                rel='noreferrer'
              >
                <i className='fa-brands fa-twitter fa-lg mx-2' />
              </a>
            )}
          </div>

          <div className='row justify-content-center mt-10'>
            <div className='cardHome col-12 col-md-6 m-3'>
              <div className='text-end pe-4 icon'>
                <i className='fa-solid fa-rocket fa-2xl text-white' />
              </div>
              <h2 className='mt-5'>
                {formatNumber(agency.total_launch_count)} lancements
              </h2>
            </div>

            <div className='cardHome col-12 col-md-6 m-3'>
              <div className='text-end pe-4 icon'>
                <i className='fa-solid fa-check fa-2xl text-white' />
              </div>
              <h3 className='mt-5'>
                {formatNumber(agency.successful_launches)} lancements réussis
              </h3>
            </div>

            <div className='cardHome col-12 col-md-6 m-3'>
              <div className='text-end pe-4 icon'>
                <i className='fa-solid fa-space-shuttle fa-2xl text-white' />
              </div>
              <h3 className='mt-5'>
                {formatNumber(rockets.length)} configurations de fusées
              </h3>
            </div>

            <div className='cardHome col-12 col-md-6 m-3'>
              <div className='text-end pe-4 icon'>
                <i className='fa-solid fa-location-dot fa-2xl text-white' />
              </div>
              <h3 className='mt-5'>
                {formatNumber(pads.length)} bases repérées dans les 100 lancements récents
              </h3>
            </div>
          </div>

          {/* <div className='footer-address'>
            {agency.founding_year || 'N/D'} - {new Date().getFullYear()}
            {' · '}
            {agency.description || 'SpaceX'}
          </div> */}
        </div>
      </section>

      {/* <section className='section-block'>
        <div className='row me-0'>
          {pads.map(pad => (
            <div
              key={pad.id}
              className='col-12 col-lg-4 px-0 auto-h'
            >
              <figure className='snipParent'>
                {picture(pad) ? (
                  <img
                    className='basic-img'
                    src={picture(pad)}
                    alt={pad.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div className='p-5'>
                    Image indisponible
                  </div>
                )}

                <figcaption>
                  <h3 className='Parenth3'>{pad.name}</h3>
                  <h4 className='Parenth4'>
                    {pad.location?.name || 'Launchpad'}
                  </h4>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </section> */}

      {/* <section className='section-block'>
        <div className='row me-0'>
          {rockets.map(rocket => (
            <div
              key={rocket.id}
              className='col-12 col-md-4 px-0'
            >
              <figure className='snipParent'>
                {picture(rocket) ? (
                  <img
                    className='basic-img'
                    src={picture(rocket)}
                    alt={rocket.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div className='p-5'>
                    Image indisponible
                  </div>
                )}

                <figcaption>
                  <h3 className='Parenth3'>
                    {rocket.full_name || rocket.name}
                  </h3>
                  <h4 className='Parenth4'>
                    Fusée SpaceX
                  </h4>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </section> */}
    </>
  )
}

export default Home
