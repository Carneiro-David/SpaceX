
// import axios from 'axios'
import { getSpaceXData } from '../../services/api'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import '../../assets/style/components/History.css'

// const API = 'https://lldev.thespacedevs.com/2.3.0'

const History = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [nextPage, setNextPage] = useState(null)
  const [loadingMore, setLoadingMore] = useState(false)


	useEffect(() => {
	let active = true

	const fetchData = async () => {
		try {
		setLoading(true)
		setError('')

		const result = await getSpaceXData(
			'/launches/previous/?lsp__id=121&ordering=-net&limit=20&mode=normal&format=json'
		)

		if (!active) return

		setData(result.results || [])
		setNextPage(result.next || null)

		} catch (err) {
		if (!active) return

		const message = err.response?.status === 429
			? 'Limite de requêtes API atteinte.'
			: 'Impossible de récupérer les lancements SpaceX.'

		setError(message)
		toast.error(message)

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
	}, [])


  
	const loadMore = async () => {
		if (!nextPage || loadingMore) return

		try {
			setLoadingMore(true)

			// Convertit l'URL de pagination en endpoint
			const url = new URL(nextPage, 'https://lldev.thespacedevs.com')
			const endpoint = url.pathname.replace(/^\/2\.3\.0/, '') + url.search

			const result = await getSpaceXData(endpoint)
			const newLaunches = result.results || []

			setData(previous => {
			const ids = new Set(previous.map(item => item.id))

			return [
				...previous,
				...newLaunches.filter(item => !ids.has(item.id))
			]
			})

			setNextPage(result.next || null)

		} catch (err) {
			toast.error(
			err.response?.status === 429
				? 'Limite de requêtes atteinte.'
				: 'Impossible de charger les lancements suivants.'
			)
		} finally {
			setLoadingMore(false)
		}
	}


  if (loading) {
    return (
      <section className='design-section pt-10 text-center'>
        <p>Chargement des lancements SpaceX...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className='design-section pt-10 text-center'>
        <p>{error}</p>
      </section>
    )
  }

  return (
    <section className='design-section pt-10'>
      <div
        className='timeline accordion accordion-flush'
        id='accordionExample'
      >
        {data.map((time, index) => {
          const isOdd = index % 2 === 0
          const collapseId = `launch-${time.id}`

          const links = [
            time.webcast_live && time.vid_urls?.[0]?.url,
            ...(time.vid_urls || []).map(video => video.url),
            time.image?.image_url
          ].filter(Boolean)

          const uniqueLinks = [...new Set(links)]

          return (
            <div
              key={time.id}
              style={{ display: 'contents' }}
            >
              {isOdd && (
                <>
                  <div className='timeline-empty'></div>

                  <div className='timeline-middle'>
                    <div className='timeline-circle'></div>
                  </div>
                </>
              )}

              <div className='timeline-component timeline-content accordion-item'>
                <button
                  className='accordion-button collapsed'
                  type='button'
                  data-bs-toggle='collapse'
                  data-bs-target={`#${collapseId}`}
                  aria-expanded='false'
                  aria-controls={collapseId}
                  style={{
                    background: '#1f1f1f',
                    color: 'white'
                  }}
                >
                  <div>
                    <p className='timeline-date'>
                      <b>
                        {time.net
                          ? format(new Date(time.net), 'yyyy-MM-dd')
                          : 'Date inconnue'}
                      </b>
                    </p>

                    <h3 className='accordion-header'>
                      {time.name}
                    </h3>
                  </div>
                </button>

                <div
                  id={collapseId}
                  className='accordion-collapse collapse'
                  data-bs-parent='#accordionExample'
                >
                  <div className='accordion-body'>
                    <p>
                      <strong>Statut : </strong>
                      {time.status?.name || 'Non renseigné'}
                    </p>

                    <p>
                      <strong>Fusée : </strong>
                      {time.rocket?.configuration?.full_name ||
                        time.rocket?.configuration?.name ||
                        'Non renseignée'}
                    </p>

                    <p>
                      <strong>Base de lancement : </strong>
                      {time.pad?.name || 'Non renseignée'}
                    </p>

                    <p>
                      {time.mission?.description ||
                        'Aucune description disponible pour cette mission.'}
                    </p>

                    <div className='list-group list-group-horizontal'>
                      {uniqueLinks.map((link, linkIndex) => (
                        <a
                          key={linkIndex}
                          href={link}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='list-group-item list-group-item-action info-button'
                        >
                          Link {linkIndex + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {!isOdd && (
                <>
                  <div className='timeline-middle'>
                    <div className='timeline-circle'></div>
                  </div>

                  <div className='timeline-empty'></div>
                </>
              )}
            </div>
          )
        })}
      </div>

      {data.length === 0 && (
        <p className='text-center'>
          Aucun lancement trouvé.
        </p>
      )}

      {nextPage && (
        <div className='text-center py-5'>
          <button
            className='btn btn-outline-light'
            onClick={loadMore}
            disabled={loadingMore}
          >
            {loadingMore
              ? 'Chargement...'
              : 'Afficher 20 lancements supplémentaires'}
          </button>
        </div>
      )}
    </section>
  )
}

export default History
