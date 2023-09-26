import { useState, useEffect } from "react";
import './project.css';

function fetchProjects () {
  const [projects, setProjects] = useState([]);
  const baseUrl = import.meta.env.PUBLIC_API_URL
  const enpointProjects = import.meta.env.PUBLIC_API_ENDPOINT_PROJECT
  const endpoint = new URL(enpointProjects, baseUrl);

  const pFetch = () => fetch(endpoint).then((response) => {
    return response.json()
  }).then((data) => {
    setProjects(data.data.projects)
  });

  useEffect(() => {
    pFetch()
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
  console.log(content)
  return (
    <a href={content.url} style={{pointerEvents: (content.url ? 'all' : 'none') }}>
      <img src={content.icon_url} />
      {content.name}
    </a>
  )
}

function ProjectView ({content}) {
  console.log(content)
  return (
    <div className="col-project">
        <img src="/website-page-web-svgrepo-com.png" />
        <div>
          <h3>{content.name}</h3>
          <span>{content.description}</span>
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

function ProjectsList () {

  const [projects] = fetchProjects();
  console.log(projects)

  return (
    <>
      { 
        projects.length > 0 ? 
          projects.map((p, index) => <ProjectView content={p} key={index}/>)
        : <LoadingView />
      }
    </>
  )
}

export function Projects () {
  return <ProjectsList />
}