import { useState, useEffect } from "react";
import ky from "ky";
import _ from "lodash";
import './project.css';

function useError () {
  const [error, setError] = useState({})
  const checkError = (message) => {
    setError(m => message)
  }

  return [error, checkError];
}

function fetchProjects (errFunc) {
  const [projects, setProjects] = useState([]);
  const baseUrl = import.meta.env.PUBLIC_API_URL
  const enpointProjects = import.meta.env.PUBLIC_API_ENDPOINT_PROJECT
  const endpoint = new URL(enpointProjects, baseUrl);

  const pFetch = async (useErr) => {
    try {
      const response = await ky.get(endpoint).json()
      setProjects((p) => response.data.projects)
    } catch (error) {
      const responseError = await error.response?.json() ?? {message: "Une erreur s'est produite..."};
      useErr(responseError)
    }
  }


  useEffect(() => {
    pFetch(errFunc)
  }, [])

  return [projects]
}

function LoadingView () {
  return  <div className="main-item">
    <div className="animated-background">
      <div className="background-masker btn-divide-left"></div>
    </div>
  </div>
}

function LinkView ({content}) {
  return (
    <a href={content.url} target="_blank" style={{pointerEvents: (content.url ? 'all' : 'none') }}>
      <img src={content.icon_url} />
      {content.name}
    </a>
  )
}

function ProjectView ({content}) {
  return (
    <div className="col-project">
        <img src={content.image_url} />
        <div>
          <h3>{content.name}</h3>
          <p>{content.description}</p>
          <div className="links-of-project">
            { content.link ? 
              content.link.map((l, index) => <LinkView content={l} key={index} />) : 
              null
            }
          </div>
        </div>
      </div>
  )
}

function ErrorView ({error}) {
  return (
    <div className="projects-error">
      <div className="oups-error">Ooups !</div>
      <div className="nbr-http-error">
        <small>Erreur</small>
        <div>{error.statusCode ?? 500}</div>
      </div>
      <p>
        { error.message ?? "Une erreur s'est produite..." }
      </p>
    </div>
  )
}

function ProjectsList () {
  
  const [error, checkError] = useError()
  const [projects] = fetchProjects(checkError)

  return (
    <>
      { (_.isEmpty(error))
        ?
          (projects.length > 0)
           ? 
            projects.map((p, index) => <ProjectView content={p} key={index}/>)
          : 
          <LoadingView />
        :
          <ErrorView error={error} />
      }
    </>
  )
}

export function Projects () {
  return <ProjectsList />
}